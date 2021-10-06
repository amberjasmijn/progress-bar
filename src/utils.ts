import { Settings } from "./Progress";
import { Optional, State, Style } from "./types";

export const addCssToElement = (
  element: HTMLElement,
  style: Optional<Style>
): void => {
  for (const property in style) {
    element.style[property] = style[property];
  }
};

const clamp = (n: number, min: number, max: number): number =>
  n < min ? min : n > max ? max : n;

export const toPercentage = (n: number): number => (-1 + n) * 100;

export const increment = (
  state: State,
  dribbleSpeed: Settings["dribbleSpeed"]
): number => clamp(state.progress + Math.random() * dribbleSpeed, 0, 0.994);

export const removeElement = (element: HTMLElement): void => element.remove();

export function getElement(selector: string): HTMLElement {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw Error("Element not found in DOM");
  }
  return element;
}
