import { AudienceProfile } from "./types";

export function buildTranslationPrompt(
  document: string,
  audience: AudienceProfile,
  allAudiences: string[]
): string {
  return `You are an expert communications strategist. Your job is to transform a source document into a version tailored for a specific audience, while maintaining full transparency about what you changed and why.

SOURCE DOCUMENT:
---
${document}
---

TARGET AUDIENCE: ${audience.name}
- They care about: ${audience.careAbout.join(", ")}
- Context level: ${audience.contextLevel}
- They will use this to: ${audience.purpose}

OTHER AUDIENCES RECEIVING VERSIONS: ${allAudiences.filter((a) => a !== audience.name).join(", ")}

INSTRUCTIONS:
1. Rewrite the source document for this specific audience. Adapt the language, detail level, framing, and emphasis. This should read as a polished, ready-to-send communication — not a summary.
2. Track every significant transformation you make.
3. Flag anything that a human should review before sending.
4. Assess the risks of this version.

You MUST respond with valid JSON matching this exact structure (no markdown, no code blocks, just raw JSON):

{
  "content": "The full rewritten document for this audience. Use paragraphs. Make it feel like a real communication, not a bullet list.",
  "tone": "A 2-3 word description of the tone used (e.g., 'Direct and reassuring', 'Technically precise')",
  "transformations": [
    {
      "type": "preserved | simplified | omitted | added | reframed",
      "original": "The original text or concept (null if type is 'added')",
      "transformed": "What it became (null if type is 'omitted')",
      "reason": "Why this change was made for this audience"
    }
  ],
  "risks": {
    "legal": {
      "level": "low | medium | high",
      "note": "Brief explanation of legal risk in this version"
    },
    "reputational": {
      "level": "low | medium | high",
      "note": "Brief explanation of reputational risk"
    },
    "accuracy": {
      "level": "low | medium | high",
      "note": "How much was simplified/omitted — higher omission = higher risk of misleading"
    }
  },
  "flags": [
    {
      "text": "The specific phrase or claim that needs review",
      "reason": "Why a human should verify this before sending",
      "severity": "info | warning | critical"
    }
  ]
}

GUIDELINES:
- Be specific in transformations. Don't say "simplified technical details" — say which details and how.
- For "omitted" items, always explain what risk the omission creates.
- For "added" items, explain why this audience needs information not in the original.
- Flags should be actionable. "Legal should verify X" is good. "This might be risky" is not.
- The rewritten content should be 150-400 words. Professional and polished.
- Do NOT wrap the response in markdown code blocks. Return ONLY the raw JSON object.`;
}

export function buildConsistencyPrompt(
  versions: { audience: string; content: string }[]
): string {
  const versionTexts = versions
    .map((v) => `--- VERSION FOR: ${v.audience} ---\n${v.content}`)
    .join("\n\n");

  return `You are a communications quality assurance specialist. You've been given multiple versions of the same source document, each tailored for a different audience. Your job is to check for consistency issues.

${versionTexts}

Check for:
1. CONTRADICTIONS: Do any two versions make claims that directly conflict?
2. INCONSISTENCIES: Do versions present the same fact differently in ways that could cause confusion if audiences compare notes?
3. MISSING CONTEXT: Does any version omit something so critical that the audience would be misled?

Respond with valid JSON (no markdown, no code blocks, just raw JSON):

{
  "issues": [
    {
      "type": "contradiction | inconsistency | missing_context",
      "audiences": ["audience1", "audience2"],
      "description": "Clear description of the issue",
      "recommendation": "What should be done to resolve this"
    }
  ]
}

If there are no issues, return: {"issues": []}
Be specific and actionable. Only flag real issues, not minor wording differences.
Do NOT wrap the response in markdown code blocks. Return ONLY the raw JSON object.`;
}
