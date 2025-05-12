import React from "react";
import Products_grid from "../components/Products_grid";

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
];

function New_Products() {
  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2
          className="text-start border-bottom pb-2"
          style={{ fontWeight: 400 }}
        >
          Nowości
        </h2>
      </div>
      <Products_grid products={productsData} />
    </div>
  );
}

export default New_Products;
