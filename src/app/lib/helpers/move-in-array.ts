export function moveInArray<T>(array: T[], from: number, to: number): T[] {
  const newArray = Array.from(array);
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
