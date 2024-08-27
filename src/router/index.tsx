import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "../pages/Layout";
import ErrorHandler from "../components/errors/ErrorHandler";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import PageNotFound from "../pages/PageNotFound";

const isLoggedIn = false;
const userData = isLoggedIn ? { email: "email@gmail.com" } : null;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root Layout */}
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        <Route
          index
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn}
              redirectPath="/login"
              data={userData}
            >
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute
              isAllowed={!isLoggedIn}
              redirectPath="/"
              data={userData}
            >
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute
              isAllowed={!isLoggedIn}
              redirectPath="/"
              data={userData}
            >
              <RegisterPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Page Not Found */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default router;
