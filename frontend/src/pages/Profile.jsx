import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Zakładam, że endpoint /api/orders/:userId zwraca również detale adresu.
      // Jeśli adres jest w orderach jako oddzielne kolumny, będziemy musieli go sformatować.
      // Na podstawie Twojego schematu bazy danych, order ma kolumny adresu, więc backend powinien je zwracać.
      fetch(`/api/orders/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Jeżeli backend zwraca tylko ID adresowe, musiałbyś pobrać detale adresu.
          // Zakładam, że `data` zawiera już pełne informacje o adresie (country, city, etc.)
          // oraz zagnieżdżone `items` dla każdego zamówienia.
          setOrders(data);
        })
        .catch((err) => console.error("Błąd pobierania zamówień:", err));
    }
  }, [user]);

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Funkcja pomocnicza do formatowania adresu
  const formatAddress = (order) => {
    const parts = [];
    if (order.street) parts.push(order.street);
    if (order.building_number) parts.push(order.building_number);
    if (order.apartment_number) parts.push(`/${order.apartment_number}`); // Dodajemy '/' dla numeru mieszkania
    if (order.postal_code || order.city)
      parts.push(`${order.postal_code || ""} ${order.city || ""}`.trim());
    if (order.country) parts.push(order.country);
    return parts.join(", ");
  };

  return (
    // Zmieniamy klasy Tailwind na Bootstrapa i dodajemy customowe style
    <div className="container my-5 p-4 rounded-3 shadow-lg bg-light text-dark">
      {user ? (
        <>
          <h2 className="display-5 fw-bold mb-4 text-dark text-center">
            Witaj, {user.username}!
          </h2>
          <hr className="my-4" /> {/* Separator */}
          <h3 className="fs-4 fw-bold mb-3 text-dark">Historia zamówień</h3>
          {orders.length === 0 ? (
            <p className="text-muted">Brak zamówień.</p>
          ) : (
            <div className="list-group">
              {" "}
              {/* Bootstrap list group */}
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="list-group-item list-group-item-action mb-3 rounded shadow-sm"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">Zamówienie ID: {order.id}</h5>
                    <small className="text-muted">
                      {new Date(order.created_at).toLocaleString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <p className="mb-1">
                    <strong>Adres dostawy:</strong> {formatAddress(order)}
                  </p>
                  <p className="mb-1">
                    <strong>Łączna kwota:</strong>{" "}
                    {formatPrice(order.total_price)} zł
                  </p>
                  <h6 className="mt-3 mb-2">Produkty:</h6>
                  <ul className="list-unstyled mb-0 ms-3">
                    {" "}
                    {/* Usunięto list-disc z Tailwind */}
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <li key={item.id} className="text-muted">
                          {item.name} ({item.size}) × {item.quantity} —{" "}
                          {formatPrice(item.price)} zł
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">
                        Brak szczegółów produktów dla tego zamówienia.
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted mt-5">
          Zaloguj się, aby zobaczyć profil.
        </p>
      )}
    </div>
  );
}

export default Profile;
