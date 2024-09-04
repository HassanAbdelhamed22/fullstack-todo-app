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
import { useNavigate } from "react-router-dom";
import img from "../assets/register.svg";
import google from "../assets/google.png";
import { Link } from "react-router-dom";
import { isLightMode } from "../utils/Helper";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(registerSchema) });

  // * Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //? 1 - Pending => Loading
    setIsLoading(true);

    try {
      //* 2 - Fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axiosInstance.post("/auth/local/register", data);
      if (status == 200) {
        toast.success(
          "You will navigate to the login page after 2 seconds to login!",
          {
            position: "top-center",
            duration: 2000,
            style: {
              backgroundColor: isLightMode() ? "white" : "black",
              color: isLightMode() ? "black" : "white",
              width: "fit-content",
            },
          }
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      //! 3 - Rejected => Field => (OPTIONAL)
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

  // * Renders
  const renderRegisterForm = REGISTER_FORM.map(
    ({ name, placeholder, type, label }, idx) => (
      <div key={idx} className="mb-4">
        <label
          className="text-sm font-medium mb-2 block text-lightText dark:text-darkText"
          htmlFor={name}
        >
          {label}
        </label>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
        />
        {errors[name] && (
          <p className="text-red-700 dark:text-red-500 text-sm font-semibold mt-1">
            {errors[name]?.message}
          </p>
        )}
      </div>
    )
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-lightBg dark:bg-darkBg">
      <div className="flex items-stretch justify-between flex-col-reverse md:flex-row border border-borderLight dark:border-borderDark rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden">
        <div className="p-8 md:p-12 flex-[45%] flex flex-col justify-center">
          <h2 className="mb-4 text-4xl font-bold text-lightText dark:text-darkText">
            Join Us!
          </h2>
          <p className="text-secondaryLightText dark:text-secondaryDarkText mb-8">
            Complete your registration by filling out the details below.
          </p>
          <form
            className="space-y-4 max-w-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            {renderRegisterForm}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-gradient-to-br from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-[#DCDAFA] transition-all duration-300 text-white dark:text-gray-900"
            >
              Register
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-darkBg text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              className="bg-inherit dark:bg-inherit border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <img src={google} alt="google icon" className="w-5 h-5 " />
              Sign up with Google
            </Button>
            <p className="text-sm text-secondaryLightText dark:text-secondaryDarkText text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigoLight dark:text-indigoDark hover:underline transition duration-300"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="bg-secondaryLightBg dark:bg-secondaryDarkBg flex-[55%] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-[#DCDAFA] opacity-90"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white dark:text-gray-900 py-12 px-4">
            <h3 className="text-lg md:text-2xl mb-4 text-center font-semibold">
              We're thrilled to have you with us
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Welcome to our community!
            </h1>
            <img
              src={img}
              alt="register img"
              className="max-w-full h-auto max-h-64 md:max-h-80 object-contain animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
