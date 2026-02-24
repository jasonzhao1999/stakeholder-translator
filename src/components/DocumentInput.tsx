"use client";

import { SAMPLE_DOCUMENTS } from "@/lib/sample-documents";
import { FileText } from "lucide-react";

interface DocumentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DocumentInput({ value, onChange }: DocumentInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Source Document
        </label>
        <span className="text-xs text-[var(--muted-foreground)]">
          {value.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your technical document, post-mortem, product spec, policy change, or any internal document here..."
        className="w-full h-64 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] resize-none focus:outline-none focus:border-[var(--primary)] transition-colors"
      />

      <div className="space-y-2">
        <p className="text-xs text-[var(--muted-foreground)]">
          Or try a sample document:
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_DOCUMENTS.map((doc) => (
            <button
              key={doc.title}
              onClick={() => onChange(doc.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/50 transition-all"
            >
              <FileText className="w-3 h-3" />
              {doc.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
