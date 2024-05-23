import React from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

const Navbar3 = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleShopClick = (e) => {
    e.preventDefault();
    const path = isLoggedIn ? `/shop` : "/login";
    navigate(path);
  };

  const handleFastShopClick = (e) => {
    e.preventDefault();
    const path = isLoggedIn ? `/fast-shopping` : "/login";
    navigate(path);
  };

  return (
    <div className={`w-100 ${styles.nav3_container}`}>
      <ul className={`d-flex justify-content-center align-items-center`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.activeNav3Link}` : `${styles.notActiveLink}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? `${styles.activeNav3Link}` : `${styles.notActiveLink}`
            }
            onClick={(e) => handleShopClick(e)}
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/fast-shopping"
            className={({ isActive }) =>
              isActive ? `${styles.activeNav3Link}` : `${styles.notActiveLink}`
            }
            onClick={(e) => handleFastShopClick(e)}
          >
            Fast Shopping
          </NavLink>
        </li>
        <li>
          <Link className={`${styles.notActiveLink}`}>Offers</Link>
        </li>
        <li>
          <Link className={`${styles.notActiveLink}`}>Recipes</Link>
        </li>
        <li>
          <Link className={`${styles.notActiveLink}`}>Delivery</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar3;
