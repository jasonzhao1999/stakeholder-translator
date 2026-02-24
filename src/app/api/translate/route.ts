import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { buildTranslationPrompt } from "@/lib/prompts";
import { AUDIENCE_PROFILES, AudienceVersion } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { document, audienceIds } = await request.json();

    if (!document || !audienceIds || audienceIds.length === 0) {
      return NextResponse.json(
        { error: "Document and at least one audience are required" },
        { status: 400 }
      );
    }

    if (document.length > 10000) {
      return NextResponse.json(
        { error: "Document is too long. Please keep it under 10,000 characters." },
        { status: 400 }
      );
    }

    const selectedAudiences = AUDIENCE_PROFILES.filter((a) =>
      audienceIds.includes(a.id)
    );
    const audienceNames = selectedAudiences.map((a) => a.name);

    // Generate all versions in parallel
    const versionPromises = selectedAudiences.map(async (audience) => {
      const prompt = buildTranslationPrompt(document, audience, audienceNames);
      const raw = await callGroq(prompt);

      try {
        const parsed = JSON.parse(raw);
        return {
          audienceId: audience.id,
          content: parsed.content || "",
          tone: parsed.tone || "Neutral",
          wordCount: (parsed.content || "").split(/\s+/).length,
          transformations: parsed.transformations || [],
          risks: parsed.risks || {
            legal: { level: "low", note: "Not assessed" },
            reputational: { level: "low", note: "Not assessed" },
            accuracy: { level: "low", note: "Not assessed" },
          },
          flags: parsed.flags || [],
        } as AudienceVersion;
      } catch {
        return {
          audienceId: audience.id,
          content: raw,
          tone: "Unknown",
          wordCount: raw.split(/\s+/).length,
          transformations: [],
          risks: {
            legal: { level: "low" as const, note: "Parse error" },
            reputational: { level: "low" as const, note: "Parse error" },
            accuracy: { level: "high" as const, note: "Response could not be parsed" },
          },
          flags: [
            {
              text: "Response parsing failed",
              reason: "The AI response could not be parsed into structured data. Review the raw content.",
              severity: "warning" as const,
            },
          ],
        } as AudienceVersion;
      }
    });

    const versions = await Promise.all(versionPromises);

    const totalFlags = versions.reduce((sum, v) => sum + v.flags.length, 0);
    const criticalFlags = versions.reduce(
      (sum, v) => sum + v.flags.filter((f) => f.severity === "critical").length,
      0
    );

    return NextResponse.json({
      versions,
      summary: {
        originalWordCount: document.split(/\s+/).length,
        audienceCount: versions.length,
        totalFlags,
        criticalFlags,
      },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to generate translations. Please try again." },
      { status: 500 }
    );
  }
}
