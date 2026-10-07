# AI Resume Tailor

Upload a job description and your resume, and an AI rewrites the resume to match the role. You can add your own instructions, preview the result, and ask for more changes in a chat until you're happy with it.

It runs entirely in the browser with **your own API key** (Anthropic Claude, OpenAI, or Google Gemini). There is no backend.

## Features

- **Job description and resume input**: upload PDF / DOCX / TXT / MD (drag and drop works), or paste text.
- **Additional instructions** with one-click quick prompts.
- **Live preview**: the resume is rendered as a document, with a Markdown source view, copy, `.md` download, and print-to-PDF.
- **Refine with AI**: a chat panel. Every request creates a new version, and you can switch between versions.
- **Job match insights**: an estimated match score and the job-description keywords your experience doesn't cover.
- **Bring your own key**: choose a provider and model in Settings. Keys are stored only in `localStorage`.
- **Every state is covered**: empty state, a "no API key" placeholder, step-by-step loading with skeletons, a revision overlay, and errors with a retry button.
- **Mobile friendly**: on small screens a bottom tab bar switches between Inputs and Resume.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Open **Settings**, pick a provider, paste your API key, and choose a model.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

## Project structure

```
src/
├── components/
│   ├── ui/          # Reusable primitives: Button, Card, Modal, Field, EmptyState, Skeleton…
│   ├── layout/      # Header, MobileTabBar
│   ├── inputs/      # DocumentInput (shared by JD + resume), FileDropzone, instructions
│   ├── results/     # ResultsPanel (state switch), preview, insights, chat, loaders
│   └── settings/    # API key / provider dialog
├── config/          # Provider registry and app constants
├── context/         # SettingsContext (persisted settings)
├── hooks/           # useResumeSession (core state), useLocalStorage, useFileText…
├── services/
│   ├── llm/         # One adapter per provider behind a single `complete()` entry point
│   ├── prompts.ts   # System prompt and message builders
│   ├── responseParser.ts
│   ├── fileParser.ts
│   └── resumeService.ts
├── types/
└── utils/
```

### Design notes

- **Provider adapters**: each provider implements the same `LlmAdapter` signature (`services/llm/types.ts`) and is lazy-loaded, so only the selected SDK is downloaded. To add a provider, write one adapter file and add it to `config/providers.ts` and `ADAPTER_LOADERS`.
- **Provider-agnostic output**: the model answers in tagged sections (`<resume>`, `<summary>`, `<match_score>`, `<missing_keywords>`). These are parsed the same way for every provider, and the parser handles truncated responses.
- **One request lifecycle**: `useResumeSession.run()` handles both the first tailoring and later revisions, including cancellation, versioning, and errors.
- **Truthfulness**: the system prompt tells the model never to invent employers, dates, degrees, or metrics.

## Security

Your API key goes straight from your browser to the provider you chose (for example `api.anthropic.com`). It is stored only in this browser's `localStorage`. Don't use the app on shared computers. If you deploy it publicly, every user must bring their own key.
