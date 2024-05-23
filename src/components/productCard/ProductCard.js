import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsLoggedIn,
  selectHasDiabetes,
} from "../../redux/slice/authSlice"; // Update with the correct path
import styles from "./ProductCard.module.scss"; // Your SCSS module path
import { MdAddShoppingCart } from "react-icons/md";
import { Rating } from "@mui/material";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { images } from "../../constants/index";
import { addItem } from "../../redux/slice/cartSlice";

// Props are destructured directly in the function parameter area.
const ProductCard = ({
  productId,
  imageUrl,
  title,
  price,
  reviewStars,
  diabetesType1,
  diabetesType2,
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasDiabetes = useSelector(selectHasDiabetes); // This assumes you have a selector for this
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const dispatch = useDispatch();

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  }

  const handleImgError = () => {
    setImgSrc(images.img_placeholder);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    const path = isLoggedIn ? `/shop/${productId}` : "/login";
    navigate(path);
  };

  const handleAddToWishlist = (isAdded) => {
    if (isAdded) {
      toast.success(`${title} | Added to wishlist`);
    }
    setIsAddedToWishlist(!isAddedToWishlist);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
    return;
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // console.log("Image URL before dispatch:", imageUrl);

  const handleAddToCart = () => {
    if (quantity > 0) {
      const suitability = diabetesType1;
      console.log("Adding to cart", {
        productId,
        title,
        price,
        quantity,
        imageUrl,
        suitability,
      });
      dispatch(
        addItem({
          productId,
          title,
          price,
          quantity,
          imageUrl,
          suitability,
        })
      );

      toast.success(`${title} x${quantity} added to cart.`);
    }
  };

  const renderSafetyLabel = () => {
    let icon = "";
    let modal_text = "";
    let color_modal = "";
    let color_modal_txt = "";

    if (diabetesType1 === 0 || diabetesType2 === 0) {
      icon += images.alert_red;
      color_modal += "#E05757";
      color_modal_txt += "#1a1a1a";
      modal_text +=
        "This product is not suitable for individuals with diabetes.";
    } else if (diabetesType1 === 1 || diabetesType2 === 1) {
      icon += images.alert_yellow;
      color_modal += "#FFD54F";
      color_modal_txt += "#1a1a1a";
      modal_text +=
        "This product is suitable for individuals with diabetes, if consumed cautiously.";
    } else if (diabetesType1 === 2 || diabetesType2 === 2) {
      icon += images.diabetes_friendly;
      color_modal += "#2c742f";
      color_modal_txt += "white";
      modal_text += "This product is suitable for individuals with diabetes.";
    }

    return (
      <>
        <div className={`${styles.safetyLabel}`}>
          <img
            src={icon}
            alt="Safety label"
            className={`${styles.label_icon}`}
          />
        </div>
        <div
          className={`${styles.safetyModal}`}
          style={{ backgroundColor: `${color_modal}` }}
        >
          <p style={{ color: `${color_modal_txt}` }}>{modal_text}</p>
        </div>
      </>
    );
  };

  return (
    <div className={styles.card}>
      <img
        src={imgSrc}
        alt={title}
        className={styles.productImage}
        onClick={(e) => handleViewDetails(e)}
        onError={handleImgError}
      />
      <div className={styles.icons}>
        <button
          onClick={() => handleAddToWishlist(!isAddedToWishlist)}
          className={styles.wishlistIcon}
        >
          {isAddedToWishlist ? (
            <IoMdHeart size={30} color="red" />
          ) : (
            <IoMdHeartEmpty size={30} />
          )}
        </button>
        <button
          onClick={(e) => handleViewDetails(e)}
          className={styles.detailsIcon}
        >
          <FaRegEye size={30} />
        </button>
      </div>
      <h5 className={styles.title}>{truncateText(title, 30)}</h5>
      <h4 className={styles.price}>£{price.toFixed(2)}</h4>
      <div className={`${styles.cartHandler}`}>
        <div className={styles.quantityHandler}>
          <button onClick={handleDecreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncreaseQuantity}>+</button>
        </div>
        <button
          className={`${styles.addToCartButton} --d-f-c`}
          onClick={handleAddToCart}
        >
          <MdAddShoppingCart size={20} color="white" />
          Add to Cart
        </button>
      </div>

      {/* {reviewStarsComponent} */}
      <Rating name="read-only" value={4} readOnly />
      {isLoggedIn && hasDiabetes && <> {renderSafetyLabel()}</>}
    </div>
  );
};

export default ProductCard;
