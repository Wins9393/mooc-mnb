import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ResponsiveContext } from "../../contexts/ResponsiveContext";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

export function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const responsiveContext = useContext(ResponsiveContext);

  if (!authContext) return;
  const { user, logout } = authContext;

  if (!responsiveContext) return;
  const { vpWidth } = responsiveContext;

  const openSideMenu = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return user?.authenticated ? (
    <>
      <header className="header">
        <div className="header__main-container">
          <nav className="header__nav">
            <ul className="header__nav--list left-nav">
              {vpWidth < 480 ? (
                <li>
                  <MenuOutlined className="header__logo" onClick={openSideMenu} />
                </li>
              ) : (
                <>
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
                </>
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
                  {vpWidth < 480 ? <LogoutOutlined className="header__logo" /> : "Déconnexion"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Drawer onClose={onClose} open={open} placement="left">
        <ul className="drawer__nav--list">
          <li>
            {" "}
            <NavLink
              to="/formations"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}>
              Formations
            </NavLink>
          </li>
          {user?.role === "sadmin" ? (
            <li>
              {" "}
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
            </li>
          ) : (
            ""
          )}
        </ul>
      </Drawer>
    </>
  ) : (
    ""
  );
}
