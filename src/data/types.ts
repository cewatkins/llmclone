export interface SeriesPoint {
  k: number;
  token: string;
  target: string;
  jsd: number;
  power: number;
  ema: number;
  lmsPrediction: number;
  innovation: number;
  mu: number;
  sigma: number;
  threshold: number;
  flagged: boolean;
  entropyA: number;
  entropyB: number;
  normEntropyA: number;
  normEntropyB: number;
  perplexityA: number;
  perplexityB: number;
  top1A: string;
  top1B: string;
  agree: boolean;
  bucket: "identical" | "soft" | "conflict";
  kind: string | null;
  globalK: number;
}

export interface PromptRow {
  id: string;
  file: string;
  line: number;
  text: string;
  role: string;
  tokens: string[];
  series: SeriesPoint[];
}

export interface SpanRow {
  promptId: string;
  file: string;
  line: number;
  start: number;
  end: number;
  global_start: number;
  global_end: number;
  kind: string;
  peak_jsd: number;
  mean_jsd: number;
  snippet: string;
  predictionA: string;
  predictionB: string;
  highlight: boolean;
  annotate: boolean;
}

export interface LayerRow {
  name: string;
  depth: number;
  cka: number;
  residual: number;
  insampleResidual: number;
  r2AB: number;
  r2BA: number;
  orthogonalResidual: number;
  samples: number;
  widthA: number;
  widthB: number;
}

export interface ModelCard {
  name: string;
  label: string;
  params?: number;
  layers?: number;
  width?: number;
  vocab?: number;
  dtype?: string;
  device?: string;
  note?: string;
}

export interface Briefing {
  product: string;
  models: { a: ModelCard; b: ModelCard; pair: string };
  macro: {
    overlap_score: number;
    top1_identical_pct: number;
    soft_parity_pct: number;
    hard_conflict_pct: number;
    shared_latent_pct: number;
    model_a_unique_pct: number;
    model_b_unique_pct: number;
    mean_cka: number;
    mean_residual_fraction: number;
    mean_r2_a_to_b: number;
    mean_r2_b_to_a: number;
    mean_orthogonal_residual: number;
    background_mu: number;
    background_sigma: number;
    power_floor: number;
    cert_threshold: number;
    uncertain_threshold: number;
    n_tokens: number;
    n_spans: number;
    lms_weights: number[];
  };
  layers: LayerRow[];
  prompts: PromptRow[];
  stream: {
    global_k: number;
    jsd: number;
    threshold: number;
    promptId: string;
    flagged: boolean;
    kind: string | null;
  }[];
  spans: SpanRow[];
  top_spans: SpanRow[];
  hook_log: string[];
  verification: Record<string, number | string | boolean | null>;
  definitions: Record<string, string>;
}
