import React, { useState } from "react";
import styles from "./FilterBar.module.scss"; // Assuming you create a corresponding SCSS file

const FilterBar = ({ onSortChange, onFilterChange, productCount }) => {
  const [sortValue, setSortValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const sortingOptions = [
    {
      label: "Price Low to High",
      value: { field: "priceGbp", direction: "asc" },
    },
    {
      label: "Price High to Low",
      value: { field: "priceGbp", direction: "desc" },
    },
    // Add other sorting options similarly
  ];

  const handleSortChange = (event) => {
    const selectedOption = sortingOptions[event.target.value];
    setSortValue(selectedOption.value); // set the selected sort object in state if needed
    onSortChange(selectedOption.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
    onFilterChange(event.target.value);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.dropdowns}>
        <select
          value={sortValue}
          onChange={handleSortChange}
          className={styles.dropdown}
        >
          {sortingOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filterValue}
          onChange={handleFilterChange}
          className={styles.dropdown}
        >
          <option value="">Filter by</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten_free">Gluten-Free</option>
          <option value="low_sugar">Low-Sugar</option>
          <option value="low_fat">Low-Fat</option>
        </select>
      </div>
      <div className={styles.productCount}>
        {productCount} <span>products found</span>
      </div>
    </div>
  );
};

export default FilterBar;
