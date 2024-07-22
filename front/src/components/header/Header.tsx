import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const authContext = useContext(AuthContext);

  if (!authContext) return;
  const { user, logout } = authContext;

  return user?.authenticated ? (
    <>
      <header className="header">
        <div className="header__main-container">
          <nav className="header__nav">
            <ul className="header__nav--list left-nav">
              <li>
                {" "}
                <NavLink to="/formations" className={({ isActive }) => (isActive ? "active" : "")}>
                  Formations
                </NavLink>
              </li>
              {user?.role === "sadmin" ? (
                <li>
                  {" "}
                  <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                    Dashboard
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>
            <div style={{ height: "var(--header-height)", maxWidth: "300px", padding: "4px" }}>
              <img
                style={{ height: "100%", width: "100%", objectFit: "contain" }}
                src="./logo-MNB-blanc.png"
                alt=""
              />
            </div>
            <ul className="header__nav--list right-nav">
              <li>
                <Link to="/" onClick={logout}>
                  Déconnexion
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  ) : (
    ""
  );
}
