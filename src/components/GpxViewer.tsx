import { useMemo, useState } from "react";
import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { projectPoints } from "../utils/gpx";
import { projectGpsToRoute } from "../utils/routeProjection";
import { useGpx } from "../hooks/useGpx";
import RoutePosition from "./RoutePosition";

interface Props {
  file: File;
}

const ACTIVE_COLOR = "#E85D2A";
const INACTIVE_COLOR = "rgba(232,93,42,0.25)";

function GpxViewer({ file }: Props) {
  const points = useGpx(file);

  const gpsPosition = useCurrentPosition();

  const [showRemainingRoute, setShowRemainingRoute] =
    useState(false);

  const svgPoints = useMemo(
    () =>
      points.length > 0
        ? projectPoints(points)
        : [],
    [points]
  );

  const routePosition = useMemo(
    () => {
      if (
        !gpsPosition ||
        points.length === 0 ||
        svgPoints.length === 0
      ) {
        return null;
      }

      return projectGpsToRoute(
        {
          lat: gpsPosition.latitude,
          lon: gpsPosition.longitude,
        },
        points,
        svgPoints
      );
    },
    [
      gpsPosition,
      points,
      svgPoints,
    ]
  );

  const routeIndex = useMemo(() => {
    if (!routePosition) {
      return -1;
    }

    let closestIndex = 0;
    let closestDistance = Infinity;

    svgPoints.forEach((point, index) => {
      const dx =
        point.x - routePosition.x;

      const dy =
        point.y - routePosition.y;

      const distance =
        dx * dx + dy * dy;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [
    routePosition,
    svgPoints,
  ]);

  const visibleRoute = useMemo(() => {
    if (routeIndex < 0) {
      return [];
    }

    return showRemainingRoute
      ? svgPoints.slice(routeIndex)
      : svgPoints.slice(
          0,
          routeIndex + 1
        );
  }, [
    showRemainingRoute,
    routeIndex,
    svgPoints,
  ]);

  if (svgPoints.length === 0) {
    return <div>Lade Route...</div>;
  }

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
  const end =
    svgPoints[svgPoints.length - 1];

  const routePoints = svgPoints
    .map(
      (p) => `${p.x},${p.y}`
    )
    .join(" ");

  const visibleRoutePoints =
    visibleRoute
      .map(
        (p) => `${p.x},${p.y}`
      )
      .join(" ");

  return (
    <svg
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMinYMin meet"
      onClick={() =>
        setShowRemainingRoute(
          (value) => !value
        )
      }
      onTouchStart={() =>
        setShowRemainingRoute(
          (value) => !value
        )
      }
    >
      {/* komplette Route */}
      <polyline
        points={routePoints}
        fill="none"
        stroke={ACTIVE_COLOR}
        strokeWidth="4"
        strokeOpacity="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* aktive Route */}
      <polyline
        points={visibleRoutePoints}
        fill="none"
        stroke={ACTIVE_COLOR}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Startpunkt */}
      <circle
        cx={start.x}
        cy={start.y}
        r="6"
        fill={
          showRemainingRoute
            ? INACTIVE_COLOR
            : ACTIVE_COLOR
        }
        stroke={
          showRemainingRoute
            ? INACTIVE_COLOR
            : ACTIVE_COLOR
        }
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />

      {/* Zielpunkt */}
      <circle
        cx={end.x}
        cy={end.y}
        r="6"
        fill={
          showRemainingRoute
            ? ACTIVE_COLOR
            : INACTIVE_COLOR
        }
        stroke={
          showRemainingRoute
            ? ACTIVE_COLOR
            : INACTIVE_COLOR
        }
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />

      {/* aktuelle Position */}
      <RoutePosition
        position={routePosition}
      />
    </svg>
  );
}

export default GpxViewer;
