import { useState } from "react";
import { ImageIcon } from "../shared/Icons";

function useImagenDrop(onChange: (url: string) => void) {
  const [isDragging, setIsDragging] = useState(false);

  function aplicarUrl(raw: string) {
    const lineas = raw
      .split("\n")
      .map((s) => s.trim())
      .find((s) => s && !s.startsWith("#"));

    if (!lineas) return;

    try {
      const parsed = new URL(lineas);
      if (parsed.hostname.includes("google.com")) {
        const imgurl = parsed.searchParams.get("imgurl");
        if (imgurl) {
          onChange(imgurl);
          return;
        }
      }
    } catch {
      /* URL inválida */
    }

    onChange(lineas);
  }

  return {
    isDragging,
    handlers: {
      onDragEnter(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      },
      onDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
      },
      onDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setIsDragging(false);
      },
      onDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        aplicarUrl(
          e.dataTransfer.getData("text/uri-list") ||
            e.dataTransfer.getData("text/plain") ||
            "",
        );
      },
    },
  };
}

interface FormImageDropZoneProps {
  value: string;
  onChange: (url: string) => void;
}

export function FormImageDropZone({ value, onChange }: FormImageDropZoneProps) {
  const [imgError, setImgError] = useState(false);
  const { isDragging, handlers } = useImagenDrop((url) => {
    onChange(url);
    setImgError(false);
  });

  return (
    <>
      <div
        {...handlers}
        style={{
          position: "relative",
          border: `2px dashed ${isDragging ? "var(--orange)" : "var(--line-2)"}`,
          background: isDragging ? "var(--orange-soft)" : "var(--cream-2)",
          borderRadius: 14,
          // Cambiado a min-content responsivo en lugar de un height duro de escritorio
          minHeight: "140px",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: 16,
          overflow: "hidden",
          transition: "border-color .15s, background .15s",
        }}
      >
        {value.trim() && !imgError ? (
          <img
            src={value}
            alt="Vista previa"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
            style={{
              width: "100%",
              maxHeight: 200, // Un poco más baja para móviles
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: imgError ? "var(--berry)" : "var(--ink-soft)",
              pointerEvents: "none",
            }}
          >
            <ImageIcon size={30} />
            <span style={{ fontWeight: 600, fontSize: 13, padding: "0 8px" }}>
              {imgError
                ? "Imagen no válida"
                : "Arrastrá una imagen o usá el link abajo"}
            </span>
          </div>
        )}
      </div>

      <label
        className="label"
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "var(--ink-soft)",
          display: "block",
        }}
      >
        o pegá la URL directamente
      </label>
      <input
        className="input"
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setImgError(false);
        }}
        placeholder="https://…"
        style={{ height: 40, fontSize: 14 }} // inputs ligeramente más altos son más fáciles de tocar en celular
      />
      {value && (
        <span
          style={{
            fontSize: 11,
            color: "var(--ink-soft)",
            marginTop: 4,
            display: "block",
            wordBreak: "break-all", // Evita que URLs larguísimas rompan el layout horizontal
          }}
        >
          {(() => {
            try {
              return new URL(value).hostname;
            } catch {
              return "";
            }
          })()}
        </span>
      )}
    </>
  );
}
