import React from "react";
import Navbar1 from "./Navbar1";
import Navbar2 from "./Navbar2";
import Navbar3 from "./Navbar3";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <>
      <div className={`w-100 ${styles.header_container}`}>
        <Navbar1 />
        <Navbar2 />
        <Navbar3 />
      </div>
    </>
  );
};

export default Header;
