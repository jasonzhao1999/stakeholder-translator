import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { buildConsistencyPrompt } from "@/lib/prompts";
import { AUDIENCE_PROFILES } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { versions } = await request.json();

    if (!versions || versions.length < 2) {
      return NextResponse.json(
        { error: "At least two versions are needed for consistency check" },
        { status: 400 }
      );
    }

    const versionData = versions.map(
      (v: { audienceId: string; content: string }) => ({
        audience:
          AUDIENCE_PROFILES.find((a) => a.id === v.audienceId)?.name ||
          v.audienceId,
        content: v.content,
      })
    );

    const prompt = buildConsistencyPrompt(versionData);
    const raw = await callGroq(prompt);

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ issues: parsed.issues || [] });
    } catch {
      return NextResponse.json({ issues: [] });
    }
  } catch (error) {
    console.error("Consistency check error:", error);
    return NextResponse.json(
      { error: "Failed to run consistency check." },
      { status: 500 }
    );
  }
}
