"use client";

import { useElementHeightStore } from "@/store/headerStore";
import { useEffect, useRef } from "react";

export default function HeaderWithHeight() {
  const headerRef = useRef<HTMLElement>(null);
  const addOrUpdateHeight = useElementHeightStore(
    (state) => state.addOrUpdateHeight
  );

  useEffect(() => {
    if (headerRef.current) {
      const element = headerRef.current;
      const updateHeight = () => {
        const height = element.offsetHeight ?? 0;
        addOrUpdateHeight("header", height);
      };

      // Initial measurement
      updateHeight();

      // Setup resize observer
      const observer = new ResizeObserver(updateHeight);
      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }
  }, [addOrUpdateHeight]);

  return (
    <header ref={headerRef} className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        ESLint Config Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Master UI Integration: Demonstrating React Compiler with Seamless
        Cross-UI Interfaces.
      </p>
    </header>
  );
}
