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

    const width = this.app.screen.width;
    const height = this.app.screen.height;

    this.snake = {
      head: createRandomCoordinate(gridCellSize, width, height),
      body: [],
      direction: Direction.Up,
    };

    this.food = createRandomCoordinate(gridCellSize, width, height);

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
    // Wall collision
    const maxX = this.app.screen.width - gridCellSize;
    const maxY = this.app.screen.height - gridCellSize;

    if (
      this.snake.head.x < 0 ||
      this.snake.head.x > maxX ||
      this.snake.head.y < 0 ||
      this.snake.head.y > maxY
    ) {
      this.snake.body = [];
      this.snake.head = createRandomCoordinate(
        gridCellSize,
        this.app.screen.width,
        this.app.screen.height
      );
    }

    // Food collision
    if (
      this.snake.head.x === this.food.x &&
      this.snake.head.y === this.food.y
    ) {
      this.snake.body.push({ ...this.snake.head });
      this.food = createRandomCoordinate(
        gridCellSize,
        this.app.screen.width,
        this.app.screen.height
      );
    }

    this.snake.body.unshift({ ...this.snake.head });
    this.snake.body.pop();

    // Check direction
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
      this.snake.head = createRandomCoordinate(
        gridCellSize,
        this.app.screen.width,
        this.app.screen.height
      );
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
