import { useEffect, useState } from "react";
import {
  parseGpx,
  projectPoints,
  simplifyPoints,
} from "../utils/gpx";
import type { GpxPoint } from "../utils/gpx";

const SIMPLIFICATION_TOLERANCE = 0.0005;

interface Props {
  file: string;
}

function GpxViewer({ file }: Props) {
  const [points, setPoints] = useState<GpxPoint[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch(file);
      const text = await response.text();

      const gpxPoints = parseGpx(text);

      console.log("Original points:", gpxPoints.length);

      const simplified = simplifyPoints(
        gpxPoints,
	SIMPLIFICATION_TOLERANCE
      );

      console.log("Simplified points:", simplified.length);

      setPoints(simplified);
    }

    load();
  }, [file]);

  if (points.length === 0) {
    return <div>Lade Route...</div>;
  }

  const svgPoints = projectPoints(points);

  return (
    <svg
      viewBox="0 0 1000 1000"
      width="100%"
      height="100%"
      style={{ background: "#eee" }}
    >
      <polyline
        points={svgPoints
          .map((p) => `${p.x},${p.y}`)
          .join(" ")}
        fill="none"
        stroke="red"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default GpxViewer;
