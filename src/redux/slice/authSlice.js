import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, additionalData }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...additionalData,
        uid: user.uid,
      });

      return {
        email: user.email,
        userID: user.uid,
        ...additionalData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       // Optionally, fetch additional user details from Firestore if needed

//       return {
//         email: user.email,
//         userID: user.uid,
//         // Add other relevant user info here
//       };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch additional user details from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("No user document found in Firestore");
        throw new Error("No such user exists!");
      }

      const userData = userDoc.data();

      return {
        email: user.email,
        userID: user.uid,
        userName: userData.userName, // Ensure this is the correct field name
        hasDiabetes: userData.hasDiabetes || false, // Ensure this is the correct field name
        additionalData: userData, // This contains all additional user data
      };
    } catch (error) {
      console.error("Login failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await signOut(auth);
      dispatch(REMOVE_ACTIVE_USER()); // Use the reducer action to clear the user state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isLoggedIn: false,
  email: null,
  userName: null,
  userID: null,
  hasDiabetes: false,
  additionalData: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      const { email, userName, userID, additionalData, hasDiabetes } =
        action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
      state.hasDiabetes = hasDiabetes;
      state.additionalData = additionalData;
    },
    REMOVE_ACTIVE_USER: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.userID = null;
      state.hasDiabetes = false;
      state.additionalData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.email = action.payload.email;
        state.userName = action.payload.userName; // Or however you wish to handle it
        state.userID = action.payload.userID;
        state.hasDiabetes = action.payload.hasDiabetes;
        state.additionalData = action.payload.additionalData;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.email = action.payload.email;
        state.userName = action.payload.userName;
        state.userID = action.payload.userID;
        state.hasDiabetes = action.payload.hasDiabetes;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectHasDiabetes = (state) => state.auth.hasDiabetes;

export default authSlice.reducer;
