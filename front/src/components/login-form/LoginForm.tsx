import { useContext } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

type FieldType = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { login } = authContext;
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.email && values.password) {
      const loggedIn = await login(values.email, values.password);

      if (loggedIn) {
        navigate("/formations");
      } else {
        console.log("Identifiants incorrects !");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div
        style={{
          width: "fit-content",
          padding: "48px",
        }}>
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
    </div>
  );
}
