import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const megaMenuRef = useRef(null);
  const dropdownRef = useRef(null); // Referencja do elementu <li> dropdown

  const handleMouseEnter = () => {
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveHeader = (e) => {
    // Sprawdzamy, czy kursor opuścił header i nie jest nad mega menu
    if (
      headerRef.current &&
      !headerRef.current.contains(e.relatedTarget) &&
      megaMenuRef.current &&
      !megaMenuRef.current.contains(e.relatedTarget)
    ) {
      setIsMegaMenuOpen(false);
    }
  };

  const handleMouseLeaveMegaMenu = (e) => {
    // Sprawdzamy, czy kursor opuścił mega menu i nie wrócił do dropdown-toggle
    if (
      megaMenuRef.current &&
      !megaMenuRef.current.contains(e.relatedTarget) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.relatedTarget)
    ) {
      setIsMegaMenuOpen(false);
    }
  };

  useEffect(() => {
    if (headerRef.current && megaMenuRef.current) {
      if (isMegaMenuOpen) {
        headerRef.current.classList.remove("border-bottom");
        megaMenuRef.current.classList.add("border-bottom");
      } else {
        headerRef.current.classList.add("border-bottom");
        megaMenuRef.current.classList.remove("border-bottom");
      }
    }
  }, [isMegaMenuOpen]);

  return (
    <header
      className="bg-light sticky-top border-bottom"
      ref={headerRef}
      onMouseLeave={handleMouseLeaveHeader} // Nasłuchujemy opuszczenia headera
    >
      <div className="container d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center">
          <Link to="/">
            <img
              src="\header-logo.png"
              alt="Kapturowo Logo"
              height="55"
              className="d-inline-block align-top me-2"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>
        <nav className="ms-auto d-none d-lg-block ">
          <ul className="nav position-relative">
            <li
              className="nav-item dropdown position-static"
              onMouseEnter={handleMouseEnter}
              ref={dropdownRef} // Przypisujemy referencję do li
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                aria-expanded={isMegaMenuOpen}
              >
                Kategorie
              </a>
              <div
                className={`dropdown-menu m-0 shadow-none rounded-0 mega-menu position-fixed start-0 ${
                  isMegaMenuOpen ? "show" : ""
                }`}
                ref={megaMenuRef}
                onMouseLeave={handleMouseLeaveMegaMenu} // Nasłuchujemy opuszczenia mega menu
              >
                <div className="d-flex justify-content-between flex-wrap px-5 py-4">
                  <div>
                    <h6 className="fw-bold mb-3">Mężczyzna</h6>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/mezczyzna/bluzy">Bluzy</Link>
                      </li>
                      <li>
                        <Link to="/mezczyzna/t-shirty">T-shirty</Link>
                      </li>
                      <li>
                        <Link to="/mezczyzna/buty">Buty</Link>
                      </li>
                      <li>
                        <Link to="/mezczyzna/akcesoria">Akcesoria</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-3">Kobieta</h6>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/kobieta/bluzy">Bluzy</Link>
                      </li>
                      <li>
                        <Link to="/kobieta/t-shirty">T-shirty</Link>
                      </li>
                      <li>
                        <Link to="/kobieta/buty">Buty</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-3">Dziecko</h6>
                    <ul className="list-unstyled">
                      <li>
                        <Link to="/dziecko/bluzy">Bluzy</Link>
                      </li>
                      <li>
                        <Link to="/dziecko/t-shirty">T-shirty</Link>
                      </li>
                      <li>
                        <Link to="/dziecko/buty">Buty</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item me-3">
              <Link to="/new-products" className="nav-link">
                Nowości
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/sale" className="nav-link">
                Wyprzedaż
              </Link>
            </li>
          </ul>
        </nav>
        {/*Kod do wyszukiwarki */}
        <form
          className="d-flex align-items-center bg-light"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search-wrapper w-100 bg-light position-relative">
            <input
              type="text"
              placeholder="Szukaj..."
              className="form-control border-0 border-bottom ps-5 bg-light"
              style={{ borderRadius: 0, boxShadow: "none" }}
            />
            <button type="submit">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "16px", height: "16px", color: "#555" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </form>

        {/* Kod do icon */}
        <div className="d-flex align-items-center">
          <ProfileMenu />
          <Link to="/favorites" className="btn btn-link p-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "1.2em", height: "1.2em" }}
            >
              <path d="M12 21 L3.5 12.5 A5.5 5.5 0 0 1 11.28 4.72 L12 6.2 L12.72 4.72 A5.5 5.5 0 0 1 20.5 12.5 L12 21 Z" />
            </svg>
          </Link>
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
      </div>
    </header>
  );
}

export default Header;
