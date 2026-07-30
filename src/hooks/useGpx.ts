import { useEffect, useState } from "react";
import type { GpxPoint } from "../types/gpx";
import { parseGpx } from "../utils/gpx";

export function useGpx(file: File | null) {
  const [points, setPoints] =
    useState<GpxPoint[]>([]);

  useEffect(() => {
    if (!file) {
      setPoints([]);
      return;
    }

    const load = async () => {
      const text =
        await file.text();

      const result =
        parseGpx(text);

      setPoints(result);
    };

    load();

  }, [file]);

  return points;
}
