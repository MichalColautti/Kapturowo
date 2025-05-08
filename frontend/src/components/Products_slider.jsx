import React, { useState, useEffect, useRef, useCallback } from "react";
import Product from "./Product";

function ProductSlider({ products, title }) {
  const containerRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const productsPerPage = useRef(0);
  const lastInteractionRef = useRef(Date.now());

  const updateProductsPerPage = useCallback(() => {
    if (containerRef.current && products.length > 0) {
      const firstProductWidth =
        containerRef.current.children[0]?.offsetWidth || 200;
      const containerWidth = containerRef.current.offsetWidth;
      productsPerPage.current =
        Math.floor(containerWidth / firstProductWidth) || 1;
    } else {
      productsPerPage.current = 1;
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      updateProductsPerPage();
    };

    updateProductsPerPage();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateProductsPerPage]);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    const tick = () => {
      const now = Date.now();
      if (
        !isHovering &&
        now - lastInteractionRef.current >= 3500 &&
        containerRef.current &&
        productsPerPage.current > 0 &&
        products.length > 0
      ) {
        const scrollAmount =
          containerRef.current.children[0].offsetWidth *
          productsPerPage.current;
        const maxScroll =
          containerRef.current.scrollWidth - containerRef.current.offsetWidth;

        containerRef.current.scrollTo({
          left:
            containerRef.current.scrollLeft >= maxScroll
              ? 0
              : containerRef.current.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const id = setInterval(tick, 4000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [isHovering, productsPerPage, products.length]);

  const handleInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  const scrollLeft = useCallback(() => {
    handleInteraction();
    if (containerRef.current) {
      if (containerRef.current.scrollLeft === 0) {
        containerRef.current.scrollTo({
          left:
            containerRef.current.scrollWidth - containerRef.current.offsetWidth,
          behavior: "smooth",
        });
      } else {
        containerRef.current.scrollTo({
          left:
            containerRef.current.scrollLeft -
            containerRef.current.children[0].offsetWidth *
              productsPerPage.current,
          behavior: "smooth",
        });
      }
    }
  }, [productsPerPage]);

  const scrollRight = useCallback(() => {
    handleInteraction();
    if (containerRef.current && productsPerPage.current > 0) {
      const scrollAmount =
        containerRef.current.children[0].offsetWidth * productsPerPage.current;
      const maxScroll =
        containerRef.current.scrollWidth - containerRef.current.offsetWidth;

      containerRef.current.scrollTo({
        left:
          containerRef.current.scrollLeft >= maxScroll
            ? 0
            : containerRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  }, [productsPerPage]);

  return (
    <div style={{ position: "relative", paddingTop: "40px" }}>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          paddingBottom: "15px",
          whiteSpace: "nowrap",
          margin: "0 40px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseEnter={() => {
          setIsHovering(true);
          handleInteraction();
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          handleInteraction();
        }}
      >
        {products.map((product) => (
          <div key={product.id} style={{ marginRight: "10px" }}>
            <Product {...product} imageHeight="300px" imageAspectRatio="5/2" />
          </div>
        ))}
      </div>
      <button
        style={{
          position: "absolute",
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          fontSize: "2em",
          cursor: "pointer",
          zIndex: 1,
          color: " rgb(74, 73, 73)",
        }}
        onClick={scrollLeft}
      >
        &lt;
      </button>
      <button
        style={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          fontSize: "2em",
          cursor: "pointer",
          zIndex: 1,
          color: " rgb(74, 73, 73)",
        }}
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
}
export default ProductSlider;
