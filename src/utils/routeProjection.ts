import type {
  GpxPoint,
  SvgPoint,
} from "../types/gpx";

export function projectGpsToRoute(
  position: GpxPoint,
  route: GpxPoint[],
  svgPoints: SvgPoint[]
): SvgPoint | null {

  if (
    route.length === 0 ||
    svgPoints.length === 0
  ) {
    return null;
  }

  let closestIndex = 0;
  let closestDistance = Infinity;

  route.forEach((point, index) => {
    const dx =
      point.lat -
      position.lat;

    const dy =
      point.lon -
      position.lon;

    const distance =
      dx * dx + dy * dy;

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return svgPoints[closestIndex] ?? null;
}
