import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface HeaderProps {
  currentLocation: string;
}

export function Header(props: HeaderProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) return;
  const { user, logout } = authContext;

  return (
    <>
      <header className="header">
        <div className="header__main-container">
          {user?.authenticated ? (
            <nav className="header__nav">
              <ul className="header__nav--list left-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Accueil
                  </NavLink>
                </li>
                <li>
                  {" "}
                  <NavLink
                    to="/formations"
                    className={({ isActive }) => (isActive ? "active" : "")}>
                    Formations
                  </NavLink>
                </li>
                {user?.role === "sadmin" ? (
                  <li>
                    {" "}
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) => (isActive ? "active" : "")}>
                      Dashboard
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
              </ul>
              <ul className="header__nav--list right-nav">
                <li>
                  <Link to="/" onClick={logout}>
                    Déconnexion
                  </Link>
                </li>
              </ul>
            </nav>
          ) : (
            <nav className="header__nav">
              <ul className="header__nav--list left-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Accueil
                  </NavLink>
                </li>
              </ul>
              <ul className="header__nav--list right-nav">
                <li>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                    Connexion
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                    Inscription
                  </NavLink>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
      {props.currentLocation === "/dashboard" ? (
        <div className="second-header">
          <div className="header__second-container">
            <nav className="header__second-nav">
              <ul className="header__second-nav--list">
                <li>
                  <p>Create Formation</p>
                </li>
                <li>
                  <p>Update formation</p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
