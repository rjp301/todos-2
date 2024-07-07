export const formatWeight = (value: number): string => {
  if (value < 10) return (Math.round(value * 100) / 100).toLocaleString("en");
  if (value < 100) return (Math.round(value * 10) / 10).toLocaleString("en");
  return Math.round(value).toLocaleString("en");
};
