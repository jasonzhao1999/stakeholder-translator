export interface AudienceProfile {
  id: string;
  name: string;
  icon: string;
  description: string;
  careAbout: string[];
  contextLevel: string;
  purpose: string;
  color: string;
}

export const AUDIENCE_PROFILES: AudienceProfile[] = [
  {
    id: "executive",
    name: "Executive Leadership",
    icon: "👔",
    description: "C-suite and senior leadership",
    careAbout: ["Business impact", "Cost", "Risk", "Timeline", "Strategic implications"],
    contextLevel: "High-level, no technical jargon",
    purpose: "Make decisions and allocate resources",
    color: "#6366f1",
  },
  {
    id: "engineering",
    name: "Engineering Team",
    icon: "⚙️",
    description: "Technical staff and developers",
    careAbout: ["Root cause", "Technical details", "Architecture impact", "Action items"],
    contextLevel: "Full technical depth",
    purpose: "Understand what happened and prevent recurrence",
    color: "#22c55e",
  },
  {
    id: "customer",
    name: "Customers",
    icon: "👥",
    description: "External users and clients",
    careAbout: ["Impact on them", "Resolution", "Compensation", "Prevention"],
    contextLevel: "Non-technical, empathetic, clear",
    purpose: "Understand what happened and what to expect",
    color: "#3b82f6",
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    icon: "⚖️",
    description: "Legal team and regulators",
    careAbout: ["Liability", "Compliance impact", "Data implications", "Regulatory obligations"],
    contextLevel: "Precise language, no admissions without verification",
    purpose: "Assess legal exposure and compliance obligations",
    color: "#f59e0b",
  },
  {
    id: "media",
    name: "Media / Public",
    icon: "📰",
    description: "Press and public communications",
    careAbout: ["Narrative", "Accountability", "Transparency", "Brand impact"],
    contextLevel: "Clear, quotable, non-technical",
    purpose: "Inform the public accurately without creating unnecessary alarm",
    color: "#ec4899",
  },
];

export interface TransformationItem {
  type: "preserved" | "simplified" | "omitted" | "added" | "reframed";
  original?: string;
  transformed?: string;
  reason: string;
}

export interface RiskAssessment {
  legal: { level: "low" | "medium" | "high"; note: string };
  reputational: { level: "low" | "medium" | "high"; note: string };
  accuracy: { level: "low" | "medium" | "high"; note: string };
}

export interface HumanReviewFlag {
  text: string;
  reason: string;
  severity: "info" | "warning" | "critical";
}

export interface AudienceVersion {
  audienceId: string;
  content: string;
  tone: string;
  wordCount: number;
  transformations: TransformationItem[];
  risks: RiskAssessment;
  flags: HumanReviewFlag[];
}

export interface ConsistencyIssue {
  type: "contradiction" | "inconsistency" | "missing_context";
  audiences: string[];
  description: string;
  recommendation: string;
}

export interface TranslationResult {
  versions: AudienceVersion[];
  consistency: ConsistencyIssue[];
  summary: {
    originalWordCount: number;
    audienceCount: number;
    totalFlags: number;
    criticalFlags: number;
  };
}
