#

## Fullscreen

```js
GameEngine.init({
  canvas,
  settings: {
    fullscreen: true,
  },
  assets,
});
```

## Box

```js
GameEngine.init({
  canvas,
  settings: {
    size: {
      width: 800,
      height: 800,
    },
  },
  assets,
});
```

## Ported

```js
GameEngine.init({
  port: context,
  settings: {
    size: {
      width: 800,
      height: 800,
    },
  },
  assets,
}).then(() => {
  const vpt = {
    zoom: {
      value: 1,
      translation: { x: 0, y: 0 },
    },
    scrollX: 0,
    scrollY: 0,
  };

  const rotation = 0;

  GameEngine.convertCursor = (x, y) => {
    const rect = canvas.getBoundingClientRect();

    const coords = convertViewportCoordsToSceneCoords({ x, y, vpt });

    const topLeft = convertViewportCoordsToSceneCoords({
      x: rect.x,
      y: rect.y,
      vpt,
    });

    const bottomRight = convertViewportCoordsToSceneCoords({
      x: rect.right,
      y: rect.bottom,
      vpt,
    });

    const cursor = rotate(
      { x: coords.x - topLeft.x, y: coords.y - topLeft.y },
      {
        x: (bottomRight.x - topLeft.x) / 2,
        y: (bottomRight.y - topLeft.y) / 2,
      },
      -rotation
    );

    return cursor;
  };

  context.scale(window.devicePixelRatio, window.devicePixelRatio);
  context.translate(vpt.zoom.translation.x, vpt.zoom.translation.y);
  context.scale(vpt.zoom.value, vpt.zoom.value);

  const game = GameEngine.reset();
  const tick = () => {
    window.requestAnimationFrame(tick);
    game();
  };
  tick();
});
```
