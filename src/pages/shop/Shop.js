import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredProducts,
  fetchFilteredProducts,
} from "../../redux/slice/productsSlice";
import { selectHasDiabetes } from "../../redux/slice/authSlice";
import {
  toggleSafeMode,
  selectSafeMode,
} from "../../redux/slice/safeModeSlice";
import styles from "./Shop.module.scss";
import {
  Breadcrumb,
  Menu,
  ProductCard,
  FilterBar,
  NewArrivals,
} from "../../components";
import { images } from "../../constants/index";
import { CgSmileSad } from "react-icons/cg";

const Shop = () => {
  const dispatch = useDispatch();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const hasDiabetes = useSelector(selectHasDiabetes);
  const safeModeEnabled = useSelector(selectSafeMode);
  const products = useSelector(selectFilteredProducts);
  const productCount = products.length;
  const [sort, setSort] = useState({ field: "priceGbp", direction: "asc" });

  useEffect(() => {
    if (selectedSubcategory) {
      dispatch(
        fetchFilteredProducts({
          subcategory: selectedSubcategory.name,
          sort,
          hasDiabetes,
          safeModeEnabled,
        })
      );
    }
  }, [selectedSubcategory, hasDiabetes, safeModeEnabled, dispatch, sort]);

  const handleSortChange = (selectedOption) => {
    // const [field, direction] = sortValue.split("_");
    // setSort({ field, direction });
    dispatch(
      fetchFilteredProducts({
        subcategory: selectedSubcategory?.name,
        sort: selectedOption,
        hasDiabetes,
        safeModeEnabled,
      })
    );
  };

  const handleFilterChange = (filterValue) => {
    console.log("Filtering by:", filterValue);
    // Implement filtering logic here
  };

  return (
    <section className={styles.shopMainContainer}>
      <Breadcrumb items={[{ label: "Shop", path: "/shop" }]} />
      <div className={styles.contentContainer}>
        <Menu onSelectSubcategory={setSelectedSubcategory} />
        <div className={styles.productDisplayArea}>
          {selectedSubcategory ? (
            <>
              <FilterBar
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                productCount={productCount}
              />
              <div className={styles.products}>
                {products.map((item) => (
                  <ProductCard
                    key={item.id}
                    productId={item.id}
                    imageUrl={item.images}
                    title={item.productName}
                    price={item.priceGbp}
                    reviewStars={item.reviewStars || 0}
                    diabetesType1={item.suitableFor?.diabetes?.type1 ?? 0}
                    diabetesType2={item.suitableFor?.diabetes?.type2 ?? 0}
                  />
                ))}
                {products.length < 1 && (
                  <>
                    <div className={`${styles.noProductsContainer} --d-f-c`}>
                      <h5>
                        Unfortunately, there are no diabetes-friendly products
                        available in this category.
                      </h5>
                      <CgSmileSad size={35} />
                      <p> More is coming soon</p>
                      <img src={images.shopping} alt="shop by categories" />
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className={`${styles.noProductsContainer} --d-f-c`}>
              <NewArrivals />
              <img src={images.ad4} alt="sales" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Shop;
