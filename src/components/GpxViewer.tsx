import { useSvgAnimation } from "../hooks/useSvgAnimation";
import { projectPoints } from "../utils/gpx";
import { useGpx } from "../hooks/useGpx";

interface Props {
  file: File;
}

const ANIMATION_DURATION = 4000;

function GpxViewer({ file }: Props) {
  const points = useGpx(file);

  const {
    polylineRef,
    startAnimation,
    animationStyle,
  } = useSvgAnimation(ANIMATION_DURATION);

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
  const viewBoxWidth =
    maxX - minX + padding * 2;
  const viewBoxHeight =
    maxY - minY + padding * 2;

  const start = svgPoints[0];
  const end = svgPoints[svgPoints.length - 1];

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
        style={animationStyle}
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
