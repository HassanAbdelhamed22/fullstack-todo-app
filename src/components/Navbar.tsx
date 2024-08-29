import toast from "react-hot-toast";
import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";
import DarkMode from "./ui/DarkMode";
import img from "../assets/sticky-notes.png";
import { useState } from "react";
import closeIcon from "../assets/close.png";

const Navbar = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    localStorage.removeItem(storageKey);
    toast.success(
      "Logout successful! You will navigate to the login page after 2 seconds!",
      {
        position: "top-center",
        duration: 2000,
      }
    );
    setTimeout(() => {
      location.replace(pathname);
    }, 2000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="max-w-lg mx-4 md:mx-auto px-5 md:px-2 py-2 rounded-full border shadow-lg my-5 border-borderLight dark:border-borderDark flex items-center justify-between">
      <NavLink className="flex items-center" to="/">
        <img src={img} alt="logo" className="w-10 h-10" />
        <span className="ml-2 text-lightText dark:text-darkText font-semibold text-lg">
          ToDoPro
        </span>
      </NavLink>
      <div className="hidden md:flex items-center space-x-3">
        {userDataString ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block text-center duration-200 font-semibold ${
                  isActive
                    ? "text-indigoLight dark:text-indigoDark"
                    : "text-lightText dark:text-darkText"
                }`
              }
            >
              Profile
            </NavLink>
            <Button
              className="cursor-pointer text-sm bg-indigoLight"
              onClick={onLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `block text-center duration-200 font-semibold ${
                  isActive
                    ? "text-indigoLight dark:text-indigoDark"
                    : "text-lightText dark:text-darkText"
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `block text-center duration-200 font-semibold ${
                  isActive
                    ? "text-indigoLight dark:text-indigoDark"
                    : "text-lightText dark:text-darkText"
                }`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <DarkMode />
        <button
          className="block md:hidden px-3 py-2 border rounded text-indigoLight border-indigo-600 hover:text-indigoDark hover:border-indigo-400 transition duration-300"
          onClick={toggleMenu}
        >
          <svg className="fill-current h-5 w-5" viewBox="0 0 20 20">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[rgba(250,250,250,0.71)] dark:bg-[rgba(40,40,48,0.8)] z-10">
          <div className="flex flex-col items-center justify-center p-4 space-y-4 w-[85%] ml-auto mr-auto mt-[2rem] rounded-2xl py-4 px-8 dark:bg-darkBg backdrop:blur-md bg-white animate-customScale">
            <button
              className="self-end transition duration-300 hover:rotate-180"
              onClick={toggleMenu}
              aria-label="Close mobile menu"
            >
              <img
                src={closeIcon}
                className="block w-6 h-6"
                aria-hidden="true"
              />
            </button>
            <ul className="flex flex-col items-center py-4 space-y-4">
              {userDataString ? (
                <>
                  <li className="py-2 w-full">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block text-center duration-200 font-semibold ${
                          isActive
                            ? "text-indigoLight dark:text-indigoDark"
                            : "text-lightText dark:text-darkText"
                        }`
                      }
                      onClick={toggleMenu}
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li className="py-2 w-full">
                    <Button
                      className="cursor-pointer text-sm"
                      onClick={() => {
                        onLogout();
                        toggleMenu();
                      }}
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li className="py-2 w-full">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `block text-center duration-200 font-semibold ${
                          isActive
                            ? "text-indigoLight dark:text-indigoDark"
                            : "text-lightText dark:text-darkText"
                        }`
                      }
                      onClick={toggleMenu}
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className="py-2 w-full">
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `block text-center duration-200 font-semibold ${
                          isActive
                            ? "text-indigoLight dark:text-indigoDark"
                            : "text-lightText dark:text-darkText"
                        }`
                      }
                      onClick={toggleMenu}
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
