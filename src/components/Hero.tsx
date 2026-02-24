"use client";

import { ArrowDown, FileText, GitCompare, Eye, Shield } from "lucide-react";

export function Hero() {
  return (
    <div className="text-center py-16 space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
        AI-Powered Communication Intelligence
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
        One document.
        <br />
        <span className="text-[var(--primary)]">Every stakeholder.</span>
        <br />
        Full transparency.
      </h1>

      <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
        Transform any internal document into audience-specific communications
        in seconds. See exactly what changed, why it changed, and what needs
        human review before it goes out.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--primary)]" />
          Audience-aware rewriting
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[var(--accent)]" />
          Full audit trail
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--warning)]" />
          Risk assessment
        </div>
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[var(--success)]" />
          Consistency check
        </div>
      </div>

      <div className="pt-4">
        <ArrowDown className="w-5 h-5 mx-auto text-[var(--muted-foreground)] animate-bounce" />
      </div>
    </div>
  );
}
