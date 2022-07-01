// IIF this fires up the game loop present in overworld
(function () {
  const overworld = new Overworld({
    element: document.querySelector(".game-container"),
  });
  overworld.init();
})();
