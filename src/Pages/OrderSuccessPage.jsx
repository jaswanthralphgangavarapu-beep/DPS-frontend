// src/pages/OrderSuccessPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  // Auto-redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <FiCheckCircle size={80} color="#28a745" />
      <h1
        style={{
          margin: "20px 0 12px",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Order Placed Successfully!
      </h1>
      <p style={{ color: "#555", maxWidth: "500px", lineHeight: "1.5" }}>
        Thank you for shopping with <strong>DripCo</strong>. Your order has been
        confirmed. You will receive an SMS & email shortly.
      </p>

      <p style={{ marginTop: "20px", color: "#888", fontSize: "14px" }}>
        Redirecting to home in <strong>5</strong> seconds...
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "12px 28px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccessPage;