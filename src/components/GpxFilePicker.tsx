import { useRef } from "react";

interface Props {
  onFileSelected: (file: File) => void;
}

function GpxFilePicker({ onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".gpx"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <button
        onClick={openFilePicker}
        aria-label="GPX Datei auswählen"
        style={{
          position: "absolute",
          inset: "20px",
          borderRadius: "24px",
	  border: "none",
          background: "rgba(24, 116, 205, 0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E8E8E5",
          fontSize: "18px",
          fontWeight: 500,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          padding: 0,
        }}
      >
      </button>
    </>
  );
}

export default GpxFilePicker;
