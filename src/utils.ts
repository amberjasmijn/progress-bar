import { State, Status, Style } from "./types";

export const css = (element: HTMLDivElement, style: Style): void => {
  for (const property in style) {
    element.style[property] = style[property];
  }
};

export const clamp = (n: number, min: number, max: number): number => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export const toPercentage = (n: number): number => (-1 + n) * 100;

export const isRendered = (selector: string): boolean =>
  !!document.querySelector(selector);

export const increment = (state: State): number =>
  clamp(state.progress + Math.random() * 0.04, 0, 0.994);

export const removeElement = (element: HTMLElement): void => element.remove();

export const getStatus = (s: State): Status => s.status[0];

export const removeFirst = (statuses: Status[]): Status[] => statuses.slice(1);

export const nextStatus = (state: State): Status[] =>
  state.status.length > 1 ? removeFirst(state.status) : state.status;
