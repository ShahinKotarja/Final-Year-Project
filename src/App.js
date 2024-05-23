import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/index";
import {
  Login,
  Register,
  Home,
  Shop,
  ProductDetails,
  Cart,
  FastShopping,
} from "./pages/index";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/fast-shopping" element={<FastShopping />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
