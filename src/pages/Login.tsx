import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios.config";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  // * Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    //? 1 - Pending => Loading
    setIsLoading(true);

    try {
      //* 2 - Fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axiosInstance.post("/auth/local", data);
      if (status == 200) {
        toast.success("You will navigate to the home page after 4 seconds!", {
          position: "top-center",
          duration: 4000,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          window.location.href = "/home";
        }, 4000);
      }
    } catch (error) {
      //! 3 - Rejected => Field => (OPTIONAL)
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // * Renders
  const renderLoginForm = LOGIN_FORM.map(({ name, placeholder, type }, idx) => (
    <div key={idx}>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-red-700 text-sm font-semibold mt-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  ));

  return (
    <div>
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form
        className="space-y-3 max-w-sm mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderLoginForm}
        <Button type="submit" fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
