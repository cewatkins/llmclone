export type PublishedRow = {
  name: string;
  tests: string;
  a: number;
  b: number;
};

export type PublishedPair = {
  id: string;
  label: string;
  a: { name: string; note: string };
  b: { name: string; note: string };
  source: string;
  caveat: string;
  rows: PublishedRow[];
};

/** Scores are the ones printed on Qwen's cards. They are not a Meridian weight audit. */
export const publishedPairs: PublishedPair[] = [
  {
    id: "27b-opus46",
    label: "27B · Opus 4.6",
    a: {
      name: "Qwen3.8-27B",
      note: "Open weights, Apache 2.0. Dense 27B, 64 layers, 262k context. About 50 GB in 16-bit.",
    },
    b: {
      name: "Claude Opus 4.6 Max",
      note: "The Claude printed beside 27B on Qwen’s card. Size is not disclosed. Weights are not public.",
    },
    source: "Qwen3.8-27B model card, as reported August 2026.",
    caveat:
      "Qwen ran these. The SWE-bench Pro gap is the one later writeups flag as a corrected-task rescore. A newer Claude, Opus 5, is listed at 79.2 on that benchmark against this 27B’s 61.7.",
    rows: [
      { name: "SWE-bench Pro", tests: "Agentic coding", a: 61.7, b: 53.4 },
      { name: "OSWorld-Verified", tests: "Computer use", a: 84.3, b: 72.7 },
      { name: "IFBench", tests: "Instruction following", a: 79.5, b: 62.5 },
      { name: "Terminal-Bench 2.1", tests: "Terminal coding", a: 73.0, b: 78.2 },
      { name: "GPQA Diamond", tests: "Graduate science", a: 89.2, b: 91.3 },
      { name: "Humanity’s Last Exam", tests: "Expert questions", a: 30.8, b: 40.0 },
    ],
  },
  {
    id: "max-opus48",
    label: "Max · Opus 4.8",
    a: {
      name: "Qwen3.8-Max",
      note: "API flagship. Open sibling is the 2.4T-A95B MoE. About $2 / $6 per million tokens.",
    },
    b: {
      name: "Claude Opus 4.8",
      note: "The Claude in Qwen’s launch table. About $5 / $25 per million tokens. Fable 5 is a later, stronger coder.",
    },
    source: "Qwen3.8-Max launch table.",
    caveat:
      "Self-run, and a few rows are Qwen’s own benches. Claude Fable 5 still leads Max on SWE-bench Pro, 80.0 to 67.7.",
    rows: [
      { name: "Terminal Bench 2.1", tests: "Terminal coding", a: 86.6, b: 84.6 },
      { name: "SWE-bench Pro", tests: "Agentic coding", a: 67.7, b: 69.2 },
      { name: "FrontierSWE", tests: "Software engineering", a: 73.5, b: 70.0 },
      { name: "PaperBench", tests: "Research papers", a: 93.0, b: 80.3 },
      { name: "CoWorkBench", tests: "Collaborative work", a: 74.8, b: 72.3 },
      { name: "Toolathlon Verified", tests: "Tool use", a: 72.5, b: 76.2 },
      { name: "GPQA Diamond", tests: "Graduate science", a: 92.6, b: 92.0 },
      { name: "HLE, no tools", tests: "Expert questions", a: 43.6, b: 45.7 },
      { name: "IFBench", tests: "Instruction following", a: 82.8, b: 62.2 },
    ],
  },
];
