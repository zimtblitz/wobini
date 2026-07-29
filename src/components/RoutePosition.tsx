import type { SvgPoint } from "../types/gpx";

interface Props {
  position: SvgPoint | null;
}

function RoutePosition({ position }: Props) {
  if (!position) {
    return null;
  }

  return (
    <>
      {/* Pulsierender Außenring */}
      <circle
        cx={position.x}
        cy={position.y}
        r="12"
        fill="none"
	stroke="#4A90E2"
        strokeWidth="3"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      >
        <animate
          attributeName="r"
          values="12;24;12"
          dur="1.8s"
          repeatCount="indefinite"
        />

        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Weißer Kern mit orangener Umrandung */}
      <circle
        cx={position.x}
        cy={position.y}
        r="7"
        fill="#FFFFFF"
	stroke="#4A90E2"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
    </>
  );
}

export default RoutePosition;
