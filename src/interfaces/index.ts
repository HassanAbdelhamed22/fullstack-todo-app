export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
  label: string;
}

export interface IUpdateInput {
  name: "email" | "username";
  type: string;
  label: string;
}

export interface IChangePassword {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
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
  completed: boolean;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface ITodoEditInput {
  title: string;
  description?: string;
}
