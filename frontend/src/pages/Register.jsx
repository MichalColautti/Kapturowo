import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
// Pamiętaj, aby import 'bootstrap/dist/css/bootstrap.min.css'; był gdzieś globalnie w Twojej aplikacji!

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Wyczyść poprzednie wiadomości

    if (form.password !== form.confirmPassword) {
      setMessage("Hasła się nie zgadzają.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login({ id: data.id, username: data.username });
        setMessage("Rejestracja zakończona sukcesem!"); // Wiadomość sukcesu
        navigate("/");
      } else {
        setMessage(data.message || "Błąd rejestracji."); // Wyświetl wiadomość z backendu lub ogólny błąd
      }
    } catch (error) {
      console.error("Błąd sieci lub serwera:", error);
      setMessage("Błąd połączenia z backendem. Spróbuj ponownie.");
    }
  };

  return (
    // Zastępujemy flexbox Tailwindowy na klasy Bootstrapa do centrowania i min-height
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100  p-3">
      {/* Główny kontener formularza. Używamy kart Bootstrapa dla białego panelu i cienia */}
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body">
          {/* Nagłówek "Rejestracja" */}
          <h1 className="text-center mb-4 h3">Rejestracja</h1>

          {/* Komunikaty */}
          {message && (
            <div
              className={`alert ${
                message.includes("sukcesem") ? "alert-success" : "alert-danger"
              } text-center mb-4`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username input */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Wprowadź nazwę użytkownika"
                className="form-control"
              />
            </div>

            {/* Email input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Wprowadź swój email"
                className="form-control"
              />
            </div>

            {/* Password input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Hasło
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Wprowadź hasło"
                className="form-control"
              />
            </div>

            {/* Confirm Password input */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Powtórz hasło
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Powtórz hasło"
                className="form-control"
              />
            </div>

            {/* Pokaż hasło */}
            <div className="form-check mb-4">
              {" "}
              {/* mb-4 dla odstępu od guzika */}
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="form-check-input"
              />
              <label
                htmlFor="showPassword"
                className="form-check-label text-muted"
              >
                Pokaż hasło
              </label>
            </div>

            {/* Przycisk rejestracji */}
            <div className="d-grid">
              {" "}
              {/* d-grid dla rozciągnięcia guzika na całą szerokość */}
              <button
                type="submit"
                className="btn btn-dark btn-lg" // btn-dark zamiast btn-primary dla ciemnego tła
              >
                Zarejestruj się
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
