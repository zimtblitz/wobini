import { useEffect, useState } from "react";
import type { GpxPoint } from "../types/gpx";
import { parseGpx } from "../utils/gpx";

interface UseGpxResult {
  points: GpxPoint[];
  loading: boolean;
  error: string | null;
}

export function useGpx(
  source: string | null
): UseGpxResult {
  const [points, setPoints] =
    useState<GpxPoint[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setPoints([]);
      setLoading(false);
      setError(
        "⚠️ GPX nicht angegeben"
      );
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setPoints([]);

      try {
        const response =
          await fetch(source);

        if (!response.ok) {
          throw new Error("⚠️ GPX nicht gefunden");
        }

        const text =
          await response.text();

        const result =
          parseGpx(text);

        if (result.length === 0) {
          throw new Error("⚠️ GPX fehlerhaft");
        }

        setPoints(result);

      } catch (error) {
  	setPoints([]);

	if (error instanceof Error) {
	  setError(error.message);
	} else {
	  setError(
	    "⚠️ Unbekannter Fehler"
    	  );
  	}
      } finally {
        setLoading(false);
      }
    };

    load();

  }, [source]);

  return {
    points,
    loading,
    error,
  };
}
