import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";
import { GrHomeRounded } from "react-icons/gr";
import { MdArrowForwardIos } from "react-icons/md";

const Breadcrumb = ({ items }) => {
  return (
    <div className={`${styles.breadcrumbContainer}`}>
      <Link to="/" className={styles.breadcrumbHome}>
        <GrHomeRounded />
      </Link>
      <MdArrowForwardIos size={15} color="#999999" />
      {items.map((item, index) => (
        <span key={index} className={styles.breadcrumbItem}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? `${styles.activeBreadcrumbLink}`
                : `${styles.breadcrumbLink}`
            }
          >
            {item.label}
          </NavLink>
          {index < items.length - 1 && (
            <MdArrowForwardIos
              size={15}
              color="#999999"
              style={{ marginLeft: "10px" }}
            />
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
