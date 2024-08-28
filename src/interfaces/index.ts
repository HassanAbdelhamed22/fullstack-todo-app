export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
}

export interface IErrorResponse {
  error: {
    details?: {
      errors: { message: string };
    }[];
    message?: string;
  };
}
