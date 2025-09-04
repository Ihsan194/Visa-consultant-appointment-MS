import { Form, Input, Button, Typography } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { doc, getDoc } from "firebase/firestore";

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocSnap = await getDoc(doc(db, "users", user.uid));

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        navigate(userData.role === "admin" ? "/admin" : "/dashboard");
      } else {
        Swal.fire("Error", "User data not found", "error");
      }
    } catch {
      Swal.fire("Error", "Invalid credentials", "error");
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
      <p>
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
