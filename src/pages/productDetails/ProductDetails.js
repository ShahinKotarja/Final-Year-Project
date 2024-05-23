import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import styles from "./ProductDetails.module.scss";
import { Breadcrumb, DetailsRecommendations } from "../../components/index";
import { Rating } from "@mui/material";
import { LuDot } from "react-icons/lu";
import { images, reviews } from "../../constants/index";
import { MdAddShoppingCart } from "react-icons/md";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import toast from "react-hot-toast";
import { addItem } from "../../redux/slice/cartSlice";
import { useSelector, useDispatch } from "react-redux";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const menuList = ["Details", "Nutrition", "Reviews"];
  const [menuActive, setMenuActive] = useState("Details");
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  const renderLabels = () => {
    let diabetesLabel = "";
    let veganLabel = "";
    if (product.suitableFor.diabetes.type1 !== 0) {
      diabetesLabel = (
        <img src={images.diabetes_friendly} alt="diabetes friendly" />
      );
    }

    if (product.suitableFor.vegan !== 0) {
      veganLabel = <img src={images.vegan} alt="vegan friendly" />;
    }

    if (
      product.suitableFor.vegan === 0 &&
      product.suitableFor.vegetarian !== 0
    ) {
      veganLabel = <img src={images.vegetarian} alt="vegetarian friendly" />;
    }

    return (
      <>
        {diabetesLabel}
        {veganLabel}
      </>
    );
  };

  const renderWarning = () => {
    let warning = "";
    let iconWarning = "";
    if (product.suitableFor.diabetes.type1 === 0) {
      warning = (
        <p style={{ color: "#E05757" }}>
          This product is not suitable for individuals with diabetes.
        </p>
      );
      iconWarning = <img src={images.alert_red} alt="warning" />;
    }
    if (product.suitableFor.diabetes.type1 === 1) {
      warning = (
        <p style={{ color: "#FFD54F" }}>
          This product is suitable for individuals with diabetes, if consumed
          cautiously.
        </p>
      );
      iconWarning = <img src={images.alert_yellow} alt="warning" />;
    }
    if (product.suitableFor.diabetes.type1 === 2) {
      warning = (
        <p style={{ color: "#2c742f" }}>
          This product is suitable for individuals with diabetes.
        </p>
      );
      iconWarning = <img src={images.check} alt="warning" />;
    }

    return (
      <>
        {iconWarning}
        {warning}
      </>
    );
  };

  const renderDescription = () => {
    return (
      <div className={`${styles.description} `}>
        <h5>
          {product.description} Discover the exceptional quality and innovative
          features of our product, meticulously crafted to offer superior
          performance and reliability.
        </h5>
        <p>
          Indulge in the richness of our product, meticulously sourced and
          processed to ensure you receive nothing but the finest quality.
          Perfect for those who appreciate the finer details and a touch of
          luxury in their daily lives.
        </p>
        <p>
          Experience the true essence of nature with our product, crafted using
          sustainable methods that respect the environment and deliver a purity
          that can be tasted in every bite. Ideal for the eco-conscious consumer
          looking for ethically produced goods without compromising on quality.
        </p>
        <p>Pack size: {product.packSize_g}g</p>
        <p>Serving size: {product.servingSize_g}g</p>
        <h6>Ingredients:</h6>
        <p>{product.ingredients}</p>
        <h6>Using Product Information</h6>
        <p>
          While every care has been taken to ensure product information is
          correct, food products are constantly being reformulated, so
          ingredients, nutrition content, dietary and allergens may change. You
          should always read the product label and not rely solely on the
          information provided on the website.
        </p>
        <p>
          If you have any queries, or you'd like advice on any Tesco brand
          products, please contact Tesco Customer Services, or the product
          manufacturer if not a Tesco brand product.
        </p>
        <p>
          Although product information is regularly updated, Tesco is unable to
          accept liability for any incorrect information. This does not affect
          your statutory rights.
        </p>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className={`${styles.reviews} `}>
        <h2>10 Reviews</h2>
        <div className={`${styles.average} `}>
          <p>Average Rating</p>
          <Rating
            name="half-rating-read"
            defaultValue={4}
            precision={0.5}
            readOnly
          />
          <p>4.1 stars</p>
        </div>
        <h5>Help other customers like you</h5>
        <p>
          Reviews are submitted by our customers directly through our website.
          We also share reviews from other retailers' websites to help you make
          an informed decision.
        </p>
        <button className={`btn-1`}>Write a Review</button>
        <br />
        {reviews.map((rev, i) => {
          return (
            <div key={i} className={`${styles.review} `}>
              <h5>{rev.title}</h5>
              <div className={`${styles.stars} `}>
                <Rating
                  name="half-rating-read"
                  defaultValue={rev.rate}
                  precision={0.5}
                  readOnly
                />
                <p>{rev.rate} stars</p>
              </div>
              <h6>
                A Custemer <span>{rev.date}</span>
              </h6>
              <p>{rev.review}</p>
              <a>Report</a>
            </div>
          );
        })}
      </div>
    );
  };

  const perServing = (value) => (value / 100) * product.servingSize_g;

  const renderNutritionalInfo = () => {
    return (
      <div className={styles.nutrition_table_container}>
        <table>
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Per 100g</th>
              <th>Per Serving ({product.servingSize_g}g)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(product.nutritionalInformation).map(
              ([key, value]) => (
                <tr key={key}>
                  <td>{key.replace(/_/g, " ")}</td>
                  <td>
                    {value}{" "}
                    {key === "Energy_kJ" || key === "Energy_kcal"
                      ? key === "Energy_kJ"
                        ? "kJ"
                        : "kcal"
                      : "g"}
                  </td>
                  <td>
                    {perServing(value).toFixed(1)}{" "}
                    {key === "Energy_kJ" || key === "Energy_kcal"
                      ? key === "Energy_kJ"
                        ? "kJ"
                        : "kcal"
                      : "g"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
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

  const handleAddToWishlist = (isAdded) => {
    if (isAdded) {
      toast.success(`${product.productName} | Added to wishlist`);
    }
    setIsAddedToWishlist(!isAddedToWishlist);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addItem({
          productId: id,
          title: product.productName, // use title instead of name
          price: product.priceGbp,
          quantity,
          imageUrl: product.images, // make sure imageUrl is correctly assigned
          suitability: product.suitableFor.diabetes.type1, // ensure this matches the expected structure
        })
      );
      toast.success(`${product.productName} x${quantity} added to cart.`);
    }
  };

  return (
    <section className={`${styles.productDetailsContainer} --d-f-c`}>
      <Breadcrumb
        items={
          product
            ? [
                { label: "Shop", path: "/shop" },
                { label: `${product.productName}`, path: `/shop/${id}` },
              ]
            : [{ label: "Shop", path: "/shop" }]
        }
      />
      {product ? (
        <div className={`${styles.contentContainer} --d-f-c`}>
          <div className={`${styles.topDetails} `}>
            <div className={`${styles.productImage}`}>
              {/* image here */}
              <img src={product.images} alt={product.productName} />
            </div>

            <div className={`${styles.productHeader}`}>
              {/* product header here here */}
              <h3>{product.productName}</h3>
              <div className={`${styles.reviewsRow}`}>
                {/* reviews here */}
                <Rating
                  name="half-rating-read"
                  defaultValue={4}
                  precision={0.5}
                  readOnly
                />
                <p className={`${styles.reviewsNumber}`}>10 Reviews</p>
                <LuDot size={25} color="#B3B3B3" />
                <p className={`${styles.reviewsLink}`}>Write a Review</p>
              </div>
              <h2 className={`${styles.price}`}>
                £{product.priceGbp.toFixed(2)}
              </h2>
              <p>Brand: {product.brand}</p>
              <div className={`${styles.labelsRow}`}>{renderLabels()}</div>
              <div className={`${styles.warningRow}`}>{renderWarning()}</div>
              <h6 className={`${styles.standardText}`}>
                Discover the exceptional quality and innovative features of our
                product, meticulously crafted to offer superior performance and
                reliability.
              </h6>
              <div className={`${styles.interactionRow}`}>
                <div className={styles.quantityHandler}>
                  <button onClick={handleDecreaseQuantity}>-</button>
                  <span>{quantity}</span>
                  <button onClick={handleIncreaseQuantity}>+</button>
                </div>
                <button className={styles.cartButton} onClick={handleAddToCart}>
                  Add to Cart <MdAddShoppingCart size={20} color="white" />
                </button>
                <button
                  className={`${styles.wishlist} --d-f-c`}
                  onClick={() => handleAddToWishlist(!isAddedToWishlist)}
                >
                  {isAddedToWishlist ? (
                    <IoMdHeart size={27} color="red" />
                  ) : (
                    <IoMdHeartEmpty size={27} color="#00b207" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className={`${styles.detailsMenu} --d-f-c`}>
            {menuList.map((item, i) => {
              return (
                <div key={i} className={`${styles.menuItem}`}>
                  <h4
                    style={{ color: item === menuActive && "black" }}
                    onClick={() => setMenuActive(item)}
                  >
                    {item}
                  </h4>
                  <div
                    className={
                      item === menuActive
                        ? styles.menuActive
                        : styles.menuNotActive
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className={`${styles.bottomDetails}`}>
            {menuActive === "Details" && renderDescription()}
            {menuActive === "Nutrition" && renderNutritionalInfo()}
            {menuActive === "Reviews" && renderReviews()}
          </div>
          <DetailsRecommendations />
        </div>
      ) : (
        <p>Loading</p>
      )}
    </section>
  );
};

export default ProductDetails;
