export const isDarkTheme = () => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

export const getTheme = () => {
  return isDarkTheme() ? "dark" : "light";
};
