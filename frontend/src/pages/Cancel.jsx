import React from "react";
import { Link } from "react-router-dom";

function Cancel() {
  return (
    <div
      className="container mt-5 py-5 text-center"
      style={{ maxWidth: "700px" }}
    >
      <div className="card shadow-sm p-4">
        <div className="card-body">
          <h1
            className="card-title text-danger mb-4"
            style={{ fontSize: "2.5rem", fontWeight: 600 }}
          >
            Płatność anulowana
          </h1>
          <p className="card-text lead mb-4">
            Twoja płatność została anulowana. Jeśli to był błąd, spróbuj
            ponownie lub skontaktuj się z nami.
          </p>
          <div className="d-grid gap-3 col-md-8 mx-auto">
            <Link to="/" className="btn btn-dark btn-lg">
              Wróć do sklepu
            </Link>
            <Link to="/cart" className="btn btn-outline-dark btn-lg">
              Przejdź do koszyka
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cancel;
