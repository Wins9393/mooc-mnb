export function Home() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "calc(100vh - var(--header-height))",
      }}>
      <img
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        src="./silmo-mooc-mnb.jpg"
        alt=""
      />
      <h1
        style={{
          width: "100%",
          position: "absolute",
          top: "30vh",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "5rem",
          letterSpacing: "-0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--white-rose)",
          textShadow: "1px 1px 2px var(--dark)",
        }}>
        Bienvenue sur{" "}
        <span
          style={{
            position: "absolute",
            top: "5rem",
            fontSize: "8rem",
            color: "black ",
            letterSpacing: "2rem",
            fontWeight: "bolder",
            textShadow: "1px 1px 2px white, 0 0 1em white, 0 0 0.2em white",
          }}>
          MNB Learn.
        </span>
      </h1>
    </div>
  );
}
