import React, { useState } from "react";
import styles from "./Header.module.scss";
import { images } from "../../constants/index";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoMdHeartEmpty } from "react-icons/io";
import { Switch, MenuButton } from "theme-ui";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { toggleSafeMode } from "../../redux/slice/safeModeSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  selectTotalItems,
  selectTotalPrice,
} from "../../redux/slice/cartSlice";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSafeModeEnabled = useSelector(
    (state) => state.safeMode.isSafeModeEnabled
  );
  const [enableSafeMode, setEnableSafeMode] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const products = useSelector((state) => state.products.allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 10);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/${productId}`);
    setSearchQuery(""); // Optionally clear search after navigation
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("You signed out");
    navigate("/");
  };

  const handleToggle = () => {
    dispatch(toggleSafeMode());
  };

  const handleClickOpen = () => {
    if (enableSafeMode) {
      // Only open the modal if the filter is currently on
      setDialogOpen(true);
    } else {
      // Directly enable the filter if it's currently off
      setEnableSafeMode(true);
      dispatch(toggleSafeMode());
    }
  };

  const handleClose = (agree) => {
    if (agree) {
      setEnableSafeMode(!enableSafeMode);
      setDialogOpen(false);
      dispatch(toggleSafeMode());
    }
    setDialogOpen(false);
  };

  const navigateToCart = (e) => {
    e.preventDefault();
    const path = isLoggedIn ? `/cart` : "/login";
    navigate(path);
  };

  const renderCart = () => {
    return (
      <div className={styles.cartContainer} onClick={(e) => navigateToCart(e)}>
        <div className={styles.cartBox}>
          <HiOutlineShoppingBag size={34} />
          <div className={styles.cartNumberCircle}>
            <p>{totalItems}</p>
          </div>
        </div>
        <div className={styles.cartTextContainer}>
          <p>Shopping cart:</p>
          <h4>£{totalPrice.toFixed(2)}</h4>
        </div>
      </div>
    );
  };

  const renderSwitch = () => {
    return (
      <div className={styles.switchContainer}>
        <img
          src={images.food_safety}
          alt="Safe Mode Switch"
          className={styles.safe_img}
        />

        <div className={styles.switchTextContainer}>
          <p>Safe shopping filter:</p>
          <div className={styles.switchBox}>
            <Switch
              checked={enableSafeMode}
              onChange={handleClickOpen}
              sx={{
                backgroundColor: isSafeModeEnabled ? "#00b207" : "#ee1c2e", // Toggle based on state
              }}
            />
            <h4 style={{ color: isSafeModeEnabled ? "#00b207" : "#ee1c2e" }}>
              {isSafeModeEnabled ? "ON" : "OFF"}
            </h4>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`w-100 ${styles.nav2_container}`}>
        <div className={styles.mobileContainer}>
          <Link to="/" className={styles.logoMobile}>
            <img src={images.static_logo} alt="Logo" />
          </Link>

          <div className={`${styles.shoppingIconsContainerMobile}`}>
            <a className={`d-flex justify-content-center align-items-center`}>
              <IoMdHeartEmpty size={34} color="black" />
            </a>
            <div className={styles.separator} />
            {renderCart()}
            <ShowOnLogin>
              <div className={styles.separator} />
              {renderSwitch()}
            </ShowOnLogin>
          </div>

          <div className={styles.burgerMenu} onClick={toggleMenu}>
            <GiHamburgerMenu size={25} color="black" />
          </div>
        </div>

        <Link to="/" className={styles.logo}>
          <img src={images.static_logo} alt="Logo" />
        </Link>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          {searchQuery && (
            <div className={styles.searchResults}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={styles.searchItem}
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.images}
                    alt={product.productName}
                    className={styles.searchItemImage}
                  />
                  <div className={styles.searchItemDetails}>
                    <p className={styles.searchItemName}>
                      {product.productName}
                    </p>
                    <p className={styles.searchItemPrice}>
                      £{product.priceGbp}
                    </p>
                  </div>
                  {product.suitableFor.diabetes.type1 === 1 && (
                    <img
                      src={images.alert_yellow}
                      alt={product.productName}
                      className={styles.alertItemImage}
                    />
                  )}
                  {product.suitableFor.diabetes.type1 === 0 && (
                    <img
                      src={images.alert_red}
                      alt={product.productName}
                      className={styles.alertItemImage}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <IoSearchSharp className={styles.searchIcon} color="#1A1A1A" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery.length > 0 ? (
            <button
              className={styles.searchButton}
              onClick={() => setSearchQuery("")}
            >
              X
            </button>
          ) : (
            <button className={styles.searchButton}>Search</button>
          )}
        </div>

        <div className={`${styles.shoppingIconsContainer}`}>
          <a className={`d-flex justify-content-center align-items-center`}>
            <IoMdHeartEmpty size={34} color="black" />
          </a>
          <div className={styles.separator} />
          {renderCart()}
          <ShowOnLogin>
            <div className={styles.separator} />
            {renderSwitch()}
          </ShowOnLogin>
        </div>

        <div className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}>
          <ul>
            <li onClick={() => setIsOpen(!isOpen)}>
              <Link to={"/"}>Home</Link>
            </li>
            <li onClick={() => setIsOpen(!isOpen)}>
              <Link to={"/shop"}>Shop</Link>
            </li>
            <li onClick={() => setIsOpen(!isOpen)}>
              <Link to={"/fast-shopping"}>Fast Shopping</Link>
            </li>
            <li onClick={() => setIsOpen(!isOpen)}>Recipes</li>
            <li onClick={() => setIsOpen(!isOpen)}>Delivery</li>
          </ul>
          <div className={styles.sideLine} />
          <ul>
            <ShowOnLogout>
              <li onClick={() => setIsOpen(!isOpen)}>
                <Link to="/login">Sign in/Sign up</Link>
              </li>
            </ShowOnLogout>

            <ShowOnLogin>
              <li onClick={() => setIsOpen(!isOpen)}>
                <Link to="/login">My account</Link>
              </li>
              <li onClick={() => setIsOpen(!isOpen)}>
                <Link to="/login">My orders</Link>
              </li>
              <li onClick={() => setIsOpen(!isOpen)}>
                <Link onClick={handleLogout}>Log out</Link>
              </li>
            </ShowOnLogin>
          </ul>

          <div className={`${styles.close}`} onClick={() => setIsOpen(!isOpen)}>
            <MdClose size={25} color="#808080" />
          </div>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deactivation of Safe Mode"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Turning off Safe Mode will display products that are not suitable
            for individuals with specific dietary restrictions. Are you sure you
            want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            style={{ color: "red" }}
            onClick={() => handleClose(true)}
            autoFocus
          >
            Yes, Turn Off
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar2;
