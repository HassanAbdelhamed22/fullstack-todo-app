import { ILoginInput, IRegisterInput } from "../interfaces";

export const REGISTER_FORM: IRegisterInput[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
  },
  {
    name: "email",
    placeholder: "Email Address",
    type: "email",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
  },
];

export const LOGIN_FORM: ILoginInput[] = [
  {
    name: "identifier",
    placeholder: "Email Address",
    type: "email",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
  },
];
