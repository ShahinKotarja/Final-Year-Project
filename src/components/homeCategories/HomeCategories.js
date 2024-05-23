import React from "react";
import styles from "./HomeCategories.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { images } from "../../constants/index";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

const HomeCategories = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const popularCategories = [
    { name: "Vegetables", img: images.carrot },
    { name: "Organic", img: images.honey },
    { name: "Snacks", img: images.chips },
    { name: "Meat", img: images.meat },
    { name: "Fish", img: images.fish },
    { name: "Bakery", img: images.croissant },
    { name: "Dairy", img: images.cheese },
  ];

  const handleCategoryClick = (e) => {
    e.preventDefault();
    //const path = isLoggedIn ? `/shop/${category.name.toLowerCase()}` : '/login';
    const path = isLoggedIn ? `/shop` : "/login";
    navigate(path);
  };

  return (
    <div className={`${styles.container}`}>
      <div className={styles.titleSection}>
        <h3>Popular Categories</h3>
        <Link
          to="/shop"
          className={`--d-f-c`}
          onClick={(e) => handleCategoryClick(e)}
        >
          View All <IoIosArrowForward size={20} color="#00B207" />
        </Link>
      </div>

      <div className={styles.categoriesContainer}>
        {popularCategories.map((category, index) => (
          <React.Fragment key={index}>
            <div className={styles.categoryContainer}>
              <Link
                to="/shop"
                className={styles.category}
                onClick={(e) => handleCategoryClick(e)}
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className={styles.categoryImage}
                />
                <span className={styles.categoryName}>{category.name}</span>
              </Link>
            </div>
            {index < popularCategories.length - 1 && (
              <div className={styles.divider}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
