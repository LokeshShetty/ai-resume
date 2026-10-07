import { describe, expect, it } from "vitest";
import { orderModels, resolveModel } from "./modelOptions";

const option = (id: string) => ({ id, label: id });

describe("orderModels", () => {
  it("puts available recommended models first and drops unavailable ones", () => {
    const available = ["new-model", "flash", "pro"].map(option);
    expect(orderModels(available, ["pro", "retired", "flash"]).map((m) => m.id)).toEqual(["pro", "flash", "new-model"]);
  });
});

describe("resolveModel", () => {
  const options = ["a", "b"].map(option);

  it("keeps the current model when it is available", () => {
    expect(resolveModel("b", options)).toBe("b");
  });

  it("replaces a retired model with the first available one", () => {
    expect(resolveModel("gemini-2.5-pro", options)).toBe("a");
  });

  it("keeps the current model when nothing is available", () => {
    expect(resolveModel("x", [])).toBe("x");
  });
});
