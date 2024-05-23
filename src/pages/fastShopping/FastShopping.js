import React, { useState } from "react";
import styles from "./FastShopping.module.scss";
import GenerateFastShopping from "../../components/generateFastShopping/GenerateFastShopping";
import SavedLists from "../../components/savedLists/SavedLists";

const FastShopping = () => {
  const menuList = ["Generate New List", "Saved Lists"];
  const [menuActive, setMenuActive] = useState("Generate New List");

  return (
    <section className={styles.container}>
      <h2>Fast Shopping</h2>
      <p>
        This experimental feature recommends products based on your previous
        interactions. If you're new or haven't interacted with products yet, it
        will suggest popular choices to get you started.
      </p>

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
                  item === menuActive ? styles.menuActive : styles.menuNotActive
                }
              />
            </div>
          );
        })}
      </div>
      {menuActive === "Generate New List" && <GenerateFastShopping />}
      {menuActive === "Saved Lists" && <SavedLists />}
    </section>
  );
};

export default FastShopping;
