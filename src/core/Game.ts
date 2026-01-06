import { Application, Container, Graphics } from "pixi.js";
import Coordinate from "../types/Coordinate";
import Direction from "../types/Direction";
import { createRandomCoordinate } from "../utils/Grid";
import Snake from "../types/Snake";

const gridCellSize = 20;

export default class Game {
  private app: Application;
  private snake: Snake;
  private food: Coordinate;

  private snakeHead: Graphics;
  private foodGraphic: Graphics;
  private bodyGraphic: Container;

  constructor(app: Application) {
    this.app = app;

    this.snake = {
      head: createRandomCoordinate(gridCellSize, 200, 200),
      body: [],
      direction: Direction.Up,
    };

    this.food = createRandomCoordinate(gridCellSize, 200, 200);

    this.snakeHead = new Graphics()
      .rect(0, 0, gridCellSize, gridCellSize)
      .fill("white");

    this.foodGraphic = new Graphics()
      .rect(0, 0, gridCellSize, gridCellSize)
      .fill("red");

    this.bodyGraphic = new Container();

    this.app.stage.addChild(this.foodGraphic);
    this.app.stage.addChild(this.snakeHead);
    this.app.stage.addChild(this.bodyGraphic);

    this.bindControls();
    this.start();
  }

  private bindControls() {
    window.addEventListener("keydown", (keypress) => {
      if (keypress.key === "w") this.snake.direction = Direction.Up;
      if (keypress.key === "a") this.snake.direction = Direction.Left;
      if (keypress.key === "s") this.snake.direction = Direction.Down;
      if (keypress.key === "d") this.snake.direction = Direction.Right;
    });
  }

  private start() {
    this.app.ticker.maxFPS = 10;

    this.app.ticker.add(() => this.update());
  }

  private update() {
    // Food collision
    if (
      this.snake.head.x === this.food.x &&
      this.snake.head.y === this.food.y
    ) {
      this.snake.body.push({ ...this.snake.head });
      this.food = createRandomCoordinate(gridCellSize, 200, 200);
    }

    this.snake.body.unshift({ ...this.snake.head });
    this.snake.body.pop();

    switch (this.snake.direction) {
      case Direction.Up:
        this.snake.head.y -= gridCellSize;
        break;
      case Direction.Down:
        this.snake.head.y += gridCellSize;
        break;
      case Direction.Left:
        this.snake.head.x -= gridCellSize;
        break;
      case Direction.Right:
        this.snake.head.x += gridCellSize;
        break;
    }

    // Self collision
    if (
      this.snake.body.some(
        (b) => b.x === this.snake.head.x && b.y === this.snake.head.y
      )
    ) {
      this.snake.body = [];
      this.snake.head = createRandomCoordinate(gridCellSize, 200, 200);
    }

    // Rendering
    this.snakeHead.position.set(this.snake.head.x, this.snake.head.y);
    this.foodGraphic.position.set(this.food.x, this.food.y);

    this.bodyGraphic.removeChildren();
    for (const body of this.snake.body) {
      const part = new Graphics()
        .rect(body.x, body.y, gridCellSize, gridCellSize)
        .fill("grey");
      this.bodyGraphic.addChild(part);
    }
  }
}
