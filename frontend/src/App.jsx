import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Category from "./pages/Category";
import Favorites from "./pages/Favorites";
import New_products from "./pages/New_products";
import Sale from "./pages/Sale";
import Header from "./components/Header"; // Możliwe że tu bedzie wyświetlał się błąd, ale to normalne
import Footer from "./components/Footer";
import "./App.css";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import SearchResults from "./pages/SearchResults";
import ProductDetails from "./pages/ProductDetails"; 
import Cart from "./pages/Cart"; 
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/category" element={<Category />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/new-products" element={<New_products />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/products" element={<Products />} /> 
          <Route path="/search" element={<SearchResults />} /> 
          <Route path="/product/:id" element={<ProductDetails />} /> 
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </AuthProvider>
      <Footer />
    </Router>
  );
}

export default App;
