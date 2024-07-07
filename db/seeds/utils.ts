export const randomItemFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randomNumberWithinRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
