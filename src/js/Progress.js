class Progress {
  constructor() {
    this.mapId = "Kitchen";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.saveFileKey = "8llmdllsjQuHQYjCEBGr";
  }

  // save game state from the cloud firestore
  async save() {
    let data = JSON.stringify({
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerState: {
        pizzas: playerState.pizzas,
        lineup: playerState.lineup,
        items: playerState.items,
        storyFlags: playerState.storyFlags,
      },
    });

    const response = await fetch(`./gamestate/${this.saveFileKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data,
    });

    console.log(response);
    return response;
  }

  //fetch previously saved gamestate from backend
  async getSaveFile() {
    const response = await fetch(`./gamestate/${this.saveFileKey}`);
    let state = await response.json();
    console.log(state);
    return state;
    window.location.reload();
  }
  // load the fetched gamestate into current environment
  load() {
    this.getSaveFile().then((file) => {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      Object.keys(file.playerState).forEach((key) => {
        playerState[key] = file.playerState[key];
      });
    });
  }
}
