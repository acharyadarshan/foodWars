class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 60;

    this.timeout = null;
    this.isDone = false;
  }

  // catches the index of single span and class to it, so one character with full opacity is revealed. Also sets timeout when list of text is complete
  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span").forEach((s) => {
      s.classList.add("revealed");
    });
  }

  // creating a list of spans as a list to show typewriter effect at bottom of screen
  init() {
    let characters = [];
    this.text.split("").forEach((character) => {
      //Create each span, add to element in DOM
      let span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      //Add this span to our internal state Array
      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}
