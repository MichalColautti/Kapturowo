import { useState } from "react";
import { useAuth } from "../AuthContext"; // Zakładam, że ten import jest poprawny w Twoim projekcie
import { useNavigate } from "react-router-dom"; // Zakładam, że ten import jest poprawny w Twoim projekcie

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth(); // Zakładam, że useAuth jest poprawnie zdefiniowane
  const navigate = useNavigate(); // Zakładam, że useNavigate jest poprawnie zdefiniowane

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Wyczyść poprzednie wiadomości

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        login({ id: data.id, username: data.username });
        setMessage("Zalogowano pomyślnie!"); // Wiadomość sukcesu
        navigate("/");
      } else {
        setMessage(data.message || "Błąd logowania."); // Wyświetl wiadomość z backendu lub ogólny błąd
      }
    } catch (error) {
      console.error("Błąd sieci lub serwera:", error);
      setMessage("Błąd połączenia z backendem. Spróbuj ponownie.");
    }
  };

  return (
    <main className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-3">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body">
          <h1 className="text-center mb-4 h3">Logowanie</h1>

          {message && (
            <div
              className={`alert ${
                message.includes("Zalogowano pomyślnie")
                  ? "alert-success"
                  : "alert-danger"
              } text-center mb-4`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                placeholder="Wprowadź swoje hasło"
                className="form-control"
              />
            </div>

            {/* Pokaż hasło i Zapomniałeś hasła? - w jednej linii, rozłożone na boki */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Pokaż hasło */}
              <div className="form-check">
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
              {/* Zapomniałeś hasła? */}
              <a href="#" className="text-decoration-none text-secondary small">
                Zapomniałeś hasła?
              </a>
            </div>

            {/* Przyciski logowania */}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-dark btn-lg" // btn-dark zamiast btn-primary dla ciemnego tła
              >
                Zaloguj się
              </button>
              {/* <button
                type="button"
                className="btn btn-outline-secondary btn-lg d-flex align-items-center justify-content-center"
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google logo"
                  className="me-2" // margin-right w Bootstrapie
                />
                Zaloguj się za pomocą Google
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
