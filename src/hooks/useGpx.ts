import { useEffect, useState } from "react";
import { parseGpx, simplifyPoints } from "../utils/gpx";
import type { GpxPoint } from "../types/gpx";

const SIMPLIFICATION_TOLERANCE = 0.0005;

export function useGpx(file: string) {
  const [points, setPoints] = useState<GpxPoint[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch(file);
      const text = await response.text();

      const parsed = parseGpx(text);

      const simplified = simplifyPoints(
        parsed,
        SIMPLIFICATION_TOLERANCE
      );

      setPoints(simplified);
    }

    load();
  }, [file]);

  return points;
}
