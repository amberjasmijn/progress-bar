export type Status = "running" | "stopped" | "idle";

export interface State {
  progress: number;
  status: Status[];
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
