import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebase";
import { DB_Collections } from "../lib/constants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  Card,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  Modal,
} from "antd";
import Navbar from "../components/navbar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "../assets/theme.css";

const { Option } = Select;

export default function AddAppointment() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, DB_Collections.APPOINTMENTS), {
        fullName: values.fullName,
        email: values.email,
        visaType: values.visaType,
        appointmentDate: values.appointmentDate
          ? dayjs(values.appointmentDate).format("YYYY-MM-DD")
          : null,
        details: values.details || "",
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      form.resetFields();
      alert("Appointment request submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      Modal.error({
        title: "Failed to Add Appointment",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="flex justify-center items-center py-10 px-6">
        <Card
          title={<span className="text-white text-lg">Add Appointment</span>}
          className="shadow-xl rounded-2xl w-full max-w-3xl bg-gray-800"
          headStyle={{ borderBottom: "1px solid #374151", background: "#484866ff" }}
          bodyStyle={{ background: "#68687b", padding: "2rem" }}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label={<span className="text-white-300">Full Name</span>}
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input
                placeholder="Enter your full name"
                className="bg-gray-700 text-gray border border-gray-600 rounded-md"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white-300">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter your email"
                className="bg-gray-700 text-gray border border-gray-600 rounded-md"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white-300">Visa Type</span>}
              name="visaType"
              rules={[{ required: true, message: "Please select visa type" }]}
            >
              <Select
                placeholder="Select visa type"
                className="bg-gray-700 text-white-300 rounded-md"
                dropdownStyle={{ background: "#68687b", color: "#fff" }}
              >
                <Option value="student">Student Visa</Option>
                <Option value="work">Work Visa</Option>
                <Option value="travel">Travel Visa</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-white-300">Appointment Date</span>}
              name="appointmentDate"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md"
                popupStyle={{ background: "#68687b", color: "#fff" }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white-300">Details</span>}
              name="details"
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter details"
                className="bg-gray-700 text-white border border-gray-600 rounded-md"
              />
            </Form.Item>

            <Form.Item className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="px-10 py-2"
              >
                Request Appointment
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
