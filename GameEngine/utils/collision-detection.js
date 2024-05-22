const pythagoras = (dx, dy) => Math.sqrt(dx ** 2 + dy ** 2);

const distance = (x1, x2, y1, y2) => pythagoras(x1 - x2, y1 - y2);

const detectCirclePoint = (
  /**
   * @type {{ pos: { x: number, y: number }, radius: number }}
   */
  c1,
  /**
   * @type {{ x: number, y: number }}
   */
  p
) => distance(c1.pos.x, p.x, c1.pos.y, p.y) < c1.radius;

const detectLinePoint = (
  /**
   * @type {{ pos1: { x: number, y: number }, pos2: { x: number, y: number } }}
   */
  l,
  /**
   * @type {{ x: number, y: number }}
   */
  p
) =>
  l.length >=
  distance(l.pos1.x, p.x, l.pos1.y, p.y) +
    distance(p.x, l.pos2.x, p.y, l.pos2.y);

export const detectLineCircle = (
  /**
   * @type {{ pos1: { x: number, y: number }, pos2: { x: number, y: number } }}
   */
  l,
  /**
   * @type {{ pos: { x: number, y: number }, radius: number }}
   */
  c
) => {
  let x1 = l.pos1.x,
    y1 = l.pos1.y,
    x2 = l.pos2.x,
    y2 = l.pos2.y,
    dx = x2 - x1,
    dy = y2 - y1,
    cx = c.pos.x,
    cy = c.pos.y,
    len = distance(x1, x2, y1, y2),
    dot = ((cx - x1) * dx + (cy - y1) * dy) / (len * len),
    point = { x: x1 + dot * (x2 - x1), y: y1 + dot * (y2 - y1) };

  return detectLinePoint(l, point) && detectCirclePoint(c, point)
    ? { type: "INTERSECTING", point }
    : detectCirclePoint(c, l.pos1)
    ? { type: "INTERSECTING", point: l.pos1 }
    : detectCirclePoint(c, l.pos2)
    ? { type: "INTERSECTING", point: l.pos2 }
    : { type: "NONE" };
};
