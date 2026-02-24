"use client";

import { AUDIENCE_PROFILES, AudienceProfile } from "@/lib/types";
import { Check } from "lucide-react";

interface AudienceSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function AudienceSelector({ selected, onToggle }: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--foreground)]">
        Select Target Audiences
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AUDIENCE_PROFILES.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            isSelected={selected.includes(audience.id)}
            onToggle={() => onToggle(audience.id)}
          />
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-[var(--destructive)]">
          Select at least one audience
        </p>
      )}
    </div>
  );
}

function AudienceCard({
  audience,
  isSelected,
  onToggle,
}: {
  audience: AudienceProfile;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "border-[var(--primary)] bg-[var(--primary)]/10"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{audience.icon}</span>
        <span className="text-sm font-medium">{audience.name}</span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
        {audience.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {audience.careAbout.slice(0, 3).map((item) => (
          <span
            key={item}
            className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
          >
            {item}
          </span>
        ))}
      </div>
    </button>
  );
}
