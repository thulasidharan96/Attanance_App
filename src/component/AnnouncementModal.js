import React from "react";

const AnnouncementModal = ({ title, message, onClose }) => {
  if (!title || !message) return null; // Don't render if no announcement

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Slightly darker overlay
        backdropFilter: "blur(10px)", // Glassmorphism effect
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        opacity: 1,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.3)", // Semi-transparent white
          padding: "25px",
          borderRadius: "16px",
          width: "420px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(15px)", // Glass effect
          border: "1px solid rgba(255, 255, 255, 1)", // Subtle border
          margin: "0 20px",
        }}
      >
        <h2 style={{ margin: "0 0 15px", color: "#fff", fontSize: "22px" }}>
          {title}
        </h2>
        <p style={{ color: "#ddd", fontSize: "16px", marginBottom: "20px" }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            background: "linear-gradient(135deg, #ff6a00, #ee0979)", // Vibrant gradient
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s ease-in-out",
            marginTop: "20px",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #ee0979, #ff6a00)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #ff6a00, #ee0979)")
          }
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AnnouncementModal;
