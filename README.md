# Smart Study Assistant

AI-powered study companion that generates concise summaries, quizzes, and study tips for any topic in seconds.
## Features

- **Topic lookup** via Wikipedia summary API with fuzzy fallback.
- **Gemini-generated** study guides: three summary bullets, three MCQs with answers/explanations, and a tailored study tip.
- **Math/logic mode** adds a quantitative challenge question with solution.
- **Topic history** stored locally for quick reuse.
- **Dark/light mode** toggle with system preference detection.

## Getting Started

### Prerequisites

- Node.js 20+
- npm (bundled with Node)
- Google Gemini API key ([get one here](https://ai.google.dev/))

### Backend (API)

```bash
cd backend
cp .env.example .env

npm install
npm run dev
```

Key environment variables:

| Variable        | Description                              |
|-----------------|------------------------------------------|
| `GEMINI_API_KEY` | Google AI Studio API key                 |
| `GEMINI_MODEL`  | Gemini model name (defaults to `gemini-2.5-flash`) |
| `PORT`          | Port for the Express server (defaults to `4000`) |

Endpoints:

- `GET /health` – readiness probe
- `GET /study?topic=<string>&mode=<default|math>` – main study generator

### Frontend (Web App)

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

### Monorepo Scripts

Run backend and frontend simultaneously (two terminals):

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```
## Testing the API Locally

```bash
curl "http://localhost:4000/study?topic=diffusion&mode=math"
```

Expected response (truncated):

```json
{
  "topic": "Diffusion",
  "summary": ["...", "...", "..."],
  "quiz": [
    {
      "question": "…",
      "options": ["…"],
      "answer": "…",
      "explanation": "…"
    },
    "..."
  ],
  "studyTip": "...",
  "mathChallenge": {
    "question": "...",
    "answer": "...",
    "explanation": "..."
  }
}
```

## Project Structure

```
backend/
  src/server.js         
  logic
  package.json
  .env.example
frontend/
  src/
    App.tsx            
    App.css
    index.css
    main.tsx
  vite.config.ts
  package.json
  .env.example
README.md              
```