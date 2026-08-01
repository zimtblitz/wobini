import { useMemo, useState } from "react";
import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { useConfig } from "../hooks/useConfig";
import { projectPoints } from "../utils/gpx";
import { projectGpsToRoute } from "../utils/routeProjection";
import { useGpx } from "../hooks/useGpx";
import MessageOverlay from "./MessageOverlay";

function GpxViewer() {
  const config = useConfig();

  const {
    points,
    loading,
    error,
  } = useGpx(config.gpx);

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

  const routePosition = useMemo(() => {
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
  }, [
    gpsPosition,
    points,
    svgPoints,
  ]);

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

  if (loading) {
    return (
      <MessageOverlay
        icon="⏳"
        message="Lade Route ..."
      />
    );
  }

  if (error) {
    return (
      <MessageOverlay
        icon="⚠️"
        message={error}
      />
    );
  }

  if (svgPoints.length === 0) {
    return (
      <MessageOverlay
        icon="⚠️"
        message="Keine Route vorhanden"
      />
    );
  }

  const xs = svgPoints.map(
    (p) => p.x
  );

  const ys = svgPoints.map(
    (p) => p.y
  );

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

  const routePoints = svgPoints
    .map(
      (p) =>
        `${p.x},${p.y}`
    )
    .join(" ");

  const visibleRoutePoints =
    visibleRoute
      .map(
        (p) =>
          `${p.x},${p.y}`
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
      {/* Schatten */}
      <polyline
        points={routePoints}
        fill="none"
        stroke="rgba(0,0,0,0.03)"
        strokeWidth={
          config.strokeWidth * 5
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* komplette Route */}
      <polyline
        points={routePoints}
        fill="none"
        stroke={config.inactiveColor}
        strokeWidth={config.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* aktive Route */}
      <polyline
        points={visibleRoutePoints}
        fill="none"
        stroke={config.activeColor}
        strokeWidth={config.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default GpxViewer;
