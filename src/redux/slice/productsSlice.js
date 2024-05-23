import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      let products = [];
      querySnapshot.forEach((doc) => {
        // Ensure the document has data we can use
        if (doc.exists()) {
          products.push({ id: doc.id, ...doc.data() });
        }
      });
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFilteredProducts",
  async (
    { subcategory, sort, hasDiabetes, safeModeEnabled },
    { getState, rejectWithValue }
  ) => {
    try {
      let q = collection(db, "products");
      if (subcategory) {
        q = query(q, where("tags", "array-contains", subcategory));
      }

      // Apply sorting based on the sort parameter
      if (sort) {
        const field = sort.field;
        const direction = sort.direction; // 'asc' or 'desc'
        q = query(q, orderBy(field, direction));
        console.log("Sorting with field:", field, "and direction:", direction);
      }

      const querySnapshot = await getDocs(q);
      let products = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        if (safeModeEnabled && hasDiabetes) {
          if (
            (data.suitableFor?.diabetes?.type1 ?? 0) >= 1 &&
            (data.suitableFor?.diabetes?.type2 ?? 0) >= 1
          ) {
            products.push({ id: doc.id, ...data });
          }
        } else {
          products.push({ id: doc.id, ...data });
        }
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  "products/fetchRecommendedProducts",
  async (productIds, { rejectWithValue }) => {
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("productID", "in", productIds));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    filteredProducts: [],
    recommendedProducts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Define any reducers you need for products, if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredProducts = action.payload;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectAllProducts = (state) => state.products.allProducts;
export const selectFilteredProducts = (state) =>
  state.products.filteredProducts;
export const selectRecommendedProducts = (state) =>
  state.products.recommendedProducts;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export default productsSlice.reducer;
