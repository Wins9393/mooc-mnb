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
      <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src="./home.webp" alt="" />
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
            label="Email"
            name="email"
            rules={[{ required: true, message: "Veuillez renseigner votre email !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: "Veuillez renseigner votre mot de passe !" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Connexion</Button>
          </Form.Item>
        </Form>
      </div>
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
          <Button
            type="primary"
            size="large"
            shape="round"
            disabled={location.pathname === "/login"}>
            Connexion
          </Button>
        </NavLink>

        <NavLink to={"/register"}>
          <Button
            type="primary"
            size="large"
            shape="round"
            disabled={location.pathname === "/register"}>
            Inscription
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
