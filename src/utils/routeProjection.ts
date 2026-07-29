import type { GpxPoint, SvgPoint } from "./gpx";

interface ProjectedPoint {
  x: number;
  y: number;
  distance: number;
}

function distance(
  a: GpxPoint,
  b: GpxPoint
) {
  const dx = a.lat - b.lat;
  const dy = a.lon - b.lon;

  return Math.sqrt(dx * dx + dy * dy);
}

function interpolate(
  a: SvgPoint,
  b: SvgPoint,
  factor: number
): SvgPoint {
  return {
    x: a.x + (b.x - a.x) * factor,
    y: a.y + (b.y - a.y) * factor,
  };
}

export function projectGpsToRoute(
  gps: GpxPoint,
  gpsPoints: GpxPoint[],
  svgPoints: SvgPoint[]
): SvgPoint | null {
  if (
    gpsPoints.length < 2 ||
    svgPoints.length < 2
  ) {
    return null;
  }

  let closest: ProjectedPoint | null = null;

  for (let i = 0; i < gpsPoints.length - 1; i++) {
    const start = gpsPoints[i];
    const end = gpsPoints[i + 1];

    const segmentLength = distance(start, end);

    if (segmentLength === 0) {
      continue;
    }

    const factor = Math.max(
      0,
      Math.min(
        1,
        (
          (gps.lat - start.lat) *
            (end.lat - start.lat) +
          (gps.lon - start.lon) *
            (end.lon - start.lon)
        ) /
          (segmentLength * segmentLength)
      )
    );

    const projectedGps: GpxPoint = {
      lat:
        start.lat +
        (end.lat - start.lat) * factor,

      lon:
        start.lon +
        (end.lon - start.lon) * factor,
    };

    const dist = distance(
      gps,
      projectedGps
    );

    if (
      closest === null ||
      dist < closest.distance
    ) {
      closest = {
        x:
          svgPoints[i].x +
          (svgPoints[i + 1].x -
            svgPoints[i].x) *
            factor,

        y:
          svgPoints[i].y +
          (svgPoints[i + 1].y -
            svgPoints[i].y) *
            factor,

        distance: dist,
      };
    }
  }

  if (!closest) {
    return null;
  }

  return {
    x: closest.x,
    y: closest.y,
  };
}
