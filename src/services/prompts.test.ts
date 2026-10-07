import { describe, expect, it } from "vitest";
import { buildRevisionMessage, buildTailorMessage } from "./prompts";

describe("buildTailorMessage", () => {
  it("wraps inputs in tagged sections", () => {
    const { role, content } = buildTailorMessage({ jobDescription: "JD", resume: "CV" });
    expect(role).toBe("user");
    expect(content).toContain("<job_description>\nJD\n</job_description>");
    expect(content).toContain("<original_resume>\nCV\n</original_resume>");
    expect(content).not.toContain("additional_instructions");
  });

  it("includes instructions only when provided", () => {
    const { content } = buildTailorMessage({ jobDescription: "JD", resume: "CV", instructions: " One page " });
    expect(content).toContain("<additional_instructions>\nOne page\n</additional_instructions>");
  });
});

describe("buildRevisionMessage", () => {
  it("includes the resume being revised and the feedback", () => {
    const { content } = buildRevisionMessage({ feedback: "Shorter", currentResume: "# Jane" });
    expect(content).toContain("<current_resume>\n# Jane\n</current_resume>");
    expect(content).toContain("<feedback>\nShorter\n</feedback>");
  });
});
