import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdShowcase.module.scss";
import { images } from "../../constants/index";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

const slideImages = [
  {
    url: images.ad1,
  },
  {
    url: images.ad2,
  },
  {
    url: images.ad3,
  },
];

const AdShowcase = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/shop");
  };

  const handleShopClick = (e) => {
    e.preventDefault();
    const path = isLoggedIn ? `/shop` : "/login";
    navigate(path);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide) => (currentSlide + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide) =>
      currentSlide === 0 ? slideImages.length - 1 : currentSlide - 1
    );
  };

  useEffect(() => {
    slideInterval.current = setInterval(nextSlide, 5000);

    return () => clearInterval(slideInterval.current);
  }, []);

  return (
    <>
      <div className={styles.adContainer}>
        <Link
          to="/shop"
          className={styles.largeAd}
          onClick={(e) => handleShopClick(e)}
        >
          <img src={images.ad1} alt="Ad 1" />
        </Link>
        <Link
          to="/shop"
          className={styles.upperSmallAd}
          onClick={(e) => handleShopClick(e)}
        >
          <img src={images.ad2} alt="Ad 2" />
        </Link>
        <Link
          to="/shop"
          className={styles.lowerSmallAd}
          onClick={(e) => handleShopClick(e)}
        >
          <img src={images.ad3} alt="Ad 3" />
        </Link>
      </div>

      <div className={styles.adContainerMobile}>
        <button onClick={prevSlide} className={styles.slideButton}>
          <IoIosArrowBack />
        </button>

        <img
          src={slideImages[currentSlide].url}
          alt={`Slide ${currentSlide + 1}`}
          className={styles.slide}
          onClick={(e) => handleShopClick(e)}
        />

        <button onClick={nextSlide} className={styles.slideButton}>
          <IoIosArrowForward />
        </button>
      </div>
    </>
  );
};

export default AdShowcase;
