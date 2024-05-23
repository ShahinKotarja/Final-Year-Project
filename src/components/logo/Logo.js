import React from "react";
import styles from "./Logo.module.scss";
import { Link, useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  const handleCLickLogo = () => {
    navigate("/");
  };

  return (
    <h1 className={styles.logo} onClick={handleCLickLogo}>
      L<span className={styles.logo2}>O</span>G
      <span className={styles.logo2}>O</span>
    </h1>
  );
};

export default Logo;
