import React from "react";
import Image_slider from "../components/Image_slider";
import ProductSlider from "../components/Products_slider";

function Home() {
  // Przykładowe dane produktów (docelowo pobierane z bazy danych)
  const productsData = [
    {
      id: 1,
      name: "Produkt 1",
      price: "100zł",
      imageUrl: "/image_slider/img_2.jpg",
    },
    {
      id: 2,
      name: "Produkt 2",
      price: "150zł",
      imageUrl: "/image_slider/img_2.jpg",
    },
    {
      id: 3,
      name: "Produkt 3",
      price: "200zł",
      imageUrl: "/image_slider/img_2.jpg",
    },
    {
      id: 4,
      name: "Produkt 4",
      price: "120zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 5,
      name: "Produkt 5",
      price: "180zł",
      imageUrl: "/image_slider/img_3.jpg",
    },
    {
      id: 6,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 7,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 8,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 8,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 8,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 8,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    {
      id: 8,
      name: "Produkt 6",
      price: "250zł",
      imageUrl: "/image_slider/img_1.jpg",
    },
    // Dodaj więcej produktów
  ];

  return (
    <main>
      <Image_slider />
      <ProductSlider products={productsData} title="Wybrane dla ciebie" />
      <ProductSlider products={productsData} title="Nowości" />
    </main>
  );
}

export default Home;
