import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(registerSchema) });

  // * Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    //? 1 - Pending => Loading
    setIsLoading(true);

    try {
      //* 2 - Fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axiosInstance.post("/auth/local/register", data);
      if (status == 200) {
        toast.success(
          "You will navigate to the login page after 4 seconds  to login!",
          {
            position: "top-center",
            duration: 4000,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
        setTimeout(() => {
          window.location.href = "/login";
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
  const renderRegisterForm = REGISTER_FORM.map(
    ({ name, placeholder, type }, idx) => (
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
    )
  );

  return (
    <div>
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form
        className="space-y-3 max-w-sm mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderRegisterForm}
        <Button type="submit" fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
