import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink className="px-3 py-2" to="/">
            Home
          </NavLink>
        </li>
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink className="px-3 py-2" to="/login">
            Login
          </NavLink>
        </li>
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink className="px-3 py-2" to="/register">
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
