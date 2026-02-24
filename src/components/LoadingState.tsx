"use client";

import { useEffect, useState } from "react";
import { Brain, FileCheck, GitCompare, Shield } from "lucide-react";

const STAGES = [
  { icon: Brain, label: "Analyzing source document...", sublabel: "Identifying key claims, data, and tone" },
  { icon: FileCheck, label: "Generating audience versions...", sublabel: "Adapting content for each stakeholder" },
  { icon: Shield, label: "Assessing risks and flags...", sublabel: "Checking for legal, reputational, and accuracy risks" },
  { icon: GitCompare, label: "Running consistency check...", sublabel: "Cross-referencing versions for contradictions" },
];

export function LoadingState({ audienceCount }: { audienceCount: number }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto py-20 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center">
          <Brain className="w-8 h-8 text-[var(--primary)] animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold">Translating for {audienceCount} audiences</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          This typically takes 10-20 seconds
        </p>
      </div>

      <div className="space-y-4">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === stage;
          const isDone = i < stage;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                isActive
                  ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30"
                  : isDone
                  ? "opacity-50"
                  : "opacity-20"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : isDone
                    ? "bg-[var(--success)]/20 text-[var(--success)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${isActive ? "text-[var(--foreground)]" : ""}`}>
                  {isDone ? "✓ " : ""}
                  {s.label}
                </p>
                {isActive && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {s.sublabel}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
