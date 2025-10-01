import { Form, Input, Button, Typography } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function Signup() {
  const navigate = useNavigate();

  const onFinish = async ({ fullname, email, password }) => {
    try {
      // ✅ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullname,
        email,
        role: "user",
        createdAt: new Date(),
      });

      Swal.fire("Success", "Account created successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="centered-card">
      <Title level={2}>Sign Up</Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Full Name"
          name="fullname"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
