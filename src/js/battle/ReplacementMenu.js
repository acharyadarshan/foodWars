// when new events are added to the existing menu, this class helps to show menu onboard for the current event selected for player or enemy
class ReplacementMenu {
  constructor({ replacements, onComplete }) {
    this.replacements = replacements;
    this.onComplete = onComplete;
  }

  decide() {
    this.menuSubmit(this.replacements[0]);
  }

  menuSubmit(replacement) {
    this.keyboardMenu?.end();
    this.onComplete(replacement);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(
      this.replacements.map((c) => {
        return {
          label: c.name,
          description: c.description,
          handler: () => {
            this.menuSubmit(c);
          },
        };
      })
    );
  }
  // fires up the pause menu option with turn of players
  init(container) {
    if (this.replacements[0].isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
