import { Optional, Status, Style } from "./types";
import {
  addCssToElement,
  increment,
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

const defaultSettings: Settings = {
  dribble: true,
  dribbleSpeed: 0.02,
  easing: "ease",
  minimum: 0.08,
  parent: "body",
  selector: ".bar",
  speed: 600,
  template: '<div class="bar" role="bar"></div>',
};

const createStyle = (progress: State["progress"]): Style => ({
  ...style,
  transform: "translate3d(" + toPercentage(progress) + "%,0,0)",
});

interface Settings {
  speed: number;
  minimum: number;
  easing: string;
  dribble: boolean;
  dribbleSpeed: number;
  selector: string;
  parent: string;
  template: string;
}

export interface State {
  progress: number;
  status: Status;
}

class Progress {
  private animation: number | undefined;
  private state: State;
  settings: Settings;

  constructor({
    dribble,
    dribbleSpeed,
    easing,
    minimum,
    parent,
    selector,
    speed,
    template,
  }: Settings) {
    this.state = Progress.initialState;
    this.settings = {
      dribble,
      dribbleSpeed,
      easing,
      minimum,
      parent,
      selector,
      speed,
      template,
    };
  }

  static initialState: State = {
    progress: 0.08,
    status: Status.Start,
  };

  private renderProgressBar = (): void => {
    const { selector, parent, template } = this.settings;
    const progress = document.createElement("div");
    progress.innerHTML = template;
    document.querySelector(parent)?.appendChild(progress);

    const element = document.querySelector(selector) as HTMLDivElement | null;

    if (!element) {
      throw Error("Element not found in DOM");
    }

    addCssToElement(element, style);
  };

  private updateProgressBar = ({ status, progress }: State): void | number => {
    const { selector, speed } = this.settings;
    const element = document.querySelector(selector) as HTMLDivElement | null;

    if (!element) {
      throw Error("Element not found in DOM");
    }

    if (status === Status.Stopping) {
      addCssToElement(element, createStyle(1));

      return setTimeout(() => {
        const container = element?.parentElement;
        if (container) {
          removeElement(container);
        }
      }, speed);
    }

    addCssToElement(element, createStyle(progress));
  };

  private nextState = (state: State): State => ({
    ...state,
    progress: increment(state, this.settings.dribbleSpeed),
  });

  private loop = (t1: number) => (t2: number) => {
    if (t2 - t1 > this.settings.speed) {
      if (this.state.status === Status.Stopping) {
        this.updateProgressBar(this.state);
        this.state = {
          ...this.state,
          status: Status.Stopped,
        };

        return (this.animation = window.requestAnimationFrame(this.loop(t2)));
      }

      if (this.state.status === Status.Stopped) {
        if (!this.animation) {
          throw Error("Animation is already canceled");
        }
        window.cancelAnimationFrame(this.animation);
        return (this.state = Progress.initialState);
      }

      if (
        this.state.status === Status.Start ||
        this.state.status === Status.Running
      ) {
        this.state = this.nextState(this.state);
        this.updateProgressBar(this.state);
        return (this.animation = window.requestAnimationFrame(this.loop(t2)));
      }
    } else {
      return (this.animation = window.requestAnimationFrame(this.loop(t1)));
    }
  };

  public start = (): void => {
    this.renderProgressBar();
    this.state = {
      ...this.state,
      status: Status.Running,
    };
    this.animation = window.requestAnimationFrame(this.loop(0));
  };

  public stop = (): void => {
    this.state = {
      ...this.state,
      status: Status.Stopping,
    };
  };
}

export function createProgressBar(settings?: Optional<Settings>): Progress {
  return new Progress({ ...defaultSettings, ...settings });
}
