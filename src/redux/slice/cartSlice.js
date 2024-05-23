import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";
import { doc, setDoc, Timestamp, collection } from "firebase/firestore";

export const checkout = createAsyncThunk(
  "cart/checkout",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { cart, auth } = getState();

    if (!auth.isLoggedIn || !auth.userID) {
      console.error("No user logged in or user ID missing");
      return rejectWithValue("User is not logged in or user ID is missing.");
    }

    try {
      // Correctly generate a new unique ID for the order
      const ordersCollectionRef = collection(
        db,
        "users",
        auth.userID,
        "orders"
      );
      const newOrderRef = doc(ordersCollectionRef); // Firestore automatically assigns a new ID

      const orderData = {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        createdAt: Timestamp.fromDate(new Date()),
      };

      console.log(
        "Creating order for user ID:",
        auth.userID,
        "at",
        newOrderRef.path
      );

      await setDoc(newOrderRef, orderData);
      dispatch(clearCart()); // Ensure you have a clearCart action defined properly
      return orderData;
    } catch (error) {
      console.error("Checkout failed:", error);
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  items: {}, // Using an object to map productId to item details for easy access
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { productId, price, quantity, title, imageUrl, suitability } =
        action.payload;
      const existingItem = state.items[productId];
      if (existingItem) {
        existingItem.quantity += quantity;
        state.totalPrice += price * quantity;
      } else {
        state.items[productId] = {
          id: productId,
          title,
          quantity,
          price,
          imageUrl,
          suitability,
          totalPrice: price * quantity,
        };
        state.totalPrice += price * quantity;
      }
      state.totalItems += quantity;
      console.log("Updated cart state:", state);
      console.log(JSON.parse(JSON.stringify(state)));
    },
    removeItem: (state, action) => {
      const { productId, quantity } = action.payload; // Expected quantity to remove is 1
      const item = state.items[productId];
      if (item) {
        if (item.quantity > quantity) {
          item.quantity -= quantity;
          state.totalPrice -= item.price * quantity;
          state.totalItems -= quantity;
        } else {
          state.totalPrice -= item.price * item.quantity;
          state.totalItems -= item.quantity;
          delete state.items[productId];
        }
      }
    },
    deleteItemFromCart: (state, action) => {
      const productId = action.payload;
      if (state.items[productId]) {
        const qtyToRemove = state.items[productId].quantity;
        state.totalItems -= qtyToRemove;
        state.totalPrice -= state.items[productId].price * qtyToRemove;
        delete state.items[productId];
      }
    },
    clearCart: (state) => {
      // Resets the cart to the initial state
      state.items = {};
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, deleteItemFromCart, clearCart } =
  cartSlice.actions;
// In cartSlice.js
export const selectTotalItems = (state) => state.cart.totalItems;
export const selectTotalPrice = (state) => state.cart.totalPrice;
export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer;
