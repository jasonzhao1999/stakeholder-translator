"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  FileWarning,
  GitCompare,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  AudienceVersion,
  AUDIENCE_PROFILES,
  ConsistencyIssue,
  TransformationItem,
  HumanReviewFlag,
  RiskAssessment,
} from "@/lib/types";

interface ResultsDashboardProps {
  versions: AudienceVersion[];
  consistency: ConsistencyIssue[];
  summary: {
    originalWordCount: number;
    audienceCount: number;
    totalFlags: number;
    criticalFlags: number;
  };
  onReset: () => void;
}

export function ResultsDashboard({
  versions,
  consistency,
  summary,
  onReset,
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState(versions[0]?.audienceId || "");
  const [showAudit, setShowAudit] = useState(false);

  const activeVersion = versions.find((v) => v.audienceId === activeTab);
  const activeAudience = AUDIENCE_PROFILES.find((a) => a.id === activeTab);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New Translation
        </button>
        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span>{summary.originalWordCount} words analyzed</span>
          <span>{summary.audienceCount} versions generated</span>
          {summary.criticalFlags > 0 ? (
            <span className="flex items-center gap-1 text-[var(--destructive)]">
              <ShieldAlert className="w-3.5 h-3.5" />
              {summary.criticalFlags} critical flag{summary.criticalFlags > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[var(--success)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              No critical flags
            </span>
          )}
        </div>
      </div>

      {/* Audience Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {versions.map((version) => {
          const audience = AUDIENCE_PROFILES.find(
            (a) => a.id === version.audienceId
          );
          if (!audience) return null;
          const isActive = activeTab === version.audienceId;
          const hasCritical = version.flags.some(
            (f) => f.severity === "critical"
          );

          return (
            <button
              key={version.audienceId}
              onClick={() => setActiveTab(version.audienceId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{audience.icon}</span>
              {audience.name}
              {hasCritical && (
                <span className="w-2 h-2 rounded-full bg-[var(--destructive)]" />
              )}
              {version.flags.length > 0 && !hasCritical && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--warning)]/20 text-[var(--warning)]">
                  {version.flags.length}
                </span>
              )}
            </button>
          );
        })}

        {/* Consistency Tab */}
        {consistency.length > 0 && (
          <button
            onClick={() => setActiveTab("consistency")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === "consistency"
                ? "border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--foreground)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Consistency
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--warning)]/20 text-[var(--warning)]">
              {consistency.length}
            </span>
          </button>
        )}
      </div>

      {/* Active Version Content */}
      {activeTab === "consistency" ? (
        <ConsistencyPanel issues={consistency} />
      ) : activeVersion && activeAudience ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activeAudience.icon}</span>
                  <div>
                    <h3 className="font-semibold">
                      Version for {activeAudience.name}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Tone: {activeVersion.tone} &middot;{" "}
                      {activeVersion.wordCount} words
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAudit(!showAudit)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/50 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showAudit ? "Hide" : "Show"} Audit Trail
                </button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                {activeVersion.content.split("\n").map((paragraph, i) =>
                  paragraph.trim() ? (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-[var(--foreground)]/90 mb-3"
                    >
                      {paragraph}
                    </p>
                  ) : null
                )}
              </div>
            </div>

            {/* Audit Trail */}
            {showAudit && (
              <div className="animate-fade-in">
                <TransformationAudit
                  transformations={activeVersion.transformations}
                />
              </div>
            )}
          </div>

          {/* Sidebar: Risks & Flags */}
          <div className="space-y-4">
            <RiskPanel risks={activeVersion.risks} />
            {activeVersion.flags.length > 0 && (
              <FlagsPanel flags={activeVersion.flags} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TransformationAudit({
  transformations,
}: {
  transformations: TransformationItem[];
}) {
  const typeColors: Record<string, string> = {
    preserved: "text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/20",
    simplified: "text-[var(--info)] bg-[var(--info)]/10 border-[var(--info)]/20",
    omitted: "text-[var(--destructive)] bg-[var(--destructive)]/10 border-[var(--destructive)]/20",
    added: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20",
    reframed: "text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/20",
  };

  const typeLabels: Record<string, string> = {
    preserved: "PRESERVED",
    simplified: "SIMPLIFIED",
    omitted: "OMITTED",
    added: "ADDED",
    reframed: "REFRAMED",
  };

  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Eye className="w-4 h-4 text-[var(--primary)]" />
        Transformation Audit Trail
      </h4>
      <p className="text-xs text-[var(--muted-foreground)]">
        Every significant change made to the source document, with reasoning.
      </p>

      <div className="space-y-3">
        {transformations.map((t, i) => (
          <div
            key={i}
            className="animate-slide-in border border-[var(--border)] rounded-lg p-3 space-y-2"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  typeColors[t.type] || ""
                }`}
              >
                {typeLabels[t.type] || t.type.toUpperCase()}
              </span>
            </div>

            {t.original && (
              <div className="text-xs">
                <span className="text-[var(--muted-foreground)]">
                  Original:{" "}
                </span>
                <span className="text-[var(--foreground)]/70 italic">
                  &ldquo;{t.original}&rdquo;
                </span>
              </div>
            )}

            {t.transformed && (
              <div className="text-xs">
                <span className="text-[var(--muted-foreground)]">
                  Became:{" "}
                </span>
                <span className="text-[var(--foreground)]">
                  &ldquo;{t.transformed}&rdquo;
                </span>
              </div>
            )}

            <div className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] rounded px-2 py-1.5">
              {t.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskPanel({ risks }: { risks: RiskAssessment }) {
  const levelColors = {
    low: { bg: "bg-[var(--success)]/10", text: "text-[var(--success)]", icon: ShieldCheck },
    medium: { bg: "bg-[var(--warning)]/10", text: "text-[var(--warning)]", icon: Shield },
    high: { bg: "bg-[var(--destructive)]/10", text: "text-[var(--destructive)]", icon: ShieldAlert },
  };

  const categories = [
    { key: "legal" as const, label: "Legal Risk" },
    { key: "reputational" as const, label: "Reputational Risk" },
    { key: "accuracy" as const, label: "Accuracy Risk" },
  ];

  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Shield className="w-4 h-4 text-[var(--warning)]" />
        Risk Assessment
      </h4>

      {categories.map((cat) => {
        const risk = risks[cat.key];
        const style = levelColors[risk.level];
        const Icon = style.icon;

        return (
          <div key={cat.key} className={`p-3 rounded-lg ${style.bg}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{cat.label}</span>
              <div className={`flex items-center gap-1 ${style.text}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase">{risk.level}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{risk.note}</p>
          </div>
        );
      })}
    </div>
  );
}

function FlagsPanel({ flags }: { flags: HumanReviewFlag[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const severityStyles = {
    info: {
      border: "border-[var(--info)]/30",
      bg: "bg-[var(--info)]/5",
      badge: "bg-[var(--info)]/20 text-[var(--info)]",
    },
    warning: {
      border: "border-[var(--warning)]/30",
      bg: "bg-[var(--warning)]/5",
      badge: "bg-[var(--warning)]/20 text-[var(--warning)]",
    },
    critical: {
      border: "border-[var(--destructive)]/30",
      bg: "bg-[var(--destructive)]/5",
      badge: "bg-[var(--destructive)]/20 text-[var(--destructive)]",
    },
  };

  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <FileWarning className="w-4 h-4 text-[var(--destructive)]" />
        Human Review Required
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--destructive)]/20 text-[var(--destructive)]">
          {flags.length}
        </span>
      </h4>

      <div className="space-y-2">
        {flags.map((flag, i) => {
          const style = severityStyles[flag.severity];
          return (
            <button
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`w-full text-left p-3 rounded-lg border ${style.border} ${style.bg} transition-all`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--warning)]" />
                  <p className="text-xs leading-relaxed break-words">
                    {flag.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badge}`}
                  >
                    {flag.severity.toUpperCase()}
                  </span>
                  {expanded === i ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  )}
                </div>
              </div>
              {expanded === i && (
                <div className="mt-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                  {flag.reason}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConsistencyPanel({ issues }: { issues: ConsistencyIssue[] }) {
  const typeStyles = {
    contradiction: {
      label: "Contradiction",
      color: "text-[var(--destructive)]",
      bg: "bg-[var(--destructive)]/10",
      border: "border-[var(--destructive)]/20",
    },
    inconsistency: {
      label: "Inconsistency",
      color: "text-[var(--warning)]",
      bg: "bg-[var(--warning)]/10",
      border: "border-[var(--warning)]/20",
    },
    missing_context: {
      label: "Missing Context",
      color: "text-[var(--info)]",
      bg: "bg-[var(--info)]/10",
      border: "border-[var(--info)]/20",
    },
  };

  return (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <GitCompare className="w-5 h-5 text-[var(--warning)]" />
        <h3 className="font-semibold">Cross-Version Consistency Check</h3>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        Issues found when comparing all audience versions against each other.
      </p>

      <div className="space-y-3">
        {issues.map((issue, i) => {
          const style = typeStyles[issue.type];
          return (
            <div
              key={i}
              className={`p-4 rounded-lg border ${style.border} ${style.bg} space-y-2 animate-slide-in`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${style.color} ${style.bg} border ${style.border}`}
                >
                  {style.label.toUpperCase()}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Between: {issue.audiences.join(" & ")}
                </span>
              </div>
              <p className="text-sm">{issue.description}</p>
              <div className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] rounded px-3 py-2">
                <strong>Recommendation:</strong> {issue.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
