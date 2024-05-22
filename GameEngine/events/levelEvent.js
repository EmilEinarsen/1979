import { createEvent } from "./createEvent.js";

const getDefault = () => ({
  level: 1,
  isReset: false,
});

export const levelEvent = createEvent("level", getDefault(), {
  onDispatch(n, p) {
    if (n.type === "progress") {
      n.level = p.level + 1;
    }

    if (n.type === "reset") {
      n.level = 1;
    }

    return true;
  },
});
