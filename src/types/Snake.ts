import Coordinate from "./Coordinate";
import Direction from "./Direction";

type Snake = {
  head: Coordinate;
  body: Array<Coordinate>;
  direction: Direction;
};

export default Snake;
