import React, { useEffect, useState } from "react";
import Image_slider from "../components/Image_slider";
import ProductSlider from "../components/Products_slider";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Błąd pobierania produktów:', err));
  }, []);

  return (
    <main>
      <Image_slider />
      <ProductSlider products={products} title="Wybrane dla ciebie" />
      <ProductSlider products={products} title="Nowości" />
    </main>
  );
}

export default Home;
