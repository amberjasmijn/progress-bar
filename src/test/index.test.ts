import { Progress } from "..";

describe("Progress", () => {
  let instance: Progress;
  beforeEach(() => {
    instance = new Progress({});
  });

  it("should be an instance of Progress", async () => {
    expect(instance).toBeInstanceOf(Progress);
  });

  it("should add a div with a selector to the body", () => {
    instance.start();
    const progressBar = document.querySelector(".bar");
    expect(progressBar).not.toBeNull();
  });

  it("should add a div with a selector to the body", () => {
    instance.start();
    const progressBar = document.querySelector(".bar");
    expect(progressBar).not.toBeNull();
  });

  it.todo("should stop and remove the progress bar");

  it.todo("should set the background of the element");
});
