import React from "react";
import Header from "./Header";
import Contents from "./Contents";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div style={{ backgroundColor: "#f0f0f0" }}>
      <div style={{ width: "90%", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header style={{
          height: "60px",
          background: "#0d6efd",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontWeight: "bold",
          fontSize: "1.1rem",
        }} />

        <Contents className="flex-grow-1">{children}</Contents>

        <Footer style={{
          height: "40px",
          background: "#f1f3f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.9rem",
        }} />
      </div>
    </div>
  );
}
