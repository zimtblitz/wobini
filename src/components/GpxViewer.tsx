import { useEffect, useRef, useState } from "react";
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
const ANIMATION_DURATION = 4000;

function GpxViewer({ file }: Props) {
  const [points, setPoints] = useState<GpxPoint[]>([]);
  const [lineLength, setLineLength] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  const polylineRef = useRef<SVGPolylineElement | null>(null);

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

  useEffect(() => {
    if (polylineRef.current) {
      const length = polylineRef.current.getTotalLength();

      setLineLength(length);
      setDashOffset(0);
    }
  }, [points]);

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

  const start = svgPoints[0];
  const end = svgPoints[svgPoints.length - 1];

  const startAnimation = () => {
    if (lineLength === 0) {
      return;
    }

    // Linie verstecken
    setAnimate(false);
    setDashOffset(lineLength);

    // Zeichnen starten
    requestAnimationFrame(() => {
      setAnimate(true);
      setDashOffset(0);
    });
  };

  const routePoints = svgPoints
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMinYMin meet"
      onClick={startAnimation}
      onTouchStart={startAnimation}
    >
      <polyline
        ref={polylineRef}
        points={routePoints}
        fill="none"
        stroke="#E85D2A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: lineLength,
          strokeDashoffset: dashOffset,
          transition: animate
            ? `stroke-dashoffset ${ANIMATION_DURATION}ms ease-in-out`
            : "none",
        }}
      />

      {/* Startpunkt */}
      <circle
        cx={start.x}
        cy={start.y}
        r="6"
        fill="#E85D2A"
        vectorEffect="non-scaling-stroke"
      />

      {/* Endpunkt */}
      <circle
        cx={end.x}
        cy={end.y}
        r="6"
        fill="#C62828"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default GpxViewer;
