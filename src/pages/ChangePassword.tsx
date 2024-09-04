import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { isLightMode, userData } from "../utils/Helper";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios.config";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "../validation";
import { useState } from "react";

interface IFormInput {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(passwordSchema),
  });

  // * Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/change-password`, data, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (response.status === 200) {
        toast.success("Your password is updated successfully", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: isLightMode() ? "white" : "black",
            color: isLightMode() ? "black" : "white",
            width: "fit-content",
          },
        });
        reset();
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
        style: {
          backgroundColor: isLightMode() ? "white" : "black",
          color: isLightMode() ? "black" : "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          className="text-sm mb-2 block text-lightText dark:text-darkText"
          htmlFor="currentPassword"
        >
          Current Password:
        </label>
        <Input
          id="currentPassword"
          {...register("currentPassword")}
          type="password"
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className="text-red-700 dark:text-red-500 text-sm font-semibold mt-1">
            {errors.currentPassword?.message}
          </p>
        )}
      </div>
      <div>
        <label
          className="text-sm mb-2 block text-lightText dark:text-darkText"
          htmlFor="password"
        >
          New Password:
        </label>
        <Input
          id="password"
          {...register("password")}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-700 dark:text-red-500 text-sm font-semibold mt-1">
            {errors.password?.message}
          </p>
        )}
      </div>
      <div>
        <label
          className="text-sm mb-2 block text-lightText dark:text-darkText"
          htmlFor="passwordConfirmation"
        >
          Password Confirmation:
        </label>
        <Input
          id="passwordConfirmation"
          placeholder="Confirm your password"
          {...register("passwordConfirmation")}
          type="password"
        />
        {errors.passwordConfirmation && (
          <p className="text-red-700 dark:text-red-500 text-sm font-semibold mt-1">
            {errors.passwordConfirmation?.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="!bg-indigoLight hover:bg-indigo-800 transition-all duration-300 text-white"
      >
        Change
      </Button>
    </form>
  );
};

export default ChangePassword;
