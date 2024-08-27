import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 app-navbar">
      <ul className="flex items-center justify-between">
        <li className="hover:text-[#149eca] duration-200">
          <NavLink className="px-3 py-2" to="/">
            Home
          </NavLink>
        </li>
        <li className="hover:text-[#149eca] duration-200">
          <NavLink className="px-3 py-2" to="/login">
            Login
          </NavLink>
        </li>
        <li className="hover:text-[#149eca] duration-200">
          <NavLink className="px-3 py-2" to="/register">
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
