import { Optional, Status, Style } from "./types";
import {
  addCssToElement,
  getElement,
  increment,
  removeElement,
  toPercentage,
} from "./utils";

const defaultStyle: Style = {
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

/**
 * Configurable settings of the progress bar.
 */
export interface Settings {
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
  /**
   * Number between 0 and 1
   */
  progress: number;
  /**
   * State of the progress bar: start, running, stopping, stopped.
   */
  status: Status;
}

/**
 * Creates a progress bar, that can be used by using the start and stop method.
 */
class Progress {
  private _settings: Settings;
  private _animation: number | undefined;
  private _state: State;

  constructor(settings: Settings) {
    this._settings = settings;
    this._state = {
      progress: settings.minimum,
      status: Status.Start,
    };
  }

  private initialState = (): State => ({
    progress: this._settings.minimum,
    status: Status.Start,
  });

  private setCssTransform = (
    progress: State["progress"],
    style: Style
  ): Style => ({
    ...style,
    transform: "translate3d(" + toPercentage(progress) + "%, 0, 0)",
  });

  private setState = (state: State, next?: Status): State => ({
    status: next || state.status,
    progress: increment(state, this._settings.dribbleSpeed),
  });

  private renderProgressBar = (): void => {
    const { selector, parent, template } = this._settings;

    // Create a container for the progress bar
    const container = document.createElement("div");

    // Set the innerHTML of the container with the specified template
    container.innerHTML = template;

    // Add the created element to the specified parent container
    document.querySelector(parent)?.appendChild(container);

    // Select the created progress bar and add the initial style object to it
    const progressBar = getElement(selector);
    addCssToElement(progressBar, defaultStyle);
  };

  private updateProgressBar = (state: State): void | number => {
    const { selector, speed } = this._settings;

    // Select the created progress bar and add the initial style object to it
    const progressBar = getElement(selector);

    // Fill out the progress bar before removing
    if (state.status === Status.Stopping) {
      addCssToElement(progressBar, this.setCssTransform(1, defaultStyle));

      return setTimeout(() => {
        const container = progressBar?.parentElement;
        if (container) {
          removeElement(container);
        }
      }, speed);
    }

    // Update the CSS of the progress bar with update progress (between 0 and 1)
    addCssToElement(
      progressBar,
      this.setCssTransform(state.progress, defaultStyle)
    );
  };

  private loop = (t1: number) => (t2: number) => {
    const { status } = this._state;
    const { speed } = this._settings;

    if (t2 - t1 > speed) {
      if (status === Status.Stopping) {
        this.updateProgressBar(this._state);
        this._state = this.setState(this._state, Status.Stopped);
      }

      if (status === Status.Stopped) {
        if (!this._animation) {
          throw Error("Animation is already canceled");
        }
        this._state = this.initialState();
        return window.cancelAnimationFrame(this._animation);
      }

      if (status === Status.Start || status === Status.Running) {
        this._state = this.setState(this._state);
        this.updateProgressBar(this._state);
      }

      return (this._animation = window.requestAnimationFrame(this.loop(t2)));
    } else {
      return (this._animation = window.requestAnimationFrame(this.loop(t1)));
    }
  };

  public start = (): void => {
    this.renderProgressBar();
    this._state = this.setState(this._state, Status.Running);
    this._animation = window.requestAnimationFrame(this.loop(0));
  };

  public stop = (): void => {
    this._state = this.setState(this._state, Status.Stopping);
  };
}

export function createProgressBar(settings?: Optional<Settings>): Progress {
  return new Progress({ ...defaultSettings, ...settings });
}
