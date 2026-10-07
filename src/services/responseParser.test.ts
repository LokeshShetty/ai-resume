import { describe, expect, it } from "vitest";
import { parseTailoredResume } from "./responseParser";

describe("parseTailoredResume", () => {
  it("extracts every tagged section", () => {
    const raw = `<resume>
# Jane Doe
- Built things
</resume>
<summary>
- Highlighted React
</summary>
<match_score>82</match_score>
<missing_keywords>Kubernetes, GraphQL , </missing_keywords>`;

    expect(parseTailoredResume(raw)).toEqual({
      resume: "# Jane Doe\n- Built things",
      summary: "- Highlighted React",
      matchScore: 82,
      missingKeywords: ["Kubernetes", "GraphQL"],
    });
  });

  it("falls back to the raw text when tags are missing", () => {
    const result = parseTailoredResume("  # Plain resume  ");
    expect(result.resume).toBe("# Plain resume");
    expect(result.summary).toBe("");
    expect(result.matchScore).toBeNull();
    expect(result.missingKeywords).toEqual([]);
  });

  it("handles a truncated response without a closing tag", () => {
    expect(parseTailoredResume("<resume># Cut off").resume).toBe("# Cut off");
  });

  it("clamps the score to 0-100 and ignores non-numbers", () => {
    expect(parseTailoredResume("<match_score>140</match_score>").matchScore).toBe(100);
    expect(parseTailoredResume("<match_score>n/a</match_score>").matchScore).toBeNull();
  });
});
