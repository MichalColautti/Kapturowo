import React from "react";
import Product from "./Product";

function ProductGrid({ products }) {
  return (
    <div className="container pt-4">
      <div className="row justify-content-start g-0">
        {products.map((product, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={index}>
            <Product
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              imageHeight={product.imageHeight}
              imageAspectRatio={"3/4"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
