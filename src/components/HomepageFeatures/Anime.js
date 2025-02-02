// Anime.js animations for visual effects
anime({
  targets: ".planet.small",
  left: ["1", "20%"],
  translateY: "-5vmin",
  rotate: "10deg",
  duration: 6000,
  easing: "easeInOutCubic",
});

anime({
  targets: ".planet.mid",
  translateX: "-10vmin",
  translateY: "-5vmin",
  rotate: "15deg",
  easing: "easeInOutCubic",
  duration: 6000,
});

// Bomb animation timeline for additional effects
const bomb = anime.timeline({
  duration: 3000,
});

bomb
  .add({
    targets: ".left .one, .left .two, .left .three",
    translateY: ["10px", "0px"],
    translateX: ["10px", "0px"],
    duration: 1000,
    delay: (el, i) => i * 100,
    offset: 0,
  })
  .add({
    targets: ".right .one, .right .two, .right .three",
    translateY: ["10px", "0px"],
    translateX: ["-10px", "0px"],
    duration: 1000,
    delay: (el, i) => i * 100,
    offset: 0,
  })
  .add({
    targets: ".stem",
    scale: [0.7, 1],
    offset: 0,
    translateY: ["10px", "0"],
    easing: "easeOutCubic",
  })
  .add({
    targets: ".mushroom",
    scaleX: [0.5, 1],
    scaleY: [0.5, 1],
    easing: "easeOutCubic",
    offset: 0,
  })
  .add({
    targets: ".ring",
    scaleX: [1, 4],
    translateY: ["10px", "-10px"],
    easing: "easeOutCubic",
    offset: 0,
  });
