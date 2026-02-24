"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DocumentInput } from "@/components/DocumentInput";
import { AudienceSelector } from "@/components/AudienceSelector";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AudienceVersion, ConsistencyIssue } from "@/lib/types";
import { Sparkles } from "lucide-react";

type AppState = "input" | "loading" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [document, setDocument] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([
    "executive",
    "engineering",
    "customer",
  ]);
  const [versions, setVersions] = useState<AudienceVersion[]>([]);
  const [consistency, setConsistency] = useState<ConsistencyIssue[]>([]);
  const [summary, setSummary] = useState({
    originalWordCount: 0,
    audienceCount: 0,
    totalFlags: 0,
    criticalFlags: 0,
  });
  const [error, setError] = useState("");

  const toggleAudience = (id: string) => {
    setSelectedAudiences((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleTranslate = async () => {
    if (!document.trim() || selectedAudiences.length === 0) return;

    setError("");
    setState("loading");

    try {
      // Generate translations
      const translateRes = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: document.trim(),
          audienceIds: selectedAudiences,
        }),
      });

      if (!translateRes.ok) {
        const errData = await translateRes.json();
        throw new Error(errData.error || "Translation failed");
      }

      const translateData = await translateRes.json();
      setVersions(translateData.versions);
      setSummary(translateData.summary);

      // Run consistency check if 2+ versions
      if (translateData.versions.length >= 2) {
        try {
          const consistencyRes = await fetch("/api/consistency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              versions: translateData.versions.map(
                (v: AudienceVersion) => ({
                  audienceId: v.audienceId,
                  content: v.content,
                })
              ),
            }),
          });

          if (consistencyRes.ok) {
            const consistencyData = await consistencyRes.json();
            setConsistency(consistencyData.issues || []);
          }
        } catch {
          // Consistency check is non-critical
          setConsistency([]);
        }
      }

      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("input");
    }
  };

  const handleReset = () => {
    setState("input");
    setVersions([]);
    setConsistency([]);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pb-20">
        {state === "input" && (
          <>
            <Hero />

            <div className="max-w-4xl mx-auto space-y-8">
              <DocumentInput value={document} onChange={setDocument} />
              <AudienceSelector
                selected={selectedAudiences}
                onToggle={toggleAudience}
              />

              {error && (
                <div className="p-4 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-sm text-[var(--destructive)]">
                  {error}
                </div>
              )}

              <button
                onClick={handleTranslate}
                disabled={!document.trim() || selectedAudiences.length === 0}
                className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Translate for {selectedAudiences.length} Audience
                {selectedAudiences.length !== 1 ? "s" : ""}
              </button>

              {/* How It Works */}
              <div className="pt-8 border-t border-[var(--border)]">
                <h3 className="text-sm font-semibold text-center mb-6 text-[var(--muted-foreground)]">
                  HOW IT WORKS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Paste Your Document",
                      desc: "Any internal document — post-mortems, specs, policy changes, security reports.",
                    },
                    {
                      step: "02",
                      title: "Choose Your Audiences",
                      desc: "Select who needs to receive a version. Each gets tailored content and framing.",
                    },
                    {
                      step: "03",
                      title: "Review With Transparency",
                      desc: "See every change made, why it was made, what was omitted, and what needs human approval.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="text-center space-y-2">
                      <div className="text-2xl font-bold text-[var(--primary)]/30">
                        {item.step}
                      </div>
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {state === "loading" && (
          <LoadingState audienceCount={selectedAudiences.length} />
        )}

        {state === "results" && (
          <div className="pt-8">
            <ResultsDashboard
              versions={versions}
              consistency={consistency}
              summary={summary}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <p>
            Stakeholder Translator — AI decides how to communicate, humans
            decide what to approve.
          </p>
          <p>
            The AI never sends communications. A human always reviews and
            approves.
          </p>
        </div>
      </footer>
    </div>
  );
}
