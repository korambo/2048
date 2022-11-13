import "./styles.css";

const colors = {
  2: "#eee4da",
  4: "#ece0c6",
  8: "#f2b179",
  16: "#ef8c53",
  32: "#f57c5f",
  64: "#e95937",
  128: "#f3d871",
  256: "#edcc61",
  512: "#eed278",
  1024: "#eecf6b",
  2048: "#eecd5f"
};

const orientation = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
};

class Game {
  constructor(root) {
    this.root = root;

    this.mapSize = 4;
    this.mapItemsCount = this.mapSize ** 2;

    this.root.className = "state";

    this.skipItems = [];

    this.state = new Array(this.mapItemsCount).fill(0);

    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    this.addElement();
    this.addElement();
    this.redrawState();
  }

  getRandomIndex() {
    const indexes = this.state
      .map((_, i) => i)
      .filter((index) => !this.state[index]);
    return indexes[Math.floor(Math.random() * indexes.length)];
  }

  redrawState() {
    this.root.innerHTML = "";

    this.state.forEach((item) => {
      const element = document.createElement("div");
      element.className = "stateItem";

      if (item) {
        element.innerHTML = item;
        const color = item > this.mapSize ? "#fff" : "#776e65";
        element.style = `background-color: ${colors[item]}; color: ${color}`;
      }

      this.root.appendChild(element);
    });
  }

  addElement() {
    const index = this.getRandomIndex();
    if (typeof index === "number") {
      this.state[index] = 2;
    }
  }

  handleKeyDown(e) {
    if (this instanceof Game) {
      const o = orientation[e.key];
      o && this.move(o);
    }
  }

  insert(item, itemIndex, insertIndex) {
    const insertItem = this.state[insertIndex];
    if (
      [0, item].includes(insertItem) &&
      !this.skipItems.includes(insertIndex)
    ) {
      this.state[itemIndex] = 0;
      this.state[insertIndex] += item;
      return true;
    }

    this.skipItems.push(insertIndex);

    return false;
  }

  moveUp() {
    for (
      let itemIndex = this.mapSize;
      itemIndex < this.mapItemsCount;
      itemIndex++
    ) {
      const item = this.state[itemIndex];

      if (!item) continue;

      const row = Math.floor(itemIndex / this.mapSize);
      const column = itemIndex % this.mapSize;

      for (let i = 0; i < row; i++) {
        const insertIndex = i * this.mapSize + column;
        const isInserted = this.insert(item, itemIndex, insertIndex);

        if (isInserted) break;
      }
    }
  }

  moveDown() {
    for (
      let itemIndex = this.mapItemsCount - this.mapSize - 1;
      itemIndex >= 0;
      itemIndex--
    ) {
      const item = this.state[itemIndex];

      if (!item) continue;

      const row = Math.floor(itemIndex / this.mapSize);
      const column = itemIndex % this.mapSize;

      for (let i = this.mapSize - 1; i > row; i--) {
        const insertIndex = i * this.mapSize + column;
        const isInserted = this.insert(item, itemIndex, insertIndex);

        if (isInserted) break;
      }
    }
  }

  moveLeft() {
    for (let i = 0; i < this.mapItemsCount - this.mapSize; i++) {
      const row = i % this.mapSize;
      const column = Math.floor(i / this.mapSize) + 1;
      const itemIndex = row * this.mapSize + column;
      const item = this.state[itemIndex];

      if (!item) continue;

      for (let j = 0; j < column; j++) {
        const insertIndex = row * this.mapSize + j;
        const isInserted = this.insert(item, itemIndex, insertIndex);

        if (isInserted) break;
      }
    }
  }

  moveRight() {
    for (let i = this.mapItemsCount - this.mapSize - 1; i >= 0; i--) {
      const row = i % this.mapSize;
      const column = Math.floor(i / this.mapSize);
      const itemIndex = row * this.mapSize + column;
      const item = this.state[itemIndex];

      if (!item) continue;

      for (let j = this.mapSize - 1; j > column; j--) {
        const insertIndex = row * this.mapSize + j;
        const isInserted = this.insert(item, itemIndex, insertIndex);

        if (isInserted) break;
      }
    }
  }

  move(orient) {
    const state = this.state.toString();
    switch (orient) {
      case "up": {
        this.moveUp();
        break;
      }
      case "down": {
        this.moveDown();
        break;
      }
      case "left": {
        this.moveLeft();
        break;
      }
      case "right": {
        this.moveRight();
        break;
      }
      default: {
        return;
      }
    }

    this.skipItems = [];

    if (state === this.state.toString()) {
      return;
    }

    this.addElement();
    this.redrawState();
  }
}

const appElement = document.getElementById("app");

const game = new Game(appElement);
