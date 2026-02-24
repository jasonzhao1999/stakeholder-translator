"use client";

import { FileText, Zap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Stakeholder Translator
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              AI-Powered Communication Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Zap className="w-3.5 h-3.5 text-[var(--warning)]" />
          Powered by Groq + Llama 3.3
        </div>
      </div>
    </header>
  );
}
