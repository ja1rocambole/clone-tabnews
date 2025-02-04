export default function Home() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "97vh",
    fontFamily: "'Arial Black', sans-serif",
    backgroundColor: "#222",
    borderRadius: "8px",
  };

  const titleStyle = {
    color: "#FFC107",
    fontSize: "2rem",
    padding: "10px 20px",
    border: "5px solid #FFC107",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(255, 193, 7, 0.8)",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🚧 EM CONSTRUÇÃO 🚧</h1>
    </div>
  );
}
