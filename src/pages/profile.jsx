import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Avatar, message, Spin } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { DB_Collections } from "../lib/constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../assets/theme.css";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { currentUser, userData, setUserData } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName || "",
        email: userData.email || "",
      });
    }
  }, [userData, form]);

  const resetForm = () => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName || "",
        email: userData.email || "",
      });
    }
  };

  const onFinish = async (values) => {
    if (!currentUser?.uid) return;

    try {
      const result = await Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      });

      if (result.isConfirmed) {
        setSaving(true);

        await updateDoc(doc(db, DB_Collections.USERS, currentUser.uid), {
          fullName: values.fullName,
        });

        setUserData({
          ...userData,
          fullName: values.fullName,
        });

        Swal.fire("Saved!", "", "success");
        message.success("Profile updated successfully");

        navigate("/dashboard");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        resetForm();
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div> 
      <Navbar />
    <div className="page profile">
      <Card
        className="card profile-card"
        title={
          <div className="profile-header">
            <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />
            <div className="profile-info">
              <h2>{userData.fullName}</h2>
              <p>{userData.email}</p>
            </div>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>

          <Form.Item>
            <div className="profile-actions">
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>

  );
}
