import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required!")
      .min(5, "Username must be at least 5 characters long"),
    email: yup
      .string()
      .required("Email is required!")
      .matches(
        /^[^@ ]+@[^@ ]+\.[^@ ]{2,}$/,
        "Please enter a valid email address"
      ),
    password: yup
      .string()
      .required("Password is required!")
      .min(8, "Password must be at least 8 characters long")
      .test("hasNumber", "Password must contain at least one number", (value) =>
        /\d/.test(value || "")
      )
      .test(
        "hasUpperCase",
        "Password must contain at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      ),
  })
  .required();

export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("Email is required!")
      .matches(
        /^[^@ ]+@[^@ ]+\.[^@ ]{2,}$/,
        "Please enter a valid email address"
      ),
    password: yup
      .string()
      .required("Password is required!")
      .min(8, "Password must be at least 8 characters long")
      .test("hasNumber", "Password must contain at least one number", (value) =>
        /\d/.test(value || "")
      )
      .test(
        "hasUpperCase",
        "Password must contain at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      ),
  })
  .required();

export const todoSchema = yup
  .object({
    title: yup
      .string()
      .required("Title is required!")
      .min(10, "Title must be at least 10 characters long")
      .max(50, "Title must be at most 50 characters long"),
  })
  .required();

export const updateSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required!")
      .min(5, "Username must be at least 5 characters long"),
    email: yup
      .string()
      .required("Email is required!")
      .matches(
        /^[^@ ]+@[^@ ]+\.[^@ ]{2,}$/,
        "Please enter a valid email address"
      ),
  })
  .required();

export const passwordSchema = yup
  .object({
    currentPassword: yup
      .string()
      .required("Current password is required!")
      .min(8, "Password must be at least 8 characters long")
      .test("hasNumber", "Password must contain at least one number", (value) =>
        /\d/.test(value || "")
      )
      .test(
        "hasUpperCase",
        "Password must contain at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      ),
    password: yup
      .string()
      .required("New password is required!")
      .min(8, "Password must be at least 8 characters long")
      .test("hasNumber", "Password must contain at least one number", (value) =>
        /\d/.test(value || "")
      )
      .test(
        "hasUpperCase",
        "Password must contain at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      ),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required!"),
  })
  .required();
