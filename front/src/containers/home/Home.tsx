import { Button } from "antd";
import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export function Home() {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user } = authContext;

  useEffect(() => {
    if (user?.authenticated) {
      navigate("/formations");
    }
  }, [user]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}>
      <img
        style={{ width: "100%", height: "100%", objectFit: "cover", marginBottom: "-8px" }}
        src="./home.webp"
        alt=""
      />
      <div
        style={{
          display: "flex",
          gap: "16px",
          position: "absolute",
          left: "50%",
          transform: "translate(-50%)",
          bottom: "6vh",
        }}>
        <NavLink to={"/login"}>
          <Button type="primary" size="large" shape="round">
            Connexion
          </Button>
        </NavLink>

        <NavLink to={"/register"}>
          <Button type="primary" size="large" shape="round">
            Inscription
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
