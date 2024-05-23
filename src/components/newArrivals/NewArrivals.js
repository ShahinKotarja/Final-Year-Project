import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { images } from "../../constants/index";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import { selectSafeMode } from "../../redux/slice/safeModeSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import { ProductCard, MLhomeRecommendations } from "../index";
import {
  fetchAllProducts,
  selectAllProducts,
  selectProductsStatus,
} from "../../redux/slice/productsSlice";
import { Spinner } from "theme-ui";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./NewArrivals.module.scss";

const NewArrivals = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const safeModeEnabled = useSelector(selectSafeMode);

  function shuffleArray(array) {
    if (!Array.isArray(array)) return []; // Ensures only arrays are processed
    let newArray = [...array]; // Create a shallow copy of the array to avoid mutating the original array
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  }

  const randomProducts = useMemo(() => {
    if (!products || !products.length) return []; // Ensures products is not undefined or empty
    let filteredProducts = products;

    // Apply diabetes-friendly filter when safe mode is enabled and user has diabetes
    if (safeModeEnabled) {
      filteredProducts = filteredProducts.filter(
        (product) => product.suitableFor?.diabetes?.general > 0
      );
    }

    const shuffledProducts = shuffleArray(filteredProducts);
    return shuffledProducts.slice(0, 10); // You can adjust the number as necessary
  }, [products, safeModeEnabled]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllProducts());
    }
  }, [status, dispatch]);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.contentContainer}`}>
        <div className={styles.titleSection}>
          <h3>New Products</h3>

          <Link to="/fast-shopping" className={`--d-f-c`}>
            Try Fast Shopping <IoIosArrowForward size={20} color="#00B207" />
          </Link>
        </div>

        <div className={`${styles.productsContainer}`}>
          {status === "loading" ? (
            <>
              <Spinner />
            </>
          ) : (
            <>
              {randomProducts.map((item) => {
                return (
                  <ProductCard
                    key={item.id}
                    productId={item.id}
                    imageUrl={item.images}
                    title={item.productName}
                    price={item.priceGbp}
                    reviewStars={item.reviewStars || 0}
                    diabetesType1={item.suitableFor?.diabetes?.type1 ?? 0}
                    diabetesType2={item.suitableFor?.diabetes?.type2 ?? 0}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
