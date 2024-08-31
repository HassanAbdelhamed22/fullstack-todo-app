export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
  label: string;
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  label: string;
}

export interface IErrorResponse {
  error: {
    details?: {
      errors: { message: string };
    }[];
    message?: string;
  };
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
}

export interface ITodoEditInput {
  title: string;
  description?: string;
}
