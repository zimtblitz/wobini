import type { GpxPoint, SvgPoint } from "../types/gpx";

export function getCompletedRoute(
  gpsPosition: GpxPoint,
  routePoints: GpxPoint[],
  svgPoints: SvgPoint[]
): SvgPoint[] {
  if (
    routePoints.length === 0 ||
    svgPoints.length === 0
  ) {
    return [];
  }

  let closestIndex = 0;
  let closestDistance = Infinity;

  for (let i = 0; i < routePoints.length; i++) {
    const dx =
      routePoints[i].lat -
      gpsPosition.lat;

    const dy =
      routePoints[i].lon -
      gpsPosition.lon;

    const distance =
      dx * dx + dy * dy;

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return svgPoints.slice(
    0,
    closestIndex + 1
  );
}
