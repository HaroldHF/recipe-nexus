interface AuthAsideProps {
  modo: "login" | "register";
}

export function AuthAside({ modo }: AuthAsideProps) {
  const quote =
    modo === "login"
      ? "Las mejores recetas son las que se comparten."
      : "Tu recetario, abierto al mundo.";
  const who =
    modo === "login"
      ? "— La comunidad de RecipeHub"
      : "— Únete a 1.200 cocineros";

  return (
    <div className="auth-aside">
      <div className="blob" style={{ width: 240, height: 240, right: -60, top: -50 }} />
      <div className="blob" style={{ width: 160, height: 160, left: -40, bottom: 80, background: "rgba(255,255,255,.08)" }} />
      <a href="/" className="brand">
        Recipe<span>Hub</span>
      </a>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="quote">"{quote}"</div>
        <div className="who">{who}</div>
      </div>
      <div style={{ fontSize: 13, opacity: 0.85, position: "relative", zIndex: 1 }}>
        RecipeHub · 248 recetas y subiendo
      </div>
    </div>
  );
}
