import { Application, Container, Graphics } from "pixi.js";

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

type Coordinate = {
  x: number;
  y: number;
};

type Snake = {
  head: Coordinate;
  body: Array<Coordinate>;
  direction: Direction;
};

function createRandomCoordinate(grid: number): Coordinate {
  return {
    x: Math.floor(Math.random() * (200 / grid)) * grid,
    y: Math.floor(Math.random() * (200 / grid)) * grid,
  };
}

(async () => {
  const gridCellSize = 20;

  const snake: Snake = {
    head: createRandomCoordinate(gridCellSize),
    body: [],
    direction: Direction.Up,
  };

  let food: Coordinate = createRandomCoordinate(gridCellSize);

  // Listen to the keyboard events
  window.addEventListener("keydown", (keypress) => {
    if (keypress.key === "w") {
      snake.direction = Direction.Up;
    }
    if (keypress.key === "a") {
      snake.direction = Direction.Left;
    }
    if (keypress.key === "s") {
      snake.direction = Direction.Down;
    }
    if (keypress.key === "d") {
      snake.direction = Direction.Right;
    }
  });

  // Initialize the app
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const snakeHead = new Graphics()
    .rect(0, 0, gridCellSize, gridCellSize)
    .fill("white");
  const foodGraphic = new Graphics()
    .rect(0, 0, gridCellSize, gridCellSize)
    .fill("red");

  const bodyGraphic = new Container();

  app.stage.addChild(foodGraphic);
  app.stage.addChild(snakeHead);
  app.stage.addChild(bodyGraphic);

  app.ticker.maxFPS = 10;

  // Listen for animate update
  app.ticker.add(() => {
    // Check food collision
    if (snake.head.x === food.x && snake.head.y === food.y) {
      snake.body.push({ x: snake.head.x, y: snake.head.y });
      food = createRandomCoordinate(gridCellSize);
    }

    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();

    // Check snake direction
    if (snake.direction === Direction.Up) {
      snake.head.y -= gridCellSize;
    }
    if (snake.direction === Direction.Down) {
      snake.head.y += gridCellSize;
    }
    if (snake.direction === Direction.Left) {
      snake.head.x -= gridCellSize;
    }
    if (snake.direction === Direction.Right) {
      snake.head.x += gridCellSize;
    }

    // Check snake body collision
    if (
      snake.body.some(
        (body) => body.x === snake.head.x && body.y === snake.head.y
      )
    ) {
      snake.body = [];
      snake.head = createRandomCoordinate(gridCellSize);
    }

    // Rendering
    snakeHead.position.set(snake.head.x, snake.head.y);
    foodGraphic.position.set(food.x, food.y);

    bodyGraphic.removeChildren();
    for (const body of snake.body) {
      const snakeBody = new Graphics()
        .rect(body.x, body.y, gridCellSize, gridCellSize)
        .fill("grey");
      bodyGraphic.addChild(snakeBody);
    }
  });
})();
