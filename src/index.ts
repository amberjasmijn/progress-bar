import { defaultSettings } from "./defaults";
import { Progress, Settings } from "./Progress";
import { Optional } from "./types";

export function createProgressBar(settings?: Optional<Settings>): Progress {
  return new Progress({ ...defaultSettings, ...settings });
}
