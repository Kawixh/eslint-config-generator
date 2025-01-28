export const isDarkMode = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

export const getTheme = () => {
  return isDarkMode() ? "dark" : "light";
};
