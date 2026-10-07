import type { LlmMessage } from "./llm";

const RESPONSE_FORMAT = `Respond using exactly these XML-style sections and nothing else:

<resume>
The complete resume in GitHub-flavored Markdown. Use "# Full Name" for the name,
a single line of contact details, "## Section" headings, "### Role — Company" for
positions, and "-" bullet points.
</resume>
<summary>
A short Markdown bullet list explaining the most important changes you made and why.
</summary>
<match_score>
An integer from 0 to 100 estimating how well the resume now matches the job description.
</match_score>
<missing_keywords>
A comma-separated list of important job-description keywords the candidate's real
experience does not cover (leave empty if none).
</missing_keywords>`;

export const SYSTEM_PROMPT = `You are an expert resume writer and career coach who tailors resumes to specific job descriptions.

Guidelines:
- Stay truthful: never invent employers, titles, dates, degrees, certifications, or metrics that are not supported by the original resume.
- Reorder, rephrase, and emphasize existing experience so the most relevant qualifications stand out.
- Mirror the job description's terminology where the candidate genuinely has that experience, so the resume passes applicant tracking systems.
- Prefer strong action verbs and concise, results-oriented bullet points.
- Keep formatting clean and ATS-friendly: no tables, columns, images, or emojis.
- Follow any additional instructions from the user unless they conflict with truthfulness.

${RESPONSE_FORMAT}`;

const section = (tag: string, body: string) => `<${tag}>\n${body.trim()}\n</${tag}>`;

export function buildTailorMessage(params: {
  jobDescription: string;
  resume: string;
  instructions?: string;
}): LlmMessage {
  const parts = [
    "Tailor my resume to the following job description.",
    section("job_description", params.jobDescription),
    section("original_resume", params.resume),
  ];
  if (params.instructions?.trim()) {
    parts.push(section("additional_instructions", params.instructions));
  }
  return { role: "user", content: parts.join("\n\n") };
}

/** Includes the resume being revised so users can branch from any earlier version. */
export function buildRevisionMessage(params: { feedback: string; currentResume: string }): LlmMessage {
  return {
    role: "user",
    content: [
      "Revise the resume below based on my feedback.",
      "Return the full updated resume in the same response format.",
      section("current_resume", params.currentResume),
      section("feedback", params.feedback),
    ].join("\n\n"),
  };
}
