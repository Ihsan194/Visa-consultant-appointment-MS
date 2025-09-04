import React, { useEffect, useState } from "react";
import { Table, Tag, Card } from "antd";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/authContext";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "../assets/theme.css";

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "appointments"),
      where("createdBy", "==", currentUser.uid),
      orderBy("createdAt", "desc") // ✅ newest first
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const columns = [
    { title: "Visa Type", dataIndex: "visaType", key: "visaType" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Details", dataIndex: "details", key: "details", ellipsis: true },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) =>
        date ? dayjs(date).format("DD MMM YYYY") : "Not selected",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gold";
        let icon = <ClockCircleOutlined />;
        let text = "PENDING";

        if (status === "approved") {
          color = "green";
          icon = <CheckCircleOutlined />;
          text = "APPROVED";
        } else if (status === "rejected") {
          color = "red";
          icon = <CloseCircleOutlined />;
          text = "REJECTED";
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Rejection Reason",
      dataIndex: "rejectReason",
      key: "rejectReason",
      render: (r, record) =>
        record.status === "rejected" ? (
          <span style={{ color: "red", fontWeight: 500 }}>
            {r || "No reason provided"}
          </span>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div className="page">
      <Navbar />
      <main className="dashboard">
        <Card title="My Appointments" className="card">
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 800 }}
            bordered
          />
        </Card>
      </main>
    </div>
  );
}
