import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Upewnij się, że Bootstrap CSS jest zaimportowany

function Success() {
  const location = useLocation();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Sprawdź, czy w URL-u jest parametr sessionId (np. z Stripe Checkout)
    const params = new URLSearchParams(location.search);
    const id = params.get("session_id");
    if (id) {
      setSessionId(id);
      // Opcjonalnie: Tutaj możesz wysłać session_id do swojego backendu,
      // aby zweryfikować płatność i zaktualizować status zamówienia w bazie danych.
      // fetch(`/api/payment/verify-success?session_id=${id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.success) {
      //       console.log("Płatność pomyślnie zweryfikowana na backendzie.");
      //       // Tutaj możesz zresetować koszyk użytkownika, jeśli to jeszcze nie zostało zrobione na backendzie
      //     } else {
      //       console.error("Weryfikacja płatności nieudana.");
      //     }
      //   })
      //   .catch(err => console.error("Błąd weryfikacji płatności:", err));
    }
  }, [location]);

  return (
    <div
      className="container mt-5 py-5 text-center"
      style={{ maxWidth: "700px" }}
    >
      <div className="card shadow-sm p-4">
        <div className="card-body">
          <h1
            className="card-title text-success mb-4"
            style={{ fontSize: "2.5rem", fontWeight: 600 }}
          >
            Płatność zakończona sukcesem!
          </h1>
          <p className="card-text lead mb-4">
            Dziękujemy za zakupy! Twoje zamówienie zostało złożone i wkrótce
            zostanie przetworzone.
          </p>
          {sessionId && (
            <p className="text-muted small mb-4">
              ID Sesji Płatności: <code>{sessionId}</code>
            </p>
          )}
          <div className="d-grid gap-3 col-md-8 mx-auto">
            <Link to="/" className="btn btn-dark btn-lg">
              Wróć do sklepu
            </Link>
            <Link to="/profile" className="btn btn-outline-dark btn-lg">
              Zobacz swoje zamówienia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
