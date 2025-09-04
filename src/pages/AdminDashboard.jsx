import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { DB_Collections } from "../lib/constants";
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
  Layout,
  Modal,
  Form,
} from "antd";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import "../assets/theme.css";

const { Option } = Select;
const { Content } = Layout;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRecord, setRejectRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, DB_Collections.APPOINTMENTS),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAppointments(rows);
    } catch (e) {
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let out = [...appointments];
    if (statusFilter !== "all") {
      out = out.filter((a) => (a.status || "pending") === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      out = out.filter(
        (a) =>
          (a.fullName || "").toLowerCase().includes(s) ||
          (a.email || "").toLowerCase().includes(s) ||
          (a.details || "").toLowerCase().includes(s) ||
          (a.visaType || "").toLowerCase().includes(s)
      );
    }
    if (sort === "newest") {
      out.sort(
        (a, b) => (b?.createdAt?.seconds || 0) - (a?.createdAt?.seconds || 0)
      );
    } else {
      out.sort(
        (a, b) => (a?.createdAt?.seconds || 0) - (b?.createdAt?.seconds || 0)
      );
    }
    return out;
  }, [appointments, statusFilter, search, sort]);

  const approve = async (record) => {
    try {
      await updateDoc(doc(db, DB_Collections.APPOINTMENTS, record.id), {
        status: "approved",
        updatedAt: serverTimestamp(),
      });
      message.success("Appointment approved");
      fetchData();
    } catch (e) {
      message.error(e.message);
    }
  };

  const openRejectModal = (record) => {
    setRejectRecord(record);
    form.resetFields();
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      await updateDoc(doc(db, DB_Collections.APPOINTMENTS, rejectRecord.id), {
        status: "rejected",
        rejectReason: values.rejectReason, 
        updatedAt: serverTimestamp(),
      });
      message.success("Appointment rejected");
      setRejectModalOpen(false);
      fetchData();
    } catch (e) {
      message.error(e.message);
    }
  };

  const columns = [
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) =>
        v?.toDate ? dayjs(v.toDate()).format("YYYY-MM-DD HH:mm") : "-",
    },
    { title: "Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Visa", dataIndex: "visaType", key: "visaType" },
    {
      title: "Appointment Date",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (d) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
    { title: "Details", dataIndex: "details", key: "details", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const color =
          s === "approved" ? "green" : s === "rejected" ? "red" : "gold";
        return <Tag color={color}>{(s || "pending").toUpperCase()}</Tag>;
      },
    },
    {
      title: "Rejection Reason",
      dataIndex: "rejectReason",
      key: "rejectReason",
      render: (reason, record) =>
        record.status === "rejected" ? reason || "No reason provided" : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "pending" ? ( 
          <Space wrap>
            <Button type="primary" onClick={() => approve(record)}>
              Approve
            </Button>
            <Button danger onClick={() => openRejectModal(record)}>
              Reject
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <Content className="dashboard-content">
        <Card title="All Client Appointments" className="dashboard-card">
          <Space wrap className="dashboard-controls">
            <Input.Search
              allowClear
              placeholder="Search name, email, details, visa"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={statusFilter}
              className="select"
              onChange={setStatusFilter}
            >
              <Option value="all">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Select value={sort} className="select" onChange={setSort}>
              <Option value="newest">Newest</Option>
              <Option value="oldest">Oldest</Option>
            </Select>
            <Button onClick={fetchData}>Refresh</Button>
          </Space>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 900 }}
          />
        </Card>
      </Content>

      <Modal
        title="Reject Appointment"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Reason for Rejection"
            name="rejectReason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter rejection reason" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
