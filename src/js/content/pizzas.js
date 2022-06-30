//attach pizza types and their battle description and status to the window object
window.PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
};

window.Pizzas = {
  s001: {
    name: "Slice Samurai",
    description: "Pizza desc here",
    type: PizzaTypes.spicy,
    src: "assets/images/characters/pizzas/s001.png",
    icon: "assets/images/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"],
  },
  s002: {
    name: "Bacon Brigade",
    description: "A salty warrior who fears nothing",
    type: PizzaTypes.spicy,
    src: "assets/images/characters/pizzas/s002.png",
    icon: "assets/images/icons/spicy.png",
    actions: ["damage1", "saucyStatus", "clumsyStatus"],
  },
  v001: {
    name: "Call Me Kale",
    description: "Pizza desc here",
    type: PizzaTypes.veggie,
    src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/veggie.png",
    actions: ["damage1"],
  },
  v002: {
    name: "Archie Artichoke",
    description: "Pizza desc here",
    type: PizzaTypes.veggie,
    src: "assets/images/characters/pizzas/v001.png",
    icon: "assets/images/icons/veggie.png",
    actions: ["damage1"],
  },
  f001: {
    name: "Portobello Express",
    description: "Pizza desc here",
    type: PizzaTypes.fungi,
    src: "assets/images/characters/pizzas/f001.png",
    icon: "assets/images/icons/fungi.png",
    actions: ["damage1"],
  },
  f002: {
    name: "Say Shitake",
    description: "Pizza desc here",
    type: PizzaTypes.fungi,
    src: "assets/images/characters/pizzas/f001.png",
    icon: "assets/images/icons/fungi.png",
    actions: ["damage1"],
  },
};
