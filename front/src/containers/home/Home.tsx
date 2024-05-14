export function Home() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "calc(100vh - var(--header-height))",
      }}>
      <img
        style={{ width: "100%", height: "99%", objectFit: "cover" }}
        src="./home-bg.webp"
        alt=""
      />
      <h1
        style={{
          width: "100%",
          position: "absolute",
          top: "10vh",
          left: "50%",
          transform: "translate(-50%)",
          fontSize: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <span
          style={{
            position: "absolute",
            top: "1rem",
            fontSize: "16rem",
            color: "var(--dark)",
            letterSpacing: "0rem",
            fontWeight: "bold",
            textShadow: "0 0 8px white",
          }}>
          MNB
        </span>
        <span
          style={{
            position: "absolute",
            top: "12rem",
            left: "50%",
            transform: "translate(-44%)",
            color: "var(--white)",
            fontSize: "8rem",
            letterSpacing: "10rem",
            fontWeight: "lighter",
            textShadow: "1px 1px 12px white, 0 0 1em white, 0 0 0.6em white, 0 0 0.2em white",
          }}>
          learn
        </span>
      </h1>
    </div>
  );
}
