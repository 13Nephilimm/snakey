import {
  Application,
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
} from "pixi.js";
import Coordinate from "../types/Coordinate";
import Direction from "../types/Direction";
import { createRandomCoordinate } from "../utils/Grid";
import Snake from "../types/Snake";
import foodImage from "../assets/5.png";

const gridCellSize = 50;

export default class Game {
  private app: Application;
  private snake: Snake;
  private food: Coordinate;

  private snakeHead: Graphics;
  private foodGraphic: Sprite;
  private bodyGraphic: Container;

  private scoreElement: HTMLParagraphElement;
  private score: number = 0;

  constructor(app: Application) {
    this.app = app;

    this.scoreElement = document.getElementById(
      "score"
    ) as HTMLParagraphElement;

    const width = this.app.screen.width;
    const height = this.app.screen.height;

    this.snake = {
      head: createRandomCoordinate(gridCellSize, width, height),
      body: [],
      direction: Direction.Up,
    };

    this.food = createRandomCoordinate(gridCellSize, width, height);

    const radius = gridCellSize / 2;

    this.snakeHead = new Graphics()
      .circle(radius, radius, radius)
      .fill("yellow");

    // Initialize foodGraphic as a placeholder first
    this.foodGraphic = new Sprite(Texture.EMPTY);
    this.foodGraphic.width = gridCellSize;
    this.foodGraphic.height = gridCellSize;

    this.bodyGraphic = new Container();

    this.app.stage.addChild(this.bodyGraphic);
    this.app.stage.addChild(this.foodGraphic);
    this.app.stage.addChild(this.snakeHead);

    this.bindControls();
    this.loadTextureAndStart();
  }

  private async loadTextureAndStart() {
    try {
      // Load the texture using Assets.load
      const texture = await Assets.load(foodImage);

      // Apply the loaded texture
      this.foodGraphic.texture = texture;

      // Start the game
      this.start();
    } catch (error) {
      console.error("Failed to load texture:", error);

      // Fallback to a colored rectangle
      const fallback = new Graphics()
        .rect(0, 0, gridCellSize, gridCellSize)
        .fill({ color: 0xff0000, alpha: 1 });

      // Replace the sprite with the graphic
      this.app.stage.removeChild(this.foodGraphic);
      this.foodGraphic = fallback as any;
      this.app.stage.addChild(this.foodGraphic as any);

      // Start the game anyway
      this.start();
    }
  }

  private isOpposite(a: Direction, b: Direction): boolean {
    return (
      (a === Direction.Up && b === Direction.Down) ||
      (a === Direction.Down && b === Direction.Up) ||
      (a === Direction.Left && b === Direction.Right) ||
      (a === Direction.Right && b === Direction.Left)
    );
  }

  private bindControls() {
    window.addEventListener("keydown", (e) => {
      let newDirection: Direction | null = null;

      if (e.key === "w") newDirection = Direction.Up;
      if (e.key === "s") newDirection = Direction.Down;
      if (e.key === "a") newDirection = Direction.Left;
      if (e.key === "d") newDirection = Direction.Right;

      if (
        newDirection !== null &&
        !this.isOpposite(this.snake.direction, newDirection)
      ) {
        this.snake.direction = newDirection;
      }
    });
  }

  private start() {
    this.app.ticker.maxFPS = 2;
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

      // Update score
      this.score = 0;
      this.scoreElement.textContent = `Score: ${this.score}`;

      // Spawn new snake
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

      // Update score
      this.score += 1;
      this.scoreElement.textContent = `Score: ${this.score}`;

      // Display new food
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

      // Update score
      this.score = 0;
      this.scoreElement.textContent = `Score: ${this.score}`;

      // Spawn new snake
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
      const radius = gridCellSize / 2.9;

      const part = new Graphics().circle(0, 0, radius).fill("white");

      part.position.set(body.x + gridCellSize / 2, body.y + gridCellSize / 2);

      this.bodyGraphic.addChild(part);
    }
  }
}
