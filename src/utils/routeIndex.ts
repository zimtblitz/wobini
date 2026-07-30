import type { GpxPoint } from "../types/gpx";

export function getClosestRouteIndex(
  position: GpxPoint,
  route: GpxPoint[]
) {
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

  return closestIndex;
}
