import React from "react";

function Header() {
  return (
    <header className="bg-light border-bottom sticky-top">
      <div className="container d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center">
          <img
            src="/logo.png" // Zastąp ścieżką do Twojego logo
            alt="Kapturowo Logo"
            height="30" // Dostosuj rozmiar logo za pomocą atrybutu height
            className="d-inline-block align-top me-2"
          />
          <span className="fw-bold fs-5">Kapturowo</span>
        </div>
        <nav className="ms-auto d-none d-lg-block">
          <ul className="nav">
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Kategorie
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Nowości
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Wyprzedaż
              </a>
            </li>
          </ul>
        </nav>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center me-3">
            <input
              type="text"
              placeholder="Szukaj..."
              className="form-control me-2"
              aria-label="Szukaj"
            />
            <button className="btn btn-outline-secondary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "1em", height: "1em" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn btn-link p-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "1.2em", height: "1.2em" }}
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="btn btn-link p-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "1.2em", height: "1.2em" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.83l-1.06-1.22a5.5 5.5 0 0 0-7.78 7.78L12 19l9.84-9.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="btn btn-link p-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "1.2em", height: "1.2em" }}
              >
                <path d="M6 2L3 6v20h18V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          </div>
          {/* Przycisk menu dla mniejszych ekranów */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        {/* Menu nawigacyjne dla mniejszych ekranów */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Kategorie
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Nowości
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-dark" href="#">
                Wyprzedaż
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
