import "./Loader.css";

const Loader = ({
  size = "60px",
  text = "Loading...",
  fullScreen = true,
}) => {
  return (
    <div
      className="loader-shell"
      style={{
        width: "100%",
        minHeight: fullScreen ? "100vh" : "100%",
      }}
    >
      <div
        className="loader-spinner"
        style={{ width: size, height: size }}
      />
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
