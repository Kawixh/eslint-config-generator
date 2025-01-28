"use client";

import { useElementHeightStore } from "@/store/headerStore";
import { useEffect } from "react";

export default function PageHeightObserver() {
  const setPageHeight = useElementHeightStore((state) => state.setPageHeight);

  useEffect(() => {
    const updateHeight = () => {
      setPageHeight(window.innerHeight);
    };

    // Initial height
    updateHeight();

    // Listen for window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [setPageHeight]);

  // This component doesn't render anything
  return null;
}
