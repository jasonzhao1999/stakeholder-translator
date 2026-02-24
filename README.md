# Stakeholder Translator

Transforms internal documents into audience-specific communications with full transparency — audit trails, risk assessment, and cross-version consistency checking.

Paste a document (post-mortem, product spec, policy change, incident report), select your target audiences, and get tailored versions for each — with a full breakdown of what was changed, why, and what needs human approval before sending.

## Features

- **Audience-aware rewriting** — generates tailored versions for executives, engineering, customers, legal, and media
- **Transformation audit trail** — every change is tracked (preserved, simplified, omitted, added, reframed) with reasoning
- **Risk assessment** — each version is scored for legal, reputational, and accuracy risk
- **Human review flags** — the AI flags specific phrases or claims that need human verification before sending
- **Cross-version consistency check** — detects contradictions or inconsistencies between audience versions

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **AI:** Groq API (Llama 3.3 70B)
- **Deployment:** Vercel

## Getting Started

```bash
git clone https://github.com/jasonzhao1999/stakeholder-translator.git
cd stakeholder-translator
npm install
```

Create a `.env.local` file:

```
GROQ_API_KEY=your_groq_api_key
```

Get a free API key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. User pastes a source document
2. Selects target audiences (executive, engineering, customer, legal, media)
3. The system makes parallel API calls — one per audience — each generating a tailored version with structured transformation data
4. A separate consistency check compares all versions for contradictions
5. Results are displayed with audience tabs, audit trails, risk panels, and human review flags
