import React from "react";
import Product from "./Product";
import { useAuth } from "../AuthContext"; 

function ProductGrid({ products }) {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <div className="container pt-4">
      <div className="row justify-content-start g-0">
        {products.map((product, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={index}>
            <Product
              {...product}
              imageAspectRatio={"3/4"}
              userId={userId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
