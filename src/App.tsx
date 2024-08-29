import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="bg-lightBg dark:bg-darkBg">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
