import React from "react";
import styles from "./AdShowcase.module.scss";
import { images } from "../../constants/index";

const AdInfo = () => {
  const infoMap = [
    {
      icon: images.free_shipping,
      top: "Free Shipping",
      bottom: "Free shipping on all your order",
    },
    {
      icon: images.customer_support,
      top: "Customer Support 24/7",
      bottom: "Instant access to Support",
    },
    {
      icon: images.secure_payment,
      top: "100% Secure Payment",
      bottom: "We ensure your money is save",
    },
    {
      icon: images.money_back,
      top: "Money-Back Guarantee",
      bottom: "30 Days Money-Back Guarantee",
    },
  ];

  return (
    <div className={styles.infoContainer}>
      {infoMap.map((info, index) => {
        return (
          <div className={styles.info} key={index}>
            <img src={info.icon} alt={info.top} />
            <div className={styles.text}>
              <h6>{info.top}</h6>
              <p>{info.bottom}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdInfo;
