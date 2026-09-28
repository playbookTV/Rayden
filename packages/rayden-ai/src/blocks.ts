/**
 * Authored block catalog.
 *
 * Blocks are composed task patterns, not components, so they carry different
 * metadata from the component manifests: a release status, the evidence behind
 * that status, and the limitations that evidence leaves open. The data lives in
 * `blocks.json` and is resolved here into self-contained entries, so the same
 * catalog serves documentation navigation, discovery filters and AI clients
 * rather than each growing its own registry.
 *
 * Status is deliberately conservative. Only `stable` entries count toward a
 * public supported-block total, and `stable` requires the complete release-gate
 * record described in the expansion plan — including a screen-reader pass, more
 * than one browser engine, and operating-system text-size testing.
 */
import authored from "./blocks.json";
import { referenceContext } from "./manifests";

export type BlockStatus = "planned" | "internal" | "experimental" | "stable" | "deprecated";
/**
 * The plan's five statuses cannot distinguish an entry measured incompletely from
 * one not measured at all, and both are honestly `experimental`. This carries the
 * difference so a consumer is not left inferring it from the evidence list.
 */
export type BlockVerificationLevel = "measured" | "unmeasured";
export type BlockDomain = "application" | "marketing" | "commerce" | "finance";
export type BlockTask =
  | "navigate"
  | "authenticate"
  | "discover"
  | "compare"
  | "create"
  | "review"
  | "manage"
  | "recover";
export type BlockComposition = "section" | "panel" | "form" | "collection" | "shell";

export interface BlockCategory {
  id: string;
  label: string;
  /** Core ideas allocated to this category by the approved plan. */
  planCore: number;
  /** Core plus extension ideas allocated to this category. */
  planTotal: number;
}

/** What was actually measured, with what, when. Not a conformance claim. */
export interface BlockEvidence {
  id: string;
  date: string;
  report: string;
  tools: string[];
  widths: number[];
  modes: string[];
  scenarios: string[];
  note: string;
}

export interface BlockCapabilities {
  lightDark: boolean;
  scopedThemeIsland: boolean;
  consumerSurfaceOverride: boolean;
  containerAdaptive: boolean;
  keyboardChecked: boolean;
  controlledData: boolean;
  optionalChartDependency: boolean;
}

export interface BlockPreviewStories {
  /** Storybook group title. */
  group: string;
  file: string;
  /** Story export names inside {@link file}. */
  stories: string[];
}

export interface BlockCatalogEntry {
  /** Stable catalog id. Independent of the export name, which may be renamed. */
  id: string;
  /** Idea number in the approved expansion plan. */
  planIdea: number;
  name: string;
  /** The single task this block exists to support. */
  task: string;
  /** Public export name. */
  export: string;
  /** Public entry point the export is reachable from. */
  entryPoint: string;
  /** Public type names exported alongside it. */
  types: string[];
  /** Non-component public helpers, where the block ships any. */
  helpers: string[];
  /** One primary category, so a block is never counted twice. */
  category: string;
  categoryLabel: string;
  domains: BlockDomain[];
  tasks: BlockTask[];
  composition: BlockComposition;
  status: BlockStatus;
  /** Whether a completed verification run stands behind {@link status}. */
  verificationLevel: BlockVerificationLevel;
  flavor: string;
  uiVersion: string;
  aiVersion: string;
  dependencies: {
    peer: string[];
    /** Peers needed only for optional features. Empty means none. */
    optional: string[];
  };
  previewStories: BlockPreviewStories;
  /** States the block documents and demonstrates. */
  states: string[];
  capabilities: BlockCapabilities;
  source: string;
  docs: string;
  verification: {
    /** Date of the most recent evidence behind this entry's status. */
    date: string;
    evidence: BlockEvidence[];
    /** Applies to every entry in this catalog. */
    notVerified: string[];
  };
  limitations: string[];
}

export interface BlockCatalog {
  schemaVersion: string;
  flavor: string;
  uiVersion: string;
  aiVersion: string;
  entryPoint: string;
  plan: typeof authored.plan;
  statuses: Record<string, string>;
  verificationLevels: Record<string, string>;
  publicCountRule: string;
  vocabularies: typeof authored.vocabularies;
  categories: BlockCategory[];
  capabilityDefinitions: Record<string, string>;
  counts: {
    implemented: number;
    byStatus: Record<string, number>;
    byVerificationLevel: Record<string, number>;
    byCategory: Record<string, number>;
    /** Entries whose status is `stable`. The only ones that may be advertised. */
    publiclySupported: number;
  };
  entries: BlockCatalogEntry[];
  limitations: string[];
}

const ENTRY_POINT = "@raydenui/ui/blocks";
const PEER_DEPENDENCIES = ["react", "react-dom"];

const categories = authored.categories as BlockCategory[];
const evidenceById = new Map(
  Object.entries(authored.evidence).map(([id, record]) => [id, { id, ...record } as BlockEvidence])
);

function resolveEntry(authoredEntry: (typeof authored.entries)[number]): BlockCatalogEntry {
  const category = categories.find((candidate) => candidate.id === authoredEntry.category);
  if (!category) throw new Error(`${authoredEntry.id}: unknown category ${authoredEntry.category}`);
  const evidence = authoredEntry.verification.evidence.map((id) => {
    const record = evidenceById.get(id);
    if (!record) throw new Error(`${authoredEntry.id}: unknown evidence ${id}`);
    return record;
  });
  return {
    id: authoredEntry.id,
    planIdea: authoredEntry.planIdea,
    name: authoredEntry.name,
    task: authoredEntry.task,
    export: authoredEntry.export,
    entryPoint: ENTRY_POINT,
    types: authoredEntry.types,
    helpers: "helpers" in authoredEntry ? (authoredEntry.helpers as string[]) : [],
    category: authoredEntry.category,
    categoryLabel: category.label,
    domains: authoredEntry.domains as BlockDomain[],
    tasks: authoredEntry.tasks as BlockTask[],
    composition: authoredEntry.composition as BlockComposition,
    status: authoredEntry.status as BlockStatus,
    verificationLevel:
      "verificationLevel" in authoredEntry
        ? (authoredEntry.verificationLevel as BlockVerificationLevel)
        : "measured",
    flavor: referenceContext.flavor,
    uiVersion: referenceContext.uiVersion,
    aiVersion: referenceContext.aiVersion,
    dependencies: {
      peer: PEER_DEPENDENCIES,
      optional: authoredEntry.capabilities.optionalChartDependency
        ? ["chart.js", "react-chartjs-2"]
        : [],
    },
    previewStories: authoredEntry.previewStories,
    states: authoredEntry.states,
    capabilities: authoredEntry.capabilities,
    source: authoredEntry.source,
    docs: authoredEntry.docs,
    verification: {
      date: authoredEntry.verification.date,
      evidence,
      notVerified: authored.notVerifiedForEveryEntry,
    },
    limitations: authoredEntry.limitations,
  };
}

function tally(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

export function getBlockCatalog(): BlockCatalog {
  const entries = authored.entries.map(resolveEntry);
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) throw new Error(`Duplicate block catalog id ${entry.id}`);
    seen.add(entry.id);
  }
  return {
    schemaVersion: authored.schemaVersion,
    flavor: referenceContext.flavor,
    uiVersion: referenceContext.uiVersion,
    aiVersion: referenceContext.aiVersion,
    entryPoint: ENTRY_POINT,
    plan: authored.plan,
    statuses: authored.statuses,
    verificationLevels: authored.verificationLevels,
    publicCountRule: authored.publicCountRule,
    vocabularies: authored.vocabularies,
    categories,
    capabilityDefinitions: authored.capabilityDefinitions,
    counts: {
      implemented: entries.length,
      byStatus: tally(entries.map((entry) => entry.status)),
      byVerificationLevel: tally(entries.map((entry) => entry.verificationLevel)),
      byCategory: tally(entries.map((entry) => entry.category)),
      publiclySupported: entries.filter((entry) => entry.status === "stable").length,
    },
    entries,
    limitations: [
      "Status, capabilities and verification are authored records of what was measured. They are not automated conformance results and no entry claims WCAG conformance.",
      "A capability flag means the named scenario was exercised, not that the block is accessible or responsive in general. The presence of ARIA attributes or breakpoint classes is never the basis for a flag.",
      "Every entry is experimental: no block in this release has had a screen-reader pass, a second browser engine, or operating-system text-size testing, so none has earned the stable status the plan reserves for the public count.",
      'Entries carrying verificationLevel "unmeasured" have had no verification run at all. Their capability flags describe what their stories cover in principle, not a measurement, and are weaker evidence than a measured entry\'s.',
      "Preview story names are authored and verified against their story file; a listed story is a fixture, not an end-to-end interaction test.",
      "Prop contracts are not repeated here. Read them from the exported TypeScript types or the component manifests.",
    ],
  };
}

export function getBlockEntry(id: string): BlockCatalogEntry | null {
  return getBlockCatalog().entries.find((entry) => entry.id === id || entry.export === id) ?? null;
}

export function getBlocksByCategory(category: string): BlockCatalogEntry[] {
  return getBlockCatalog().entries.filter((entry) => entry.category === category);
}
