import React from "react";
import styles from "./Header.module.scss";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuUser2 } from "react-icons/lu";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";

const Navbar1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("You signed out");
    navigate("/");
  };

  return (
    <div className={`w-100 ${styles.nav1_container}`}>
      <a
        className={`dark-gray d-flex justify-content-center align-items-center`}
      >
        <IoLocationOutline color="#666666" size={18} />
        Locations
      </a>

      <ul
        className={`d-flex align-items-center justify-content-center ${styles.list_container}`}
      >
        <li
          className={`d-flex justify-content-center align-items-center dark-gray`}
        >
          Eng <IoMdArrowDropdown />
        </li>
        <ShowOnLogout>
          <li className={`dark-gray`}>|</li>

          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `${styles.activeNavLink} dark-gray` : "dark-gray"
              }
            >
              Sign in/Sign up
            </NavLink>
          </li>
        </ShowOnLogout>
        <ShowOnLogin>
          <li className={`dark-gray`}>|</li>

          <li>
            <Link className={`dark-gray`}>My account</Link>
          </li>
          <li className={`dark-gray`}>|</li>
          <li>
            <Link className={`dark-gray`}>My orders</Link>
          </li>
          <li className={`dark-gray`}>|</li>
          <li>
            <Link className={`dark-gray`} onClick={handleLogout}>
              Log out
            </Link>
          </li>
        </ShowOnLogin>
      </ul>
    </div>
  );
};

export default Navbar1;

{
  /* <ul className={`d-flex ${styles.nav1_list}`}>
        <li>
          <Link to="/login">Sign in</Link>
        </li>
        <li>
          <IoLocationOutline color="white" size={20} />
          <a>Store locator</a>
        </li>
        <li>
          <a>Contact us</a>
        </li>
        <li>
          <a>Help</a>
        </li>
        <li>
          <LuUser2 color="white" size={20} />
          <a>My account</a>
        </li>
      </ul> */
}
