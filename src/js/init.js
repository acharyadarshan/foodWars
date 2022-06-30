// IIF this fires up the game loop preseent in overworld
(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
  });
  overworld.init();
})();
