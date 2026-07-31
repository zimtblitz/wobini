import { useMemo } from "react";
import type { Config } from "../types/config";

const DEFAULT_CONFIG: Config = {
  activeColor: "#F89880",
  inactiveColor: "#F5DEB3",
  strokeWidth: 2,
};

function parseColor(
  value: string | null,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  const hexColorRegex = /^[0-9A-Fa-f]{6}$/;

  return hexColorRegex.test(value)
    ? `#${value}` 
    : fallback;
}

function parseNumber(
  value: string | null,
  fallback: number
): number {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

export function useConfig(): Config {
  return useMemo(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    return {
      activeColor: parseColor(
        params.get("activeColor"),
        DEFAULT_CONFIG.activeColor
      ),

      inactiveColor: parseColor(
        params.get("inactiveColor"),
        DEFAULT_CONFIG.inactiveColor
      ),
      strokeWidth: parseNumber(
        params.get("strokeWidth"),
        DEFAULT_CONFIG.strokeWidth
      ),
    };
  }, []);
}
