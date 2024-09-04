import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { UPDATE_FORM } from "../data";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import axiosInstance from "../config/axios.config";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateSchema } from "../validation";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { isLightMode, storageKey, userData } from "../utils/Helper";
import profileImg from "../assets/user.png";
import ChangePassword from "./ChangePassword";

interface IFormInput {
  username: string;
  email: string;
}

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(userData.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(updateSchema),
    defaultValues: {
      username: userData.user.username,
      email: userData.user.email,
    },
  });

  // * Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.put(`/users/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (response.status === 200) {
        const updatedUser = response.data;

        // Update the local state
        setUser(updatedUser);

        // Update localStorage
        const updatedUserData = {
          ...userData,
          user: updatedUser,
        };
        localStorage.setItem(storageKey, JSON.stringify(updatedUserData));

        toast.success("Your data is updated successfully", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: isLightMode() ? "white" : "black",
            color: isLightMode() ? "black" : "white",
            width: "fit-content",
          },
        });
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

  // * Renders
  const renderRegisterForm = UPDATE_FORM.map(({ name, type, label }, idx) => (
    <div key={idx} className="mb-4">
      <label
        className="text-sm font-medium mb-2 block text-lightText dark:text-darkText"
        htmlFor={name}
      >
        {label}
      </label>
      <Input id={name} type={type} {...register(name)} />
      {errors[name] && (
        <p className="text-red-700 dark:text-red-500 text-sm font-semibold mt-1">
          {errors[name]?.message}
        </p>
      )}
    </div>
  ));

  return (
    <div className="flex items-center justify-center p-4 bg-lightBg dark:bg-darkBg min-h-screen">
      <div className="border border-borderLight dark:border-borderDark rounded-lg shadow-lg w-full max-w-2xl mx-auto my-8 p-8">
        <h1 className="text-2xl font-bold mb-6 text-lightText dark:text-darkText">
          Profile Settings
        </h1>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-borderLight dark:border-borderDark">
          <img
            src={profileImg}
            alt="profileImage"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-semibold text-lightText dark:text-darkText">
              Welcome back,
            </p>
            <p className="text-xl font-bold text-indigoLight dark:text-indigoDark">
              {user.username}
            </p>
          </div>
        </div>

        <div className="mb-8 pb-6 border-b border-borderLight dark:border-borderDark">
          <h2 className="text-xl font-semibold mb-4 text-lightText dark:text-darkText">
            Update Profile
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {renderRegisterForm}
            <div className="md:col-span-2">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="!bg-indigoLight hover:bg-indigo-800 transition-all duration-300 text-white"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-lightText dark:text-darkText">
            Change Password
          </h2>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default Profile;
