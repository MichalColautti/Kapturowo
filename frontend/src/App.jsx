import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Category from "./pages/Category";
import User_profile from "./pages/User_profile";
import Favorites from "./pages/Favorites";
import New_products from "./pages/New_products";
import Sale from "./pages/Sale";
import Header from "./components/Header"; // Możliwe że tu bedzie wyświetlał się błąd, ale to normalne
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category" element={<Category />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/new-products" element={<New_products />} />
        <Route path="/user-profile" element={<User_profile />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
