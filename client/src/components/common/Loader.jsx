import "./Loader.css";

const Loader = ({
  size = "60px",
  text = "Loading...",
  fullScreen = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: fullScreen ? "100vh" : "100%",
        gap: "15px",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "5px solid #e5e7eb",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <p
        style={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#374151",
        }}
      >
        {text}
      </p>

      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;