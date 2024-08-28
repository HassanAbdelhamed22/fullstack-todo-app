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
