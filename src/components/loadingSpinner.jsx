import React from "react";
import { Spin } from "antd";

export default function LoadingSpinner({ tip = "Loading...", fullScreen = true }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: fullScreen ? "100vh" : "100%",
        width: "100%",
        background: fullScreen ? "#f9fbff" : "transparent",
      }}
    >
      <Spin
        size="large"
        tip={tip}
        style={{ color: "#003366" }}
        indicator={
          <span
            className="ant-spin-dot"
            style={{
              fontSize: "32px",
              color: "#003366",
            }}
          />
        }
      />
    </div>
  );
}
