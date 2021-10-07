import { Settings } from "./progress";
import { Style } from "./types";

export const defaultStyle: Style = {
  background: "grey",
  width: "100%",
  height: "2px",
  position: "fixed",
  top: "0",
  left: "0",
  transform: "translate3d(-100%, 0, 0)",
  transition: "all 200ms ease",
  zIndex: "999",
};

export const defaultSettings: Settings = {
  dribble: true,
  dribbleSpeed: 0.02,
  easing: "ease",
  minimum: 0.08,
  parent: "body",
  selector: ".bar",
  speed: 600,
  template: '<div class="bar" role="bar"></div>',
  style: defaultStyle,
};
