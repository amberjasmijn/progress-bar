export enum Status {
  Start = "start",
  Running = "running",
  Stopping = "stopping",
  Stopped = "stopped",
}

export interface State {
  progress: number;
  status: Status;
}

export type Style = Pick<
  CSSStyleDeclaration,
  | "background"
  | "width"
  | "height"
  | "position"
  | "top"
  | "left"
  | "transform"
  | "transition"
  | "zIndex"
>;

export type Optional<T> = {
  [P in keyof T]?: T[P];
};
