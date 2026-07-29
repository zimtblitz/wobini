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
          width: "76px",
          height: "76px",
          borderRadius: "50%",
          border: "8px solid #E8E8E5",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#E8E8E8",
          }}
        />
      </button>
    </>
  );
}

export default GpxFilePicker;
