import Coordinate from "../types/Coordinate";

export function createRandomCoordinate(
  grid: number,
  width: number,
  height: number
): Coordinate {
  return {
    x: Math.floor(Math.random() * (width / grid)) * grid,
    y: Math.floor(Math.random() * (height / grid)) * grid,
  };
}
