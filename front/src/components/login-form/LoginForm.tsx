import { useContext } from "react";
import { Button, Form, Input, message } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./login-form.css";

type FieldType = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { login } = authContext;
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: any) => {
    if (values.email && values.password) {
      const loggedIn = await login(values.email, values.password);

      if (loggedIn) {
        navigate("/formations");
      } else {
        console.log("Identifiants incorrects !");
        message.error("Identifiants incorrects !");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="loginForm__container">
      <img className="loginForm__background-image" src="./home-fanny.webp" />
      <div className="loginForm__formContainer">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item<FieldType>
            className="loginForm__formItem"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Veuillez renseigner votre email !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            className="loginForm__formItem"
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: "Veuillez renseigner votre mot de passe !" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" size="large" shape="round" htmlType="submit">
              Connexion
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div
        className="login__buttons-container"
        style={location.pathname === "/login" ? { gap: "0" } : { gap: "32px" }}>
        <NavLink to={"/login"}>
          <Button
            style={location.pathname === "/login" ? { display: "none" } : { display: "block" }}
            type="primary"
            size="large"
            shape="round">
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
