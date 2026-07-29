import { useEffect, useRef, useState } from "react";

export function useSvgAnimation(duration: number) {
  const polylineRef = useRef<SVGPolylineElement | null>(null);

  const [lineLength, setLineLength] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  const updateLength = () => {
    if (polylineRef.current) {
      const length =
        polylineRef.current.getTotalLength();

      setLineLength(length);
      setDashOffset(0);
    }
  };

  useEffect(() => {
    updateLength();
  });

  const startAnimation = () => {
    if (lineLength === 0) {
      return;
    }

    setAnimate(false);
    setDashOffset(lineLength);

    requestAnimationFrame(() => {
      setAnimate(true);
      setDashOffset(0);
    });
  };

  const animationStyle = {
    strokeDasharray: lineLength,
    strokeDashoffset: dashOffset,
    transition: animate
      ? `stroke-dashoffset ${duration}ms ease-in-out`
      : "none",
  };

  return {
    polylineRef,
    startAnimation,
    animationStyle,
  };
}
