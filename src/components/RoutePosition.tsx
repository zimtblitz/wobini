import type { SvgPoint } from "../types/gpx";

interface Props {
  position: SvgPoint | null;
}

function RoutePosition({ position }: Props) {
  if (!position) {
    return null;
  }

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r="7"
      fill="#FFFFFF"
      stroke="#E85D2A"
      strokeWidth="4"
      vectorEffect="non-scaling-stroke"
    />
  );
}

export default RoutePosition;
