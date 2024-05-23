import React from "react";
import styles from "./AdShowcase.module.scss";
import { images } from "../../constants/index";
import { Link } from "react-router-dom";

const AdShowcase2 = () => {
  return (
    <div className={`${styles.ad2Container} --d-f-c`}>
      <Link to="/shop">
        <img src={images.ad4} alt="sales" />
      </Link>
    </div>
  );
};

export default AdShowcase2;
