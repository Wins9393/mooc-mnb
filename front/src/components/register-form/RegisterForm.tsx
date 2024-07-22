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
      <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src="./home.webp" alt="" />
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
            label="Prénom"
            name="firstname"
            rules={[{ required: true, message: "Veuillez renseigner votre prénom !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Nom"
            name="lastname"
            rules={[{ required: true, message: "Veuillez renseigner votre nom !" }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Magasin"
            name="shop"
            rules={[{ required: true, message: "Veuillez renseigner votre magasin !" }]}>
            <Input />
          </Form.Item>

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
            <Button htmlType="submit">Inscription</Button>
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
