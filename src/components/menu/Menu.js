import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Menu.module.scss";
import { images } from "../../constants/index";
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdArrowDropright } from "react-icons/io";

const CategoryLink = ({
  category,
  onSelectSubcategory,
  setSelectedSubcategory,
  selectedSubcategory,
  setOpenMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const handleSubcategorySelect = (subcat) => {
    setSelectedSubcategory(subcat.name); // Update the selected subcategory
    onSelectSubcategory(subcat); // Additional actions on select
    if (window.innerWidth < 824) setOpenMenu(false);
  };

  return (
    <li className={styles.categoryItem}>
      <div
        onClick={() => {
          toggle();
        }}
        className={styles.categoryName}
        style={{ backgroundColor: isOpen ? "white" : "transparent" }}
      >
        <img
          src={category.icon}
          alt={`${category.name} icon`}
          className={styles.iconStyle}
        />
        {category.name}
        <span className={isOpen ? styles.arrow_open : styles.arrow}>
          {<MdArrowForwardIos size={20} />}
        </span>
      </div>
      {isOpen && category.subcategories && (
        <ul className={styles.subcategoryList}>
          {category.subcategories.map((subcat) => (
            <li key={subcat.name} className={styles.subcategoryItem}>
              <div
                onClick={() => {
                  handleSubcategorySelect(subcat);
                }}
                className={
                  selectedSubcategory === subcat.name
                    ? styles.activeSubcategory
                    : styles.subcategoryLink
                }
              >
                {subcat.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Menu = ({ onSelectCategory, onSelectSubcategory }) => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 824);

  const toggleCategory = (name) => {
    setOpenCategory(openCategory === name ? null : name);
  };

  const handleSelectCategory = (category) => {
    // setSelectedSubcategory(category.name);
    onSelectCategory(category);
  };

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    // Fetch categories from database or define them here
    const fetchedCategories = [
      {
        name: "Vegetables",
        icon: images.carrot,
        subcategories: [
          { name: "Fresh Vegetables", path: "/shop/vegetables/fresh" },
          { name: "Herbs", path: "/shop/vegetables/herbs" },
        ],
      },
      {
        name: "Fruit",
        icon: images.apple,
        subcategories: [
          { name: "Fresh Fruits", path: "/shop/fruit/fresh" },
          { name: "Canned Fruits", path: "/shop/fruit/canned" },
        ],
      },
      {
        name: "Organic",
        icon: images.honey,
        subcategories: [
          { name: "Spices", path: "/shop/organic/spices" },
          { name: "Honey", path: "/shop/organic/honey" },
          { name: "Oils", path: "/shop/organic/Oils" },
        ],
      },
      {
        name: "Snacks",
        icon: images.chips,
        subcategories: [
          { name: "Savory", path: "/shop/snacks/savory" },
          { name: "Nuts and Seeds", path: "/shop/snacks/nuts" },
          { name: "Sweet", path: "/shop/snacks/sweet" },
          { name: "Spread", path: "/shop/snacks/spread" },
        ],
      },
      {
        name: "Meat",
        icon: images.meat,
        subcategories: [
          { name: "Fresh Meat", path: "/shop/meat/fresh" },
          { name: "Fresh Poultry", path: "/shop/meat/poultry" },
          { name: "Hams", path: "/shop/meat/hams" },
        ],
      },
      {
        name: "Fish",
        icon: images.fish,
        subcategories: [
          { name: "Fresh Fish", path: "/shop/fish/fresh" },
          { name: "Canned Fish", path: "/shop/fish/canned" },
        ],
      },
      {
        name: "Bakery",
        icon: images.croissant,
        subcategories: [
          { name: "Bread", path: "/shop/bakery/bread" },
          { name: "Muffin and Pastries", path: "/shop/bakery/pastries" },
        ],
      },
      {
        name: "Beverage",
        icon: images.bottle,
        subcategories: [
          { name: "Fizzy Drinks", path: "/shop/beverage/fizzy" },
          { name: "Juices", path: "/shop/beverage/juices" },
        ],
      },
      {
        name: "Pasta & Rice",
        icon: images.macaroni,
        subcategories: [
          { name: "Pasta", path: "/shop/pastarice/pasta" },
          { name: "Rice", path: "/shop/pastarice/rice" },
        ],
      },
      {
        name: "Dairy",
        icon: images.cheese,
        subcategories: [
          { name: "Milk", path: "/shop/dairy/milk" },
          { name: "Yogurt", path: "/shop/dairy/yogurt" },
          { name: "Cheese", path: "/shop/dairy/cheese" },
        ],
      },
    ];
    setCategories(fetchedCategories);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 824);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={
        isMobile
          ? `${styles.menu} ${styles.openMenu}`
          : `${styles.menu} ${styles.closedMenu}`
      }
    >
      <h4>Categories</h4>
      <hr />
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <CategoryLink
            key={category.name}
            category={category}
            isOpen={openCategory === category.name}
            toggle={toggleCategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubcategory={onSelectSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedSubcategory={selectedSubcategory}
            setOpenMenu={setOpenMenu}
          />
        ))}
      </ul>
      <div
        className={`${styles.mobileToggle} --d-f-c`}
        onClick={() => setIsMobile(!isMobile)}
      >
        <IoMdArrowDropright size={35} color="white" />
      </div>
    </div>
  );
};

export default Menu;
