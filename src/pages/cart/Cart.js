import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  addItem,
  removeItem,
  deleteItemFromCart,
  selectTotalPrice,
  checkout,
} from "../../redux/slice/cartSlice"; // Ensure paths are correct
import styles from "./Cart.module.scss";
import { FaTrash } from "react-icons/fa";
import { images } from "../../constants/index";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, BookingSlot } from "../../components/index";
import { IoCloseCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { Spinner } from "theme-ui";

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleIncrement = (item) => {
    dispatch(
      addItem({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: 1, // Increment by 1
        imageUrl: item.imageUrl,
        suitability: item.suitability,
      })
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(removeItem({ productId: item.id, quantity: 1 })); // Decrement by 1
    } else {
      dispatch(removeItem({ productId: item.id, quantity: item.quantity })); // Remove item completely
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(
      removeItem({ productId, quantity: cartItems[productId].quantity })
    );
  };

  const handleCheckout = () => {
    setIsLoading(true);
    dispatch(checkout())
      .unwrap()
      .then((order) => {
        toast.success("Checkout successful!");
        console.log("Order details:", order);
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        alert("Checkout failed: " + error.message);
      });
  };

  return (
    <section className={`${styles.cartContainer}`}>
      <Breadcrumb items={[{ label: "Cart", path: "/cart" }]} />
      <h3>My Shopping Cart</h3>
      {totalPrice === 0 ? (
        <div className={styles.emptyCart}>
          <img src={images.shopping} alt="Your cart is empty" />
          <h6>You cart is empty</h6>
          <Link to="/shop" className="btn-1">
            Back to Shop
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartContent}>
            <div className={styles.leftPanel}>
              <div className={`${styles.scrollableBody}`}>
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
                    {Object.values(cartItems).map((item) => (
                      <tr key={item.id}>
                        <td className={`d-flex align-items-center`}>
                          <img
                            src={item.imageUrl || "path/to/default/image.jpg"}
                            alt={item.title}
                            className={styles.cartItemImage}
                          />
                          {item.title}
                          {item.suitability === 0 && (
                            <img src={images.alert_red} alt="alert" />
                          )}
                          {item.suitability === 1 && (
                            <img src={images.alert_yellow} alt="alert" />
                          )}
                        </td>
                        <td>£{item.price.toFixed(2)}</td>
                        <td>
                          <div className={styles.quantityHandler}>
                            <button onClick={() => handleDecrement(item)}>
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleIncrement(item)}>
                              +
                            </button>
                          </div>
                        </td>
                        <td>£{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <div className={styles.deleteHandler}>
                            <button onClick={() => handleRemoveItem(item.id)}>
                              <IoCloseCircleOutline size={30} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.returnToShop}>
                <Link to="/shop" className={`btn-1`}>
                  Return to Shop
                </Link>
              </div>

              <div className={styles.couponContainer}>
                <p>Coupon Code</p>
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Enter code"
                  />

                  <button className={styles.searchButton}>Apply Coupon</button>
                </div>
              </div>
            </div>
            <div className={styles.rightPanel}>
              <BookingSlot />
              <div className={styles.deliverTo}>
                <p>
                  Deliver To:{" "}
                  <span>Will Smith, 123 Main St, London, W12 1QE</span>
                </p>
                <button className={`btn-2`}>Change</button>
              </div>
              <div className={styles.paymentMethod}>
                <p>
                  Payment Method: <img src={images.visa} alt="visa" />{" "}
                  <span>XXXX-XXXX-XXXX-1234</span>
                </p>
                <button className={`btn-2`}>Change</button>
              </div>
            </div>
          </div>
          <div className={`${styles.bottomBorder}`}>
            <h4>Cart Total</h4>
            <div>
              <p>Subtotal:</p>
              <h6>£{totalPrice.toFixed(2)}</h6>
            </div>
            <div>
              <p>Shipping:</p>
              <h6>Free</h6>
            </div>
            <div>
              <p>Total:</p>
              <h6>£{totalPrice.toFixed(2)}</h6>
            </div>
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <button
              className={`btn-1`}
              style={{ minWidth: "300px" }}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default Cart;
