import { Button } from "antd";
import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./home.css";

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
    <div className="home__container">
      <img className="home__background-image" src="./home-fanny.webp" />
      <div className="home__title-container">
        <div className="home__title-sub-container">
          <h1>
            Bienvenue dans la <br />
            <span className="home__title--mnb">MNB</span>{" "}
            <span className="home__title--digital-academy">Digital Academy</span>
          </h1>
          <h2>Formez vous pour devenir expert de la marque</h2>
        </div>
      </div>
      <div className="home__buttons-container">
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
