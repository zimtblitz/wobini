import { useEffect, useState } from "react";
import { parseGpx, simplifyPoints } from "../utils/gpx";
import type { GpxPoint } from "../types/gpx";

const SIMPLIFICATION_TOLERANCE = 0.0005;

export function useGpx(file: File | null) {
  const [points, setPoints] = useState<GpxPoint[]>([]);

  useEffect(() => {
    if (!file) {
      setPoints([]);
      return;
    }

    async function load() {
      const text = await file.text();

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
