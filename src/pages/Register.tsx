import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const RegisterPage = () => {
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-3 max-w-sm mx-auto">
        <Input type="email" placeholder="Email address" />
        <Input type="text" placeholder="User Name" />
        <Input type="password" placeholder="Password" />

        <Button className="w-full">Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
