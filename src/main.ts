import { Application } from "pixi.js";
import Game from "./core/Game";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", width: 800, height: 600 });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  new Game(app);
})();
