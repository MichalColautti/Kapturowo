import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Product({
  id: productId,
  name,
  price,
  imageUrl,
  imageHeight,
  imageAspectRatio,
  userId,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/favorites/check?userId=${userId}&productId=${productId}`)
      .then((res) => res.json())
      .then((data) => setIsFavorite(data.isFavorite))
      .catch((err) => console.error("Błąd pobierania ulubionych:", err));
  }, [userId, productId]);

  const toggleFavorite = () => {
    if (!userId) {
      alert("Zaloguj się, aby dodawać do ulubionych.");
      return;
    }

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    fetch("/api/favorites", {
      method: newFavoriteStatus ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    }).catch((error) => {
      console.error("Błąd aktualizacji ulubionych:", error);
      setIsFavorite(!newFavoriteStatus);
    });
  };

  const aspectRatioStyle = imageAspectRatio
    ? { aspectRatio: imageAspectRatio }
    : {};

  return (
    <div
      className="card"
      style={{ width: "18rem", margin: "5px", position: "relative" }}
    >
      <Link
        to={`/product/${productId}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          className="card-img-container"
          style={{
            height: imageHeight,
            overflow: "hidden",
            ...aspectRatioStyle,
          }}
        >
          <img
            src={imageUrl}
            className="card-img-top cropped-image"
            alt={name}
            style={{ width: "100%" }}
          />
        </div>
      </Link>

      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        style={{
          position: "absolute",
          top: "0.6rem",
          right: "0.6rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          zIndex: 2,
        }}
        onClick={toggleFavorite}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? "red" : "#cccccc"}
          stroke="none"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "2em", height: "2em" }}
        >
          <path d="M12 21 L3.5 12.5 A5.5 5.5 0 0 1 11.28 4.72 L12 6.2 L12.72 4.72 A5.5 5.5 0 0 1 20.5 12.5 L12 21 Z" />
        </svg>
      </button>

      <div className="card-body">
        <p className="card-title" style={{ fontSize: "0.8em" }}>
          {name}
        </p>
        <p className="card-text" style={{ fontSize: "0.8em" }}>
          {price} zł
        </p>
      </div>
    </div>
  );
}

export default Product;
