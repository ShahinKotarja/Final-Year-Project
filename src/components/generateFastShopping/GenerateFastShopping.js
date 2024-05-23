import React, { useState, useEffect } from "react";
import styles from "./GenerateFastShopping.module.scss";
import { Card } from "../index";
import { images } from "../../constants/index";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Label, Spinner } from "theme-ui";
import {
  fetchRecommendedProducts,
  selectRecommendedProducts,
} from "../../redux/slice/productsSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { addItem } from "../../redux/slice/cartSlice";

const GenerateFastShopping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState(8);
  const [showDiabetesFriendly, setShowDiabetesFriendly] = useState(true);
  const hasDiabetes = useSelector((state) => state.auth.hasDiabetes);
  // const [recommendations, setRecommendations] = useState([]);
  const recommendedProducts = useSelector(selectRecommendedProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemQuantities, setItemQuantities] = useState({});
  const [errorImage, setErrorImage] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [listName, setListName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const userId = useSelector((state) => state.auth.userID);

  useEffect(() => {
    setVisibleProducts(recommendedProducts);
  }, [recommendedProducts]);

  const handleDiabetesFriendlyChange = (e) => {
    setShowDiabetesFriendly(e.target.checked);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const diabetesFriendly =
        hasDiabetes && showDiabetesFriendly ? "true" : "false";
      const response = await fetch(
        `http://127.0.0.1:5000/recommendations?user_id=1&num_recommendations=${itemCount}&diabetes_friendly=${diabetesFriendly}`
      );
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const productIds = await response.json();
      dispatch(fetchRecommendedProducts(productIds));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recommendedProducts.length > 0) {
      const initialQuantities = recommendedProducts.reduce((acc, product) => {
        acc[product.id] = 1; // Initialize each product quantity as 1
        return acc;
      }, {});
      setItemQuantities(initialQuantities);
    }
  }, [recommendedProducts]);

  const handleIncrement = (productId) => {
    setItemQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const handleDecrement = (productId) => {
    if (itemQuantities[productId] > 1) {
      setItemQuantities((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
    } else {
      setItemQuantities((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      setVisibleProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
    }
  };

  const handleRemoveItem = (productId) => {
    setItemQuantities((prev) => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
    setVisibleProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const handleImgError = () => {
    setErrorImage(images.img_placeholder);
  };

  const getTotalQuantity = () => {
    return Object.values(itemQuantities).reduce((total, qty) => total + qty, 0);
  };

  const getTotalPrice = () => {
    return visibleProducts
      .reduce((total, product) => {
        const quantity = itemQuantities[product.id] || 0;
        return total + product.priceGbp * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleShowSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleListNameChange = (event) => {
    setListName(event.target.value);
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      alert("Please enter a name for the list.");
      return;
    }
    // Get the user ID from Redux
    if (!userId) {
      alert("You need to be logged in to save a list.");
      return;
    }

    const newList = {
      name: listName,
      products: visibleProducts.map((product) => ({
        productId: product.id,
        quantity: itemQuantities[product.id],
        name: product.productName,
        price: product.priceGbp,
        image: product.images,
        suitability: product.suitableFor?.diabetes?.general,
      })),
      totalItems: getTotalQuantity(),
      totalPrice: getTotalPrice(),
      created: new Date(),
    };

    try {
      const listRef = doc(collection(db, "users", userId, "shoppingLists"));
      await setDoc(listRef, newList); // Creates a new document for this shopping list under the user
      console.log("List saved with ID: ", listRef.id);
      toast.success(`Shopping list saved successfully!`);
      setShowSaveModal(false); // Assuming you have a modal for naming the list
      setListName("");
    } catch (error) {
      console.error("Error saving shopping list: ", error);
      alert("Failed to save the shopping list.");
    }
  };

  const handleAddToCartAndNavigate = () => {
    visibleProducts.forEach((product) => {
      const quantity = itemQuantities[product.id];
      if (quantity > 0) {
        dispatch(
          addItem({
            productId: product.id,
            price: product.priceGbp,
            quantity,
            title: product.productName,
            imageUrl: product.images,
            suitability: product.suitableFor?.diabetes?.general,
          })
        );
      }
    });
    toast.success("Products Added to Cart");
    navigate("/cart");
  };

  const renderSaveList = () => {
    return (
      <>
        {showSaveModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span
                className={styles.closeButton}
                onClick={() => setShowSaveModal(false)}
              >
                &times;
              </span>
              <h4>Save Your Shopping List</h4>
              <input
                type="text"
                placeholder="Enter list name"
                value={listName}
                onChange={handleListNameChange}
                className={styles.listNameInput}
              />
              <button className={`btn-1`} onClick={handleSaveList}>
                Save List
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Card cardClass={styles.card}>
        <div className={styles.sliderContainer}>
          <label htmlFor="itemCount">Choose the number of items:</label>
          <input
            type="range"
            id="itemCount"
            min="1"
            max="25"
            value={itemCount}
            onChange={(e) => setItemCount(e.target.value)}
            className={styles.slider}
          />
          <div className={styles.itemCountDisplay}>
            <img src={images.bag} alt="bag" /> <h6>{itemCount}</h6>
          </div>
        </div>
        {hasDiabetes && (
          <div className={styles.checkboxContainer}>
            <Label>
              <Checkbox
                id="diabetesFriendly"
                name="diabetesFriendly"
                checked={showDiabetesFriendly}
                onChange={handleDiabetesFriendlyChange}
                sx={{
                  border: "1px solid #808080",
                  width: "25px",
                  height: "25px",
                  "&:active": {
                    outline: "none",
                    boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                  },
                }}
              />
              Show only products suitable for diabetes
            </Label>
          </div>
        )}
        <div className={`--d-f-c`} style={{ marginTop: "1rem" }}>
          <button className={`btn-1`} onClick={fetchRecommendations}>
            {loading ? <Spinner /> : "Generate Shopping List"}
          </button>
        </div>
      </Card>

      <div className={styles.displayContainer}>
        {recommendedProducts.length < 1 && error === "" ? (
          <p>Your shopping list is empty. Generate a new one.</p>
        ) : error !== "" ? (
          <p> Error: {error}</p>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.cartTable}>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>{""}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="d-flex align-items-center">
                        <img
                          src={product.images}
                          alt={product.productName}
                          className={styles.productImage}
                          onError={handleImgError}
                        />
                        {product.productName}
                        {product.suitableFor &&
                          product.suitableFor.diabetes &&
                          product.suitableFor.diabetes.general === 0 && (
                            <img src={images.alert_red} alt="alert" />
                          )}
                        {product.suitableFor &&
                          product.suitableFor.diabetes &&
                          product.suitableFor.diabetes.general === 1 && (
                            <img src={images.alert_yellow} alt="alert" />
                          )}
                      </td>
                      <td>£{product.priceGbp.toFixed(2)}</td>
                      <td>
                        <div className={styles.quantityHandler}>
                          <button onClick={() => handleDecrement(product.id)}>
                            -
                          </button>
                          <span>{itemQuantities[product.id]}</span>
                          <button onClick={() => handleIncrement(product.id)}>
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        £
                        {(
                          product.priceGbp * itemQuantities[product.id]
                        ).toFixed(2)}
                      </td>
                      <td>
                        <div className={styles.deleteHandler}>
                          <button onClick={() => handleRemoveItem(product.id)}>
                            <IoCloseCircleOutline size={30} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.totalsDisplay}>
              <div className={styles.total}>
                <p>Total Items:</p>
                <h6>{getTotalQuantity()}</h6>
              </div>
              <div className={styles.total}>
                <p>Total Price:</p>
                <h6>£{getTotalPrice()}</h6>
              </div>
            </div>

            <div className={styles.buttons}>
              <button className={`btn-1`} onClick={() => navigate("/shop")}>
                Back to Shop
              </button>
              <button className={`btn-1`} onClick={handleShowSaveModal}>
                Save List
              </button>
              <button className={`btn-1`} onClick={handleAddToCartAndNavigate}>
                Add Products to Cart
              </button>
            </div>
            {renderSaveList()}
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateFastShopping;
