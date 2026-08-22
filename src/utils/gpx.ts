import type { GpxPoint, SvgPoint } from "../types/gpx";

export function parseGpx(text: string): GpxPoint[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");

  const points = Array.from(xml.getElementsByTagName("trkpt"));

  return points.map((point) => ({
    lat: Number(point.getAttribute("lat")),
    lon: Number(point.getAttribute("lon")),
  }));
}

function perpendicularDistance(
  point: GpxPoint,
  start: GpxPoint,
  end: GpxPoint
): number {
  const dx = end.lon - start.lon;
  const dy = end.lat - start.lat;

  if (dx === 0 && dy === 0) {
    return Math.sqrt(
      Math.pow(point.lon - start.lon, 2) +
        Math.pow(point.lat - start.lat, 2)
    );
  }

  const t =
    ((point.lon - start.lon) * dx +
      (point.lat - start.lat) * dy) /
    (dx * dx + dy * dy);

  const projection = {
    lon: start.lon + t * dx,
    lat: start.lat + t * dy,
  };

  return Math.sqrt(
    Math.pow(point.lon - projection.lon, 2) +
      Math.pow(point.lat - projection.lat, 2)
  );
}

export function simplifyPoints(
  points: GpxPoint[],
  tolerance = 0.0005
): GpxPoint[] {
  if (points.length <= 2) {
    return points;
  }

  let maxDistance = 0;
  let index = 0;

  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(
      points[i],
      start,
      end
    );

    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = simplifyPoints(
      points.slice(0, index + 1),
      tolerance
    );

    const right = simplifyPoints(
      points.slice(index),
      tolerance
    );

    return [
      ...left.slice(0, -1),
      ...right,
    ];
  }

  return [start, end];
}

export function projectPoints(
  points: GpxPoint[],
  size = 1000
): SvgPoint[] {
  if (points.length === 0) {
    return [];
  }

  const meanLat =
    points.reduce((sum, p) => sum + p.lat, 0) /
    points.length;

  const latCorrection = Math.cos(
    (meanLat * Math.PI) / 180
  );

  // Project longitude/latitude into a coordinate system
  // where longitude is corrected for the latitude.
  const projected = points.map((point) => ({
    x: point.lon * latCorrection,
    y: point.lat,
  }));

  const start = projected[0];
  const end = projected[projected.length - 1];

  // Vector from start to end.
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Angle of the line from start to end.
  const angle = Math.atan2(dy, dx);

  // Rotate the route by the negative angle so that
  // the line from start to end becomes horizontal.
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);

  const rotated = projected.map((point) => {
    // Move the start point to the origin.
    const x = point.x - start.x;
    const y = point.y - start.y;

    // Rotate around the start point.
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    };
  });

  // If the end is west of the start, put the end on
  // the left side of the resulting route.
  if (points[points.length - 1].lon < points[0].lon) {
    for (const point of rotated) {
      point.x = -point.x;
    }
  }

  const xs = rotated.map((p) => p.x);
  const ys = rotated.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  const scale = size / Math.max(width, height);

  return rotated.map((point) => ({
    x: (point.x - minX) * scale,
    y: (maxY - point.y) * scale,
  }));
}
