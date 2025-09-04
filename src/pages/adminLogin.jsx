import { Form, Input, Button, Typography } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function AdminLogin() {
  const navigate = useNavigate();
  const onFinish = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch {
      Swal.fire("Error", "This email is not registered or invalid credentials", "error");
    }
  };

  return (
    <div className="centered-card">
      <Title level={2}>Login</Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
