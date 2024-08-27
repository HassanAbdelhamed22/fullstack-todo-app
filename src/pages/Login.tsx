import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const LoginPage = () => {
  const location = useLocation();
  console.log(location);

  return (
    <div>
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-3 max-w-sm mx-auto">
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />

        <Button className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
