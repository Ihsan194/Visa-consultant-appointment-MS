// src/pages

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { message, Spin, Table, Tag } from "antd";

export default function AppointmentList({ filter, userId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId)
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          let data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (filter !== "all") {
            data = data.filter((appt) => appt.status === filter);
          }

          setAppointments(data);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          message.error("Failed to load appointments");
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error("Error loading appointments:", err);
      setLoading(false);
    }
  }, [filter, userId]);

  const columns = [
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Email",
      dataIndex: "clientEmail",
      key: "clientEmail",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "—";
        if (date.toDate) return date.toDate().toLocaleDateString(); // Firestore Timestamp
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "approved") color = "green";
        else if (status === "pending") color = "blue";
        else if (status === "rejected") color = "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
  ];

  if (loading) return <Spin tip="Loading appointments..." />;

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={appointments}
      pagination={{ pageSize: 5 }}
    />
  );
}
