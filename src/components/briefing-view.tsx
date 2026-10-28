import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Layers } from "lucide-react";
import type { Briefing, PromptRow, SeriesPoint, SpanRow } from "@/data/types";

type Audience = "executive" | "engineering";

const KIND_LABEL: Record<string, string> = {
  lost: "Forgotten by B",
  acquired: "Acquired by B",
  conflict: "Certain conflict",
  drift: "Distribution drift",
};

const ROLE_LABEL: Record<string, string> = {
  shared: "Shared",
  archive: "Archive · A only",
  acquired: "Protocol · B only",
  novel: "Neither model",
  continuation: "Continuation",
  factual: "Factual",
  code: "Code",
  instruction: "Instruction",
  dialogue: "Question",
  user: "Prompt",
};

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-line)",
  borderRadius: 12,
  color: "var(--color-fg)",
  fontSize: 13,
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatNum(value: number, digits = 3) {
  return value.toFixed(digits);
}

function kindTone(kind: string | null) {
  if (kind === "acquired") return "text-olive";
  if (kind === "lost" || kind === "conflict") return "text-copper";
  if (kind === "drift") return "text-bone";
  return "text-muted";
}

function bucketTone(bucket: SeriesPoint["bucket"]) {
  if (bucket === "identical") return "bg-olive/15 text-olive";
  if (bucket === "soft") return "bg-bone/20 text-bone";
  return "bg-copper/15 text-copper";
}

export function BriefingView({ briefing }: { briefing: Briefing }) {
  const mounted = useMounted();
  const [audience, setAudience] = useState<Audience>("executive");
  const [promptId, setPromptId] = useState(briefing.top_spans[0]?.promptId ?? briefing.prompts[0]?.id ?? "");
  const [streamMode, setStreamMode] = useState<"prompt" | "all">("prompt");
  const [layerIndex, setLayerIndex] = useState(Math.max(0, briefing.layers.length - 1));
  const [tokenK, setTokenK] = useState<number | null>(null);
  const [showAllSpans, setShowAllSpans] = useState(false);

  const prompt = briefing.prompts.find((row) => row.id === promptId) ?? briefing.prompts[0];
  const layer = briefing.layers[layerIndex] ?? briefing.layers[0];
  const selectedPoint = prompt?.series.find((point) => point.k === tokenK) ?? null;
  const visibleSpans = showAllSpans ? briefing.spans : briefing.top_spans;
  const engineering = audience === "engineering";

  const roles = useMemo(() => roleSummary(briefing), [briefing]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-copper uppercase">
            <Layers className="size-4" aria-hidden="true" />
            Checkpoint brief
          </p>
          <h1 className="mt-2 font-serif text-4xl text-fg md:text-5xl">Meridian</h1>
          <p className="mt-3 max-w-xl text-base text-muted">
            How much of model A is still inside model B: next-token agreement, the geometry that survived,
            and the spans where one checkpoint is sure and the other is not.
          </p>
        </div>
        <div className="flex rounded-2xl bg-surface p-1 shadow-border" role="group" aria-label="Audience">
          <AudienceButton current={audience} value="executive" onSelect={setAudience} label="Executive" />
          <AudienceButton current={audience} value="engineering" onSelect={setAudience} label="Engineering" />
        </div>
      </header>

      <p className="mt-6 text-sm text-muted">{briefing.models.pair}</p>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <ModelPanel side="A" model={briefing.models.a} />
        <ModelPanel side="B" model={briefing.models.b} />
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Score
          label="Macro overlap"
          value={formatPct(briefing.macro.overlap_score)}
          detail="Agreement, soft parity, and mean CKA, weighted."
        />
        <Score
          label="Top-1 alignment"
          value={formatPct(briefing.macro.top1_identical_pct)}
          detail="Positions where both models pick the same next token."
        />
        <Score
          label="Shared geometry"
          value={formatPct(briefing.macro.shared_latent_pct)}
          detail="Latent structure a linear map still carries both ways."
        />
        <Score
          label="Residual floor"
          value={formatNum(briefing.macro.mean_residual_fraction)}
          detail="Held-out variance in B that A cannot linearly predict."
        />
      </section>

      <section className="mt-4 overflow-x-auto rounded-2xl bg-surface shadow-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="px-4 pt-4 text-left text-xs tracking-wide text-muted uppercase">
            Where the streams separate
          </caption>
          <thead>
            <tr className="text-muted">
              <th className="px-4 py-3 font-medium">Corpus</th>
              <th className="px-4 py-3 font-medium">Tokens</th>
              <th className="px-4 py-3 font-medium">Top-1 match</th>
              <th className="px-4 py-3 font-medium">Mean JSD</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.role} className="border-t border-line">
                <th className="px-4 py-3 font-medium text-fg" scope="row">
                  {ROLE_LABEL[role.role] ?? role.role}
                </th>
                <td className="px-4 py-3 tabular-nums text-muted">{role.tokens}</td>
                <td className="px-4 py-3 tabular-nums text-fg">{formatPct(role.agreePct)}</td>
                <td className="px-4 py-3 tabular-nums text-fg">{formatNum(role.meanJsd)} bits</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-2">
        <ChartCard title="Behavioral delta" kicker="Next-token distributions">
          <Donut
            mounted={mounted}
            center={formatPct(briefing.macro.top1_identical_pct)}
            caption="identical"
            slices={[
              { name: "Identical top-1", value: briefing.macro.top1_identical_pct, fill: "var(--color-olive)" },
              { name: "Soft parity", value: briefing.macro.soft_parity_pct, fill: "var(--color-bone)" },
              { name: "Hard conflict", value: briefing.macro.hard_conflict_pct, fill: "var(--color-copper)" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Representation delta" kicker="Latent geometry, block mean">
          <Donut
            mounted={mounted}
            center={formatPct(briefing.macro.shared_latent_pct)}
            caption="shared"
            slices={[
              { name: "Shared core", value: briefing.macro.shared_latent_pct, fill: "var(--color-olive)" },
              { name: "A residual / lost", value: briefing.macro.model_a_unique_pct, fill: "var(--color-copper)" },
              { name: "B residual / acquired", value: briefing.macro.model_b_unique_pct, fill: "var(--color-bone)" },
            ]}
          />
        </ChartCard>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-fg">Depth-wise similarity</h2>
            <p className="mt-1 text-sm text-muted">Linear CKA from the embedding tap to the last block. Select a layer.</p>
          </div>
          {layer ? (
            <p className="text-sm text-muted tabular-nums">
              <span className="text-fg">{layer.name}</span>
              {" · CKA "}
              {formatNum(layer.cka)}
              {" · residual "}
              {formatNum(layer.residual)}
            </p>
          ) : null}
        </div>
        <div className="mt-4 h-56">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={briefing.layers} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="var(--color-line)" />
                <XAxis
                  dataKey="name"
                  interval={briefing.layers.length > 14 ? Math.floor(briefing.layers.length / 7) : 0}
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 1]} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-surface-2)" }} />
                <Bar dataKey="cka" name="Linear CKA" radius={[6, 6, 0, 0]} onClick={(_row, index) => setLayerIndex(index)}>
                  {briefing.layers.map((row, index) => (
                    <Cell key={row.name} fill={index === layerIndex ? "var(--color-copper)" : "var(--color-olive)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-xl bg-surface-2" />
          )}
        </div>
        {engineering && layer ? (
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Predictive R² A→B" value={formatNum(layer.r2AB)} />
            <Metric label="Predictive R² B→A" value={formatNum(layer.r2BA)} />
            <Metric label="In-sample residual" value={formatNum(layer.insampleResidual)} />
            <Metric label="Orthogonal residual" value={formatNum(layer.orthogonalResidual)} />
            <Metric label="Width A → B" value={`${layer.widthA} → ${layer.widthB}`} />
            <Metric label="Samples" value={String(layer.samples)} />
          </div>
        ) : null}
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-2xl text-fg">
              <Activity className="size-5 text-copper" aria-hidden="true" />
              Divergence horizon
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Symmetric top-8 Jensen-Shannon divergence in bits. Shaded bands are spans that cleared the censored μ+3σ rule.
            </p>
          </div>
          <div className="flex rounded-xl bg-bg p-1 shadow-border" role="group" aria-label="Timeline scope">
            <AudienceButton current={streamMode} value="prompt" onSelect={setStreamMode} label="This prompt" />
            <AudienceButton current={streamMode} value="all" onSelect={setStreamMode} label="Full stream" />
          </div>
        </div>
        <div className="mt-4 h-56">
          {mounted ? (
            <DivergenceChart briefing={briefing} prompt={prompt} mode={streamMode} />
          ) : (
            <div className="h-full rounded-xl bg-surface-2" />
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-2xl text-fg">Prompts</h2>
        <div className="mt-3 flex flex-col gap-2">
          {briefing.prompts.map((row) => {
            const active = row.id === prompt?.id;
            return (
              <button
                key={row.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setPromptId(row.id);
                  setTokenK(null);
                  setStreamMode("prompt");
                }}
                className={
                  "min-h-11 rounded-xl px-3 py-2 text-left shadow-border transition-colors duration-200 " +
                  (active ? "bg-surface-2 text-fg" : "bg-surface text-muted hover:text-fg")
                }
              >
                <span className="block text-xs tracking-wide text-copper uppercase">
                  {ROLE_LABEL[row.role] ?? row.role} · {row.file}:{row.line}
                </span>
                <span className="mt-1 block text-sm text-fg">{row.text}</span>
              </button>
            );
          })}
        </div>
      </section>

      {prompt ? (
        <section className="mt-6">
          <h2 className="font-serif text-2xl text-fg">Token tape</h2>
          <p className="mt-1 text-sm text-muted">
            Each chip is an input token. Color is the next-token bucket. A ring means the position is inside a divergence span.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {prompt.series.map((point) => {
              const selected = point.k === tokenK;
              return (
                <button
                  key={point.k}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTokenK(point.k)}
                  className={
                    "min-h-11 rounded-lg px-3 py-2 text-sm tabular-nums transition-colors duration-200 " +
                    bucketTone(point.bucket) +
                    (point.flagged ? " ring-1 ring-copper" : "") +
                    (selected ? " ring-2 ring-fg" : "")
                  }
                >
                  <span className="block text-xs opacity-70">{point.k}</span>
                  {point.token}
                </button>
              );
            })}
          </div>
          {selectedPoint ? <TokenReadout point={selectedPoint} file={prompt.file} line={prompt.line} /> : null}
          <LmsSteps point={selectedPoint ?? prompt.series[0]} weights={briefing.macro.lms_weights} />
          {engineering ? <TokenTable series={prompt.series} onPick={setTokenK} active={tokenK} /> : null}
        </section>
      ) : null}

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-fg">Divergence spans</h2>
            <p className="mt-1 text-sm text-muted">
              Highest peaks first. Offsets are input-token indexes. Predictions are the top-1 next token at the peak.
            </p>
          </div>
          {briefing.spans.length > briefing.top_spans.length ? (
            <button
              type="button"
              onClick={() => setShowAllSpans((value) => !value)}
              className="min-h-11 rounded-xl bg-surface px-4 text-sm text-fg shadow-border"
            >
              {showAllSpans ? "Show top five" : `Show all ${briefing.spans.length}`}
            </button>
          ) : null}
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-surface shadow-border">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium">Where</th>
                <th className="px-4 py-3 font-medium">Offsets</th>
                <th className="px-4 py-3 font-medium">Peak JSD</th>
                <th className="px-4 py-3 font-medium">At the peak</th>
              </tr>
            </thead>
            <tbody>
              {visibleSpans.map((span) => (
                <SpanLine
                  key={`${span.promptId}-${span.start}`}
                  span={span}
                  onOpen={() => {
                    setPromptId(span.promptId);
                    setTokenK(span.start);
                    setStreamMode("prompt");
                  }}
                />
              ))}
              {visibleSpans.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={5}>
                    No position crossed the divergence threshold.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-surface p-4 shadow-border md:p-5">
        <h2 className="font-serif text-2xl text-fg">Publication figure</h2>
        <p className="mt-1 text-sm text-muted">The matplotlib brief written by the same run.</p>
        <img
          src="/comparison_report.png"
          alt="Meridian comparison report with behavioral and representation donuts, a CKA curve, and the JSD timeline."
          className="mt-4 w-full rounded-xl outline outline-1 -outline-offset-1 outline-white/10"
        />
      </section>

      {engineering ? (
        <section className="mt-4 grid gap-3 lg:grid-cols-2">
          <article className="rounded-2xl bg-surface p-4 shadow-border md:p-5">
            <h2 className="font-serif text-2xl text-fg">Definitions</h2>
            <dl className="mt-3 space-y-3">
              {Object.entries(briefing.definitions).map(([key, text]) => (
                <div key={key}>
                  <dt className="text-xs tracking-wide text-copper uppercase">{key}</dt>
                  <dd className="mt-1 text-sm text-muted">{text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted tabular-nums">
              NLMS weights [{briefing.macro.lms_weights.map((weight) => weight.toFixed(3)).join(", ")}]
              {" · "}baseline μ {formatNum(briefing.macro.background_mu, 4)}
              {" · "}σ {formatNum(briefing.macro.background_sigma, 4)}
            </p>
          </article>
          <article className="rounded-2xl bg-surface p-4 shadow-border md:p-5">
            <h2 className="font-serif text-2xl text-fg">Hook log</h2>
            <ul className="mt-3 max-h-80 space-y-1 overflow-auto text-sm text-muted">
              {briefing.hook_log.map((line, index) => (
                <li key={`${line}-${index}`} className="text-xs tabular-nums">
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-fg">
              Hooks released: {String(briefing.verification.live_hooks_released ?? briefing.verification.hooks_released)}
              {" · "}JSD identity {String(briefing.verification.jsd_identical)}
              {" · "}orthogonal CKA {String(briefing.verification.cka_orthogonal)}
            </p>
          </article>
        </section>
      ) : null}

      <p className="mt-8 text-sm text-muted">
        {briefing.macro.n_tokens} scored positions · {briefing.macro.n_spans} spans · mean CKA {formatNum(briefing.macro.mean_cka)}
      </p>
    </main>
  );
}

function AudienceButton<T extends string>({
  current,
  value,
  label,
  onSelect,
}: {
  current: T;
  value: T;
  label: string;
  onSelect: (value: T) => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(value)}
      className={
        "min-h-11 rounded-xl px-4 text-sm transition-colors duration-200 " +
        (active ? "bg-surface-2 text-fg" : "text-muted")
      }
    >
      {label}
    </button>
  );
}

function Score({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-border">
      <h2 className="text-xs tracking-wide text-muted uppercase">{label}</h2>
      <p className="mt-2 font-serif text-4xl text-fg tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </section>
  );
}

function ModelPanel({ side, model }: { side: string; model: Briefing["models"]["a"] }) {
  return (
    <article className="rounded-2xl bg-surface p-4 shadow-border">
      <p className="text-xs tracking-wide text-copper uppercase">Model {side}</p>
      <h2 className="mt-1 font-serif text-xl text-fg">{model.label}</h2>
      <p className="mt-2 text-sm text-muted">{model.note}</p>
      <p className="mt-3 text-xs text-muted tabular-nums">
        {model.params ? `${model.params.toLocaleString("en-US")} parameters` : model.name}
        {model.width ? ` · width ${model.width}` : ""}
        {model.layers ? ` · ${model.layers} blocks` : ""}
        {model.dtype ? ` · ${model.dtype}` : ""}
        {model.device ? ` · ${model.device}` : ""}
      </p>
    </article>
  );
}

function ChartCard({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-border md:p-5">
      <p className="text-xs tracking-wide text-muted uppercase">{kicker}</p>
      <h2 className="mt-1 font-serif text-2xl text-fg">{title}</h2>
      {children}
    </section>
  );
}

function Donut({
  mounted,
  center,
  caption,
  slices,
}: {
  mounted: boolean;
  center: string;
  caption: string;
  slices: { name: string; value: number; fill: string }[];
}) {
  return (
    <div>
      <div className="relative mt-2 h-52">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={slices} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="86%" paddingAngle={2} stroke="none">
                {slices.map((slice) => (
                  <Cell key={slice.name} fill={slice.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatPct(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-xl bg-surface-2" />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-3xl text-fg tabular-nums">{center}</p>
            <p className="text-xs text-muted">{caption}</p>
          </div>
        </div>
      </div>
      <ul className="mt-2 space-y-1">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="inline-block size-2.5 rounded-full" style={{ background: slice.fill }} />
              {slice.name}
            </span>
            <span className="text-fg tabular-nums">{formatPct(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DivergenceChart({
  briefing,
  prompt,
  mode,
}: {
  briefing: Briefing;
  prompt: PromptRow | undefined;
  mode: "prompt" | "all";
}) {
  const promptSpans = briefing.spans.filter((span) => span.promptId === prompt?.id);
  if (mode === "prompt" && prompt) {
    const data = prompt.series.map((point) => ({
      x: point.k,
      jsd: point.jsd,
      threshold: Math.sqrt(Math.max(point.threshold, 0)),
      token: point.token,
    }));
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="x" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 1.05]} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip contentStyle={tooltipStyle} />
          {promptSpans.map((span) => (
            <ReferenceArea key={`${span.start}-${span.end}`} x1={span.start} x2={span.end} fill="var(--color-copper)" fillOpacity={0.12} />
          ))}
          <Line type="monotone" dataKey="jsd" name="JSD bits" stroke="var(--color-fg)" strokeWidth={1.6} dot={false} />
          <Line type="monotone" dataKey="threshold" name="μ+3σ bits" stroke="var(--color-bone)" strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  const data = briefing.stream.map((point) => ({
    x: point.global_k,
    jsd: point.jsd,
    threshold: Math.sqrt(Math.max(point.threshold, 0)),
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="var(--color-line)" vertical={false} />
        <XAxis dataKey="x" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 1.05]} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip contentStyle={tooltipStyle} />
        {briefing.spans
          .filter((span) => span.highlight)
          .map((span) => (
            <ReferenceArea
              key={`${span.promptId}-${span.start}`}
              x1={span.global_start}
              x2={span.global_end}
              fill="var(--color-copper)"
              fillOpacity={0.12}
            />
          ))}
        <Line type="monotone" dataKey="jsd" name="JSD bits" stroke="var(--color-fg)" strokeWidth={1.4} dot={false} />
        <Line type="monotone" dataKey="threshold" name="μ+3σ bits" stroke="var(--color-bone)" strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function LmsSteps({ point, weights }: { point: SeriesPoint; weights: number[] }) {
  const silent = Math.abs(point.innovation) < 1e-12 && Math.abs(point.power) < 1e-12;
  return (
    <section className="mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5">
      <h3 className="font-serif text-xl text-fg">LMS at token {point.k}</h3>
      <p className="mt-1 text-sm text-muted">
        The filter tracks divergence power, which is JSD squared. It does not decide the headline overlap, and it does not open spans.
      </p>
      <ol className="mt-4 space-y-3 text-sm text-fg">
        <li>
          <span className="text-copper">1. Measure.</span> Top-8 Jensen–Shannon between the two logit rows is {formatNum(point.jsd, 4)} bits.
          Power p = JSD² = {formatNum(point.power, 4)}.
        </li>
        <li>
          <span className="text-copper">2. Gate, before any tap moves.</span> Open a span only if p exceeds μ + 3σ, here {formatNum(point.mu, 4)} + 3×{formatNum(point.sigma, 4)} = {formatNum(point.threshold, 4)}.
          This token {point.flagged ? "clears" : "does not clear"} it.
          {silent
            ? " σ is floored at (0.08 bits)² = 0.0064 because every calm power is 0 and the MAD is 0. The LMS taps are not in this test."
            : " The LMS taps are not in this test."}
        </li>
        <li>
          <span className="text-copper">3. Predict.</span> Four taps hold earlier powers, not this one. w·d = {formatNum(point.lmsPrediction, 4)}.
          After the whole stream the taps are [{weights.map((weight) => weight.toFixed(3)).join(", ")}].
        </li>
        <li>
          <span className="text-copper">4. Innovation.</span> e = p − w·d = {formatNum(point.innovation, 4)}.
        </li>
        <li>
          <span className="text-copper">5. Update.</span> w ← w + 0.35 · e / (‖d‖² + 10⁻⁶) · d.
          {silent
            ? " e is 0 and d is still zero, so the correction is the zero vector and the taps stay at 0."
            : " The correction points along the delay line and is scaled by this innovation."}
        </li>
        <li>
          <span className="text-copper">6. Shift.</span> Drop the oldest tap and store p = {formatNum(point.power, 4)} as the newest. The next token predicts from that.
        </li>
        <li>
          <span className="text-copper">7. Smooth, then the slow baseline.</span> J ← 0.65 J + 0.35 p lands at {formatNum(point.ema, 4)}. That average is not the tap update.
          {point.flagged
            ? " The position is flagged, so μ and σ are left alone."
            : " It is unflagged, so μ and σ take one slow step toward this power."}
        </li>
      </ol>
    </section>
  );
}

function TokenReadout({ point, file, line }: { point: SeriesPoint; file: string; line: number }) {
  return (
    <div className="mt-3 rounded-xl bg-surface p-4 text-sm shadow-border">
      <p className="text-fg">
        Offset {point.k} in {file}:{line}. Input <span className="text-bone">{point.token}</span>
        {point.target ? (
          <>
            , file continues <span className="text-bone">{point.target}</span>
          </>
        ) : (
          ", end of line"
        )}
        .
      </p>
      <p className="mt-2 text-muted">
        A predicts <span className="text-fg">{point.top1A}</span> (entropy {formatNum(point.normEntropyA, 2)}) · B predicts{" "}
        <span className="text-fg">{point.top1B}</span> (entropy {formatNum(point.normEntropyB, 2)}) · JSD {formatNum(point.jsd)} bits ·{" "}
        <span className={kindTone(point.kind)}>{point.kind ? KIND_LABEL[point.kind] ?? point.kind : point.bucket}</span>
      </p>
    </div>
  );
}

function TokenTable({
  series,
  onPick,
  active,
}: {
  series: SeriesPoint[];
  onPick: (k: number) => void;
  active: number | null;
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl bg-surface shadow-border">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead>
          <tr className="text-muted">
            <th className="px-3 py-2 font-medium">k</th>
            <th className="px-3 py-2 font-medium">Token</th>
            <th className="px-3 py-2 font-medium">A</th>
            <th className="px-3 py-2 font-medium">B</th>
            <th className="px-3 py-2 font-medium">JSD</th>
            <th className="px-3 py-2 font-medium">EMA power</th>
            <th className="px-3 py-2 font-medium">Innovation</th>
            <th className="px-3 py-2 font-medium">Kind</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr
              key={point.k}
              className={"border-t border-line " + (point.k === active ? "bg-surface-2" : "")}
              onClick={() => onPick(point.k)}
            >
              <td className="px-3 py-2 tabular-nums">{point.k}</td>
              <td className="px-3 py-2">{point.token}</td>
              <td className="px-3 py-2">{point.top1A}</td>
              <td className="px-3 py-2">{point.top1B}</td>
              <td className="px-3 py-2 tabular-nums">{formatNum(point.jsd)}</td>
              <td className="px-3 py-2 tabular-nums">{formatNum(point.ema)}</td>
              <td className="px-3 py-2 tabular-nums">{formatNum(point.innovation)}</td>
              <td className={"px-3 py-2 " + kindTone(point.kind)}>{point.kind ?? point.bucket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpanLine({ span, onOpen }: { span: SpanRow; onOpen: () => void }) {
  return (
    <tr className="border-t border-line">
      <td className={"px-4 py-3 " + kindTone(span.kind)}>{KIND_LABEL[span.kind] ?? span.kind}</td>
      <td className="px-4 py-3">
        <button type="button" onClick={onOpen} className="min-h-11 text-left text-fg underline-offset-2 hover:underline">
          {span.file}:{span.line}
        </button>
      </td>
      <td className="px-4 py-3 tabular-nums text-muted">
        {span.start}–{span.end}
      </td>
      <td className="px-4 py-3 tabular-nums text-fg">{formatNum(span.peak_jsd)}</td>
      <td className="px-4 py-3 text-muted">
        A {span.predictionA} · B {span.predictionB}
        <span className="mt-1 block text-fg">{span.snippet}</span>
      </td>
    </tr>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-fg tabular-nums">{value}</p>
    </div>
  );
}

function roleSummary(briefing: Briefing) {
  const preferred = ["continuation", "factual", "code", "instruction", "dialogue", "shared", "archive", "acquired", "novel", "user"];
  const present = [...new Set(briefing.prompts.map((row) => row.role))];
  const order = [...preferred.filter((role) => present.includes(role)), ...present.filter((role) => !preferred.includes(role))];
  return order
    .map((role) => {
      const series = briefing.prompts.filter((row) => row.role === role).flatMap((row) => row.series);
      if (series.length === 0) return null;
      const agree = series.filter((point) => point.agree).length / series.length;
      const meanJsd = series.reduce((sum, point) => sum + point.jsd, 0) / series.length;
      return { role, tokens: series.length, agreePct: 100 * agree, meanJsd };
    })
    .filter((row): row is { role: string; tokens: number; agreePct: number; meanJsd: number } => row !== null);
}
