//to handle the arrow and enter and ASDW key events
class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };
  }

  //helper function to make the init code below more clean, call this function to get the current direction based on keydown event
  get direction() {
    return this.heldDirections[0];
  }

  //keydown keeps track of single key event, if multiple arrow keys are pressed for same direction ,then no two same keys get pushed into the array unless withdrawn
  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });
    //removes the recently held up key event from the array
    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}
