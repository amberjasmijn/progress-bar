import { State, Status, Style } from "./types";
import {
  css as setCss,
  getStatus,
  increment,
  nextStatus,
  removeElement,
  toPercentage,
} from "./utils";

const style: Style = {
  background: "grey",
  width: "100%",
  height: "2px",
  position: "fixed",
  top: "0",
  left: "0",
  transform: "translate3d(-100%,0,0)",
  transition: "all 200ms",
  zIndex: "999",
};

const config = {
  selector: ".bar",
  speed: 300,
};

/**
 *
 * @returns the initial state
 */
const initialState = (): State => ({
  progress: 0.08,
  status: ["idle"],
});

/**
 * Global state object
 */
let state = initialState();

/**
 * Instantiate an animation ID
 */
let animation;

/**
 *
 * @param state
 * @returns a CSS style object
 */
const createStyle = (progress: State["progress"]): Style => ({
  background: "grey",
  width: "100%",
  height: "2px",
  position: "fixed",
  top: "0",
  left: "0",
  transform: "translate3d(" + toPercentage(progress) + "%,0,0)",
  transition: "all 200ms ease-in",
  zIndex: "999999",
});

/**
 * Renders the HTML element and sets the initial style
 */
const renderHtml = (): void => {
  const progress = document.createElement("div");
  progress.innerHTML = '<div class="bar" role="bar"></div>';
  document.querySelector("body")?.appendChild(progress);

  const bar = document.querySelector(".bar") as HTMLDivElement;

  setCss(bar, style);
};

const updateWidth = (state: State): void | number => {
  const bar = document.querySelector(".bar") as HTMLDivElement;

  if (getStatus(state) === "stopped") {
    setCss(bar, createStyle(1));

    return setTimeout(() => {
      const container = bar.parentElement;
      if (container) {
        removeElement(container);
      }
    }, config.speed);
  }

  if (bar) {
    return setCss(bar, createStyle(state.progress));
  }
};

const next = (state: State): State => ({
  ...state,
  progress: increment(state),
  status: nextStatus(state),
});

const enqueueStatus = (state: State, status: Status): State => ({
  ...state,
  status: state.status.concat(status),
});

/**
 * Animation/loop function that renders the next state,
 * or cancels the animation in the next call
 */
const run = (t1: number) => (t2: number) => {
  if (t2 - t1 > config.speed) {
    if (getStatus(state) === "stopped") {
      window.cancelAnimationFrame(animation);
      state = initialState();
    } else {
      state = next(state);
      updateWidth(state);
      animation = window.requestAnimationFrame(run(t2));
    }
  } else {
    animation = window.requestAnimationFrame(run(t1));
  }
};

/**
 * Renders the HTML and requests an animation frame
 */
const start = (): void => {
  renderHtml();
  state = {
    ...state,
    status: ["running"],
  };
  animation = window.requestAnimationFrame(run(0));
};

const stop = (): void => {
  state = enqueueStatus(state, "stopped");
};

export { start, stop };
