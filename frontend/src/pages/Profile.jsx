import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/${user.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Błąd pobierania zamówień:", err));
    }
  }, [user]);

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Profil użytkownika</h1>
      {user ? (
        <>
          <h2 className="text-xl mb-4">Witaj, {user.username}</h2>
          <h3 className="text-lg font-semibold mb-2">Historia zamówień</h3>
          {orders.length === 0 ? (
            <p>Brak zamówień.</p>
          ) : (
            <ul className="w-full max-w-2xl space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="bg-white p-4 rounded shadow">
                  <p><strong>ID zamówienia:</strong> {order.id}</p>
                  <p><strong>Data:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Adres:</strong> {order.address}</p>
                  <p><strong>Łącznie:</strong> {formatPrice(order.total_price)} zł</p>
                  <ul className="mt-2 list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} ({item.size}) × {item.quantity} — {formatPrice(item.price)} zł
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Zaloguj się, aby zobaczyć profil.</p>
      )}
    </main>
  );
}

export default Profile;
