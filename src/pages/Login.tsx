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
import img from "../assets/taking notes.svg";
import google from "../assets/google.png";
import { Link } from "react-router-dom";

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
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      if (status == 200) {
        toast.success("You will navigate to the home page after 2 seconds!", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });

        // * Save JWT in Local Storage
        localStorage.setItem("loggedInUser", JSON.stringify(resData));

        setTimeout(() => {
          location.replace("/");
        }, 2000);
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
  const renderLoginForm = LOGIN_FORM.map(
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
          <p className="text-red-700 text-sm font-semibold mt-1">
            {errors[name]?.message}
          </p>
        )}
      </div>
    )
  );

  return (
    <div className="flex items-center justify-center p-4 bg-lightBg dark:bg-darkBg">
      <div className="flex items-center justify-between flex-col-reverse md:flex-row border border-borderLight dark:border-borderDark rounded-lg shadow-lg w-full max-w-4xl">
        <div className="p-8 flex-[40%]">
          <h2 className="mb-4 text-4xl font-bold text-lightText dark:text-darkText">
            Login!
          </h2>
          <p className="text-secondaryLightText dark:text-secondaryDarkText mb-8 text-sm">
            Login with your data that you entered during your registration.
          </p>
          <form
            className="space-y-3 max-w-sm mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            {renderLoginForm}
            <Link
              to="/forgetPass"
              className="text-sm text-indigoLight dark:text-indigoDark hover:underline flex pt-2 justify-between pb-4 transition duration-300"
            >
              <div></div>
              Forget Password?
            </Link>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="!bg-indigoLight hover:bg-indigo-800 transition-all duration-300 text-white"
            >
              Login
            </Button>
            <Button
              type="button"
              className="!bg-inherit border border-borderLight dark:border-borderDark w-full flex items-center justify-center gap-2 text-lightText dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <img src={google} alt="google icon" className="w-6 h-6" />
              Sign in with Google
            </Button>
            <p className="text-sm text-secondaryLightText dark:text-secondaryDarkText text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigoLight dark:text-indigoDark hover:underline transition duration-300"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="bg-secondaryLightBg dark:bg-secondaryDarkBg rounded-t-lg md:rounded-r-lg flex-[60%] h-full w-full">
          <div className="flex items-center justify-center flex-col space-y-3 pt-12 pb-8">
            <h3 className="text-xl md:text-2xl text-secondaryLightText dark:text-secondaryDarkText">
              Nice to see you again.
            </h3>
            <h1 className="text-4xl md:text-5xl font-bold text-indigoLight dark:text-indigoDark">
              Welcome Back!
            </h1>
          </div>
          <img
            src={img}
            alt="login img"
            className="max-w-full p-4 h-72 md:h-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
