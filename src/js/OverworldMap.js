/***
 * All the grid coordinates  below are calculated using asprite editor, which makes it easy to view anycordinate position for object you want to place in a screen
 * ***/

// This class contains all the necessary details of npc and game objects, and hero player. and methods for cutscenes and transition between maps
class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  //substracting the cameraPerson which is actually offset of the current environment from both sides will make player move relative to the background
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  //to mount npc objects in the current map scene
  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }
    this.isCutscenePlaying = false;
  }

  // To start cutscenes when hero player faces the npc objects - if it finds a match , then it triggers talking or specific relevant scenario context

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find((scenario) => {
        return (scenario.required || []).every((sf) => {
          return playerState.storyFlags[sf];
        });
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  // to check if the cordinate postion player has stepped triggers the transition scenario to another map

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  // create wall in postion where the hero character is not allowed to move
  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  // movewall basically moves the position of wall dynamically as the npc character moves
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

//attach the whole map scene of class to the window. All the codes are just repeatition for differenet objects and their cordinates
window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    lowerSrc: "assets/images/maps/DemoLower.png",
    upperSrc: "assets/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(9),
        src: "assets/images/characters/people/npc1.png",
        //this array of object helps to establish the starting action on the hero player and npc
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 400 },
        ],
        talking: [
          {
            required: ["TALKED_TO_ERIO"],
            events: [
              {
                type: "textMessage",
                text: "Isn't Erio the coolest?",
                faceHero: "npcA",
              },
            ],
          },
          {
            events: [
              {
                type: "textMessage",
                text: "I'm going to crush you!",
                faceHero: "npcA",
              },
            ],
          },
        ],
      }),
      npcC: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(8),
        src: "assets/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 500 },
          { type: "stand", direction: "down", time: 500 },
          { type: "stand", direction: "right", time: 500 },
          { type: "stand", direction: "up", time: 500 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: "assets/images/characters/people/erio.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Bahaha!",
                faceHero: "npcB",
              },
              { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
              //{ type: "battle", enemyId: "erio" }
            ],
          },
        ],
      }),
    },

    /**

* @param - x: x-cordinate of the wall position
* @param -y : y-cordinate of the wall position
*
*/

    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: "npcB", type: "walk", direction: "left" },
            {
              who: "npcB",
              type: "stand",
              direction: "up",
              time: 500,
            },
            { type: "textMessage", text: "You can't be in there!" },
            { who: "npcB", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "left" },
          ],
        },
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(2),
              y: utils.withGrid(2),
              direction: "down",
            },
          ],
        },
      ],
    },
  },
  Kitchen: {
    id: "Kitchen",
    lowerSrc: "assets/images/maps/KitchenLower.png",
    upperSrc: "assets/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(5),
      }),
      kitchenNpcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        direction: "up",
        src: "assets/images/characters/people/npc8.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "** They don't want to talk to you **",
              },
            ],
          },
        ],
      }),
      kitchenNpcB: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(6),
        src: "assets/images/characters/people/npc3.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "People take their jobs here very seriously.",
                faceHero: "kitchenNpcB",
              },
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "DiningRoom",
              x: utils.withGrid(7),
              y: utils.withGrid(3),
              direction: "down",
            },
          ],
        },
      ],
      [utils.asGridCoord(10, 6)]: [
        {
          disqualify: ["SEEN_INTRO"],
          events: [
            { type: "addStoryFlag", flag: "SEEN_INTRO" },
            {
              type: "textMessage",
              text: "* You are chopping ingredients on your first day as a Pizza Chef at a famed establishment in town. *",
            },
            { type: "walk", who: "kitchenNpcA", direction: "down" },
            {
              type: "stand",
              who: "kitchenNpcA",
              direction: "right",
              time: 200,
            },
            {
              type: "stand",
              who: "hero",
              direction: "left",
              time: 200,
            },
            {
              type: "textMessage",
              text: "Ahem. Is this your best work?",
            },
            {
              type: "textMessage",
              text: "These pepperonis are completely unstable! The pepper shapes are all wrong!",
            },
            {
              type: "textMessage",
              text: "Don't even get me started on the mushrooms.",
            },
            {
              type: "textMessage",
              text: "You will never make it in pizza!",
            },
            {
              type: "stand",
              who: "kitchenNpcA",
              direction: "right",
              time: 200,
            },
            { type: "walk", who: "kitchenNpcA", direction: "up" },
            {
              type: "stand",
              who: "kitchenNpcA",
              direction: "up",
              time: 300,
            },
            {
              type: "stand",
              who: "hero",
              direction: "down",
              time: 400,
            },
            {
              type: "textMessage",
              text: "* The competition is fierce! You should spend some time leveling up your Pizza lineup and skills. *",
            },
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(5),
              y: utils.withGrid(10),
              direction: "down",
            },
          ],
        },
      ],
    },
    // All the wall cordinates are calculated by using Asprite Editor
    //outputs something like this, "16,16 ":true. The walls here refers to the certain area spaces that hero character can't walk into

    walls: {
      [utils.asGridCoord(2, 4)]: true,
      [utils.asGridCoord(3, 4)]: true,
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(7, 4)]: true,
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(12, 5)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(1, 6)]: true,
      [utils.asGridCoord(1, 7)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
    },
  },

  StreetNorth: {
    id: "StreetNorth",
    lowerSrc: "assets/images/maps/StreetNorthLower.png",
    upperSrc: "assets/images/maps/StreetNorthUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(8),
      }),
      streetNorthNpcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: "assets/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 800 },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 400 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "This place is famous for veggie pizzas!",
                faceHero: "streetNorthNpcA",
              },
            ],
          },
        ],
      }),
      streetNorthNpcB: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(12),
        src: "assets/images/characters/people/npc3.png",
        behaviorLoop: [
          { type: "stand", direction: "up", time: 400 },
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "down", time: 400 },
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "right", time: 800 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I love the fresh smell of garlic in the air.",
                faceHero: "streetNorthNpcB",
              },
            ],
          },
        ],
      }),
      streetNorthNpcC: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(9),
        src: "assets/images/characters/people/npc8.png",
        talking: [
          {
            required: ["streetNorthBattle"],
            events: [
              {
                type: "textMessage",
                text: "Could you be the Legendary one?",
                faceHero: "streetNorthNpcC",
              },
            ],
          },
          {
            events: [
              {
                type: "textMessage",
                text: "This is my turf!",
                faceHero: "streetNorthNpcC",
              },
              { type: "battle", enemyId: "streetNorthBattle" },
              { type: "addStoryFlag", flag: "streetNorthBattle" },
            ],
          },
        ],
      }),
      pizzaStone: new PizzaStone({
        x: utils.withGrid(2),
        y: utils.withGrid(9),
        storyFlag: "STONE_STREET_NORTH",
        pizzas: ["v001", "f001"],
      }),
    },
    walls: {
      //outputs something like this, "16,16 ":true. The walls here refers to the certain area spaces that hero character can't walk into
      [utils.asGridCoord(2, 7)]: true,
      [utils.asGridCoord(3, 7)]: true,
      [utils.asGridCoord(3, 6)]: true,
      [utils.asGridCoord(4, 5)]: true,
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(8, 5)]: true,
      [utils.asGridCoord(9, 5)]: true,
      [utils.asGridCoord(10, 5)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(7, 8)]: true,
      [utils.asGridCoord(8, 8)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 5)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "GreenKitchen",
              x: utils.withGrid(5),
              y: utils.withGrid(12),
              direction: "up",
            },
          ],
        },
      ],
      [utils.asGridCoord(7, 16)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(25),
              y: utils.withGrid(5),
              direction: "down",
            },
          ],
        },
      ],
    },
  },
  DiningRoom: {
    id: "DiningRoom",
    lowerSrc: "assets/images/maps/DiningRoomLower.png",
    upperSrc: "assets/images/maps/DiningRoomUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(8),
      }),
      diningRoomNpcA: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(8),
        src: "assets/images/characters/people/npc8.png",
        talking: [
          {
            required: ["diningRoomBattle"],
            events: [
              {
                type: "textMessage",
                text: "Maybe I am not ready for this place.",
                faceHero: "diningRoomNpcA",
              },
            ],
          },
          {
            events: [
              {
                type: "textMessage",
                text: "You think you have what it takes to cook here?!",
                faceHero: "diningRoomNpcA",
              },
              {
                type: "battle",
                enemyId: "diningRoomBattle",
                arena: "dining-room",
              },
              { type: "addStoryFlag", flag: "diningRoomBattle" },
            ],
          },
        ],
      }),
      diningRoomNpcC: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(8),
        src: "assets/images/characters/people/npc7.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 800 },
          { type: "stand", direction: "down", time: 700 },
          { type: "stand", direction: "right", time: 800 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I was so lucky to score a reservation!",
                faceHero: "diningRoomNpcC",
              },
            ],
          },
        ],
      }),
      diningRoomNpcD: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(9),
        src: "assets/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "down", time: 900 },
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "down", time: 700 },
          { type: "stand", direction: "right", time: 400 },
          { type: "stand", direction: "up", time: 800 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I've been dreaming of this pizza for weeks!",
                faceHero: "diningRoomNpcD",
              },
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(5),
              y: utils.withGrid(10),
              direction: "up",
            },
          ],
        },
      ],
      [utils.asGridCoord(6, 12)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(5),
              y: utils.withGrid(9),
              direction: "down",
            },
          ],
        },
      ],
    },
    walls: {
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(2, 5)]: true,
      [utils.asGridCoord(3, 5)]: true,
      [utils.asGridCoord(4, 5)]: true,
      [utils.asGridCoord(4, 4)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 4)]: true,
    },
  },
};
