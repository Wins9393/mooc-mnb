import { useContext } from "react";
import { Button, Form, Input, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./register-form.css";

type FieldType = {
  firstname?: string;
  lastname?: string;
  shop?: string;
  email?: string;
  password?: string;
};

export function RegisterForm() {
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { register } = authContext;
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.firstname && values.lastname && values.shop && values.email && values.password) {
      const isRegistered = await register(
        values.firstname,
        values.lastname,
        values.shop,
        values.email,
        values.password
      );

      if (isRegistered) {
        navigate("/formations");
      } else {
        console.log("Erreur !");
        message.error("Une erreur s'est produite");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="registerForm__container">
      <img className="registerForm__background-image" src="./home-fanny.webp" />
      <div className="registerForm__formContainer">
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
            label="Prénom"
            name="firstname"
            rules={[{ required: true, message: "Veuillez renseigner votre prénom !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            className="loginForm__formItem"
            label="Nom"
            name="lastname"
            rules={[{ required: true, message: "Veuillez renseigner votre nom !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            className="loginForm__formItem"
            label="Magasin"
            name="shop"
            rules={[{ required: true, message: "Veuillez renseigner votre magasin !" }]}>
            <Input />
          </Form.Item>

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
              Inscription
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div
        className="register__buttons-container"
        style={location.pathname === "/register" ? { gap: "0" } : { gap: "32px" }}>
        <NavLink to={"/login"}>
          <Button type="primary" size="large" shape="round">
            Connexion
          </Button>
        </NavLink>

        <NavLink to={"/register"}>
          <Button
            style={location.pathname === "/register" ? { display: "none" } : { display: "block" }}
            type="primary"
            size="large"
            shape="round">
            Inscription
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
