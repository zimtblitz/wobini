export interface GpxPoint {
  lat: number;
  lon: number;
}

export interface SvgPoint {
  x: number;
  y: number;
}

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
  tolerance = 0.00001
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
  size = 1000,
  padding = 50
): SvgPoint[] {
  if (points.length === 0) {
    return [];
  }

  const meanLat =
    points.reduce((sum, p) => sum + p.lat, 0) / points.length;

  const latCorrection = Math.cos(
    (meanLat * Math.PI) / 180
  );

  const projected = points.map((point) => ({
    x: point.lon * latCorrection,
    y: point.lat,
  }));

  const xs = projected.map((p) => p.x);
  const ys = projected.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.min(
    (size - padding * 2) / width,
    (size - padding * 2) / height
  );

  const routeWidth = width * scale;
  const routeHeight = height * scale;

  const offsetX = (size - routeWidth) / 2;
  const offsetY = (size - routeHeight) / 2;

  return projected.map((point) => ({
    x: offsetX + (point.x - minX) * scale,
    y: size - offsetY - (point.y - minY) * scale,
  }));
}
