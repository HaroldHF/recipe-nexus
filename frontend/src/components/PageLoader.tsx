import "./PageLoader.css";

export function PageLoader() {
  return (
    <div className="page-loader">
      <span className="page-loader__spinner" aria-label="Cargando..." />
    </div>
  );
}
