import React, { useEffect, useState } from "react";
import styles from "./SavedLists.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { IoIosArrowForward } from "react-icons/io";
import { addItem } from "../../redux/slice/cartSlice";

const SavedLists = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);
  const userID = useSelector((state) => state.auth.userID);
  const [openListId, setOpenListId] = useState(null);

  const toggleList = (id) => {
    setOpenListId(openListId === id ? null : id);
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const q = query(collection(db, "users", userID, "shoppingLists"));
        const querySnapshot = await getDocs(q);
        const fetchedLists = [];
        querySnapshot.forEach((doc) => {
          fetchedLists.push({ id: doc.id, ...doc.data() });
        });
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [userID]);

  const handleAddListToCart = (list) => {
    list.products.forEach((product) => {
      dispatch(
        addItem({
          productId: product.productId,
          price: product.price,
          quantity: product.quantity,
          title: product.name,
          imageUrl: product.image,
          suitability: product.suitability,
        })
      );
    });
  };

  return (
    <div className={styles.container}>
      {lists && lists.length < 1 ? (
        <p>You have no saved shopping list.</p>
      ) : (
        <>
          {lists.map((list) => {
            return (
              <div key={list.id} className={styles.listItem}>
                <div className={styles.listHeader}>
                  <div className={styles.headerLeft}>
                    <h4>{list.name}</h4>
                    <p>
                      {list.totalItems} products - £{list.totalPrice}
                    </p>
                    <button
                      className="btn-2"
                      onClick={() => handleAddListToCart(list)}
                    >
                      Add list to cart
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      toggleList(list.id);
                    }}
                    className={`${styles.toggleButton} ${
                      openListId === list.id ? styles.open : styles.close
                    }`}
                  >
                    <IoIosArrowForward size={30} color="black" />
                  </button>
                </div>
                <div
                  className={styles.listDetails}
                  style={{ display: openListId === list.id ? "block" : "none" }}
                >
                  <div className={styles.products}>
                    {list.products.map((product) => (
                      <div key={product.productId}>
                        <img src={product.image} alt={product.name} />
                        <h5>{product.name}</h5>
                        <p>Quantity: {product.quantity}</p>
                        <p>Price: £{product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SavedLists;
