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
      <div key={idx}>
        <label
          className="text-sm mb-2 block text-lightText dark:text-darkText"
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
    <div className="flex items-center justify-center p-4 bg-lightBg dark:bg-darkBg">
      <div className="flex items-center justify-between flex-col-reverse md:flex-row border border-borderLight dark:border-borderDark rounded-lg shadow-lg w-full max-w-4xl h-full">
        <div className="p-8 flex-[40%]">
          <h2 className="mb-4 text-4xl font-bold text-lightText dark:text-darkText">
            Register!
          </h2>
          <p className="text-secondaryLightText dark:text-secondaryDarkText mb-8 text-sm">
            Complete your registration by filling out the details below.
          </p>
          <form
            className="space-y-3 max-w-sm mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            {renderRegisterForm}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="!bg-indigoLight hover:bg-indigo-800 transition-all duration-300 text-white"
            >
              Register
            </Button>
            <Button
              type="button"
              className="!bg-inherit border border-borderLight dark:border-borderDark w-full flex items-center justify-center gap-2 text-lightText dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <img src={google} alt="google icon" className="w-6 h-6" />
              Sign up with Google
            </Button>
            <p className="text-sm text-secondaryLightText dark:text-secondaryDarkText text-center">
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
        <div className="bg-secondaryLightBg dark:bg-secondaryDarkBg rounded-t-lg md:rounded-r-lg flex-[60%] h-full w-full">
          <div className="flex items-center justify-center flex-col space-y-3 pt-12 pb-8">
            <h3 className="text-base md:text-xl text-secondaryLightText dark:text-secondaryDarkText">
              We’re thrilled to have you with us.
            </h3>
            <h1 className="text-xl md:text-3xl font-bold text-indigoLight dark:text-indigoDark">
              Welcome to our community!
            </h1>
          </div>
          <img
            src={img}
            alt="login img"
            className="max-w-full p-4 my-6 h-72 md:h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
