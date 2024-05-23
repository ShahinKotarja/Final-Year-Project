import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSafeMode } from "../../redux/slice/safeModeSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./HomeRecommendations.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { images } from "../../constants/index";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import { ProductCard } from "../index";
import {
  fetchRecommendedProducts,
  selectRecommendedProducts,
} from "../../redux/slice/productsSlice";
import { Spinner } from "theme-ui";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";

const MLhomeRecommendations = () => {
  const safeModeEnabled = useSelector(selectSafeMode);
  const dispatch = useDispatch();
  const recommendedProducts = useSelector(selectRecommendedProducts);
  const [recommendations, setRecommendations] = useState(
    safeModeEnabled
      ? [2, 37, 25, 17, 58, 28, 21, 20, 60]
      : [2, 31, 37, 101, 25, 17, 36, 68, 58]
  );
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      const diabetesFriendly = safeModeEnabled ? "true" : "false";
      const timestamp = new Date().getTime(); // Generate a unique timestamp
      const url = `http://127.0.0.1:5000/recommendations?user_id=1&num_recommendations=9&diabetes_friendly=${diabetesFriendly}&_ts=${timestamp}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setRecommendations(
          safeModeEnabled
            ? [2, 37, 25, 17, 58, 28, 21, 20, 60]
            : [2, 31, 37, 101, 25, 17, 36, 68, 58]
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [safeModeEnabled]);

  useEffect(() => {
    if (recommendations.length > 0) {
      dispatch(fetchRecommendedProducts(recommendations));
    } else {
      console.log("Received an empty array of recommended product IDs");
    }
  }, [recommendations, dispatch]);

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
    <div className={`${styles.productsContainer}`}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={`slider-container ${styles.slider_container_local}`}>
          <Slider key={recommendations.length} {...sliderSettings}>
            {recommendedProducts.map((item) => {
              return (
                <ProductCard
                  key={item.productID}
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
      )}
    </div>
  );
};

export default MLhomeRecommendations;

// <ul>
//         {recommendedProducts.map((product) => (
//           <div key={product.id}>
//             <h3>{product.productID}</h3>
//             {/* More product details */}
//           </div>
//         ))}
//       </ul>
