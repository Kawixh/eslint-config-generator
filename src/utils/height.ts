export const calculateHeight = (
  pageHeight: number,
  headerHeight: number,
  footerHeight: number
) => {
  return `${pageHeight - headerHeight - footerHeight}px`;
};
