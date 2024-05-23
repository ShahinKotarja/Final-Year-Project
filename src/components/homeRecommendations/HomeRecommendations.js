import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./HomeRecommendations.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { images } from "../../constants/index";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
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

const HomeRecommendations = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const [sliderSettings, setSliderSettings] = useState({
    className: "center",
    centerMode: true,
    dots: true,
    infinite: true,
    centerPadding: "10px",
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 300,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 410,
        settings: {
          dots: false,
        },
      },
    ],
  });

  const updateSliderSettings = () => {
    const width = window.innerWidth;
    let slidesToShow = 7;

    if (width < 2445) slidesToShow = 6.5;
    if (width < 2266) slidesToShow = 6;
    if (width < 2095) slidesToShow = 5.5;
    if (width < 1930) slidesToShow = 5;
    if (width < 1755) slidesToShow = 4.5;
    if (width < 1570) slidesToShow = 4;
    if (width < 1395) slidesToShow = 3.5;
    if (width < 1220) slidesToShow = 3;
    if (width < 1050) slidesToShow = 2.5;
    if (width < 777) slidesToShow = 2;
    if (width < 630) slidesToShow = 1.5;
    if (width < 480) slidesToShow = 1;

    setSliderSettings((prevSettings) => ({
      ...prevSettings,
      slidesToShow: slidesToShow,
    }));
  };

  useEffect(() => {
    window.addEventListener("resize", updateSliderSettings);
    updateSliderSettings(); // Initial call to set based on current size

    return () => {
      window.removeEventListener("resize", updateSliderSettings);
    };
  }, []);

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
    const shuffledProducts = shuffleArray(products);
    return shuffledProducts.slice(0, 9);
  }, [products]);

  const handleProductClick = (e) => {
    e.preventDefault();
    //const path = isLoggedIn ? `/shop/${category.name.toLowerCase()}` : '/login';
    const path = isLoggedIn ? `/shop` : "/login";
    navigate(path);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllProducts());
    }
  }, [status, dispatch]);

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div className={styles.slider_arrow_front} onClick={onClick}>
        <MdOutlineArrowForwardIos color="white" size={20} />
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={`${styles.slider_arrow_back} `} onClick={onClick}>
        <MdOutlineArrowBackIos color="white" size={20} />
      </div>
    );
  }

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.contentContainer}`}>
        <div className={styles.titleSection}>
          <ShowOnLogin>
            <h3>Just For You</h3>
          </ShowOnLogin>
          <ShowOnLogout>
            <h3>New Products</h3>
          </ShowOnLogout>

          <Link
            to="/shop"
            className={`--d-f-c`}
            onClick={(e) => handleProductClick(e)}
          >
            View All <IoIosArrowForward size={20} color="#00B207" />
          </Link>
        </div>
        <ShowOnLogout>
          <div className={`${styles.productsContainer}`}>
            {status === "loading" ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <div
                  className={`slider-container ${styles.slider_container_local}`}
                >
                  <Slider key={randomProducts.length} {...sliderSettings}>
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
                  </Slider>
                </div>
              </>
            )}
          </div>
        </ShowOnLogout>
        <ShowOnLogin>
          <MLhomeRecommendations />
        </ShowOnLogin>
      </div>
    </div>
  );
};

export default HomeRecommendations;
