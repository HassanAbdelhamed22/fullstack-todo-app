import { ILoginInput, IRegisterInput } from "../interfaces";

export const REGISTER_FORM: IRegisterInput[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
    label: "Enter your username",
  },
  {
    name: "email",
    placeholder: "Email Address",
    type: "email",
    label: "Enter your email address",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    label: "Enter your password",
  },
];

export const LOGIN_FORM: ILoginInput[] = [
  {
    name: "identifier",
    placeholder: "name@example.com",
    type: "email",
    label: "Enter your email address",
  },
  {
    name: "password",
    placeholder: "at least 8 characters",
    type: "password",
    label: "Enter your password",
  },
];
