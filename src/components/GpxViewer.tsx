import { useEffect, useState } from "react";
import {
  parseGpx,
  projectPoints,
  simplifyPoints,
} from "../utils/gpx";
import type { GpxPoint } from "../utils/gpx";

interface Props {
  file: string;
}

const SIMPLIFICATION_TOLERANCE = 0.0005;

function GpxViewer({ file }: Props) {
  const [points, setPoints] = useState<GpxPoint[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch(file);
      const text = await response.text();

      const gpxPoints = parseGpx(text);

      const simplified = simplifyPoints(
        gpxPoints,
        SIMPLIFICATION_TOLERANCE
      );

      setPoints(simplified);
    }

    load();
  }, [file]);

  if (points.length === 0) {
    return <div>Lade Route...</div>;
  }

  const svgPoints = projectPoints(points);

  const xs = svgPoints.map((p) => p.x);
  const ys = svgPoints.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const padding = 40;

  const viewBoxX = minX - padding;
  const viewBoxY = minY - padding;
  const viewBoxWidth = maxX - minX + padding * 2;
  const viewBoxHeight = maxY - minY + padding * 2;

  return (
    <svg
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMinYMin meet"
    >
      <polyline
        points={svgPoints
          .map((p) => `${p.x},${p.y}`)
          .join(" ")}
        fill="none"
	stroke="#E85D2A"
	strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
	vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default GpxViewer;
