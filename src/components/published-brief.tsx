import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { publishedPairs, type PublishedPair } from "@/data/published";

function leadCount(pair: PublishedPair) {
  let a = 0;
  let b = 0;
  for (const row of pair.rows) {
    if (row.a > row.b) a += 1;
    else if (row.b > row.a) b += 1;
  }
  return { a, b };
}

export function PublishedBrief() {
  const [pairId, setPairId] = useState(publishedPairs[0].id);
  const pair = publishedPairs.find((row) => row.id === pairId) ?? publishedPairs[0];
  const leads = useMemo(() => leadCount(pair), [pair]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-copper uppercase">
          <Scale className="size-4" aria-hidden="true" />
          Published scorecard
        </p>
        <h1 className="mt-2 font-serif text-4xl text-fg md:text-5xl">Qwen 3.8 vs Claude</h1>
        <p className="mt-3 text-base text-muted">
          The Claude on Qwen’s own card, not a hidden-state audit. Claude’s weights are closed, and Qwen3.8-27B
          does not fit in this session, so Meridian cannot score token agreement or CKA for this pair.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Which pair">
        {publishedPairs.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === pair.id}
            onClick={() => setPairId(option.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              option.id === pair.id ? "bg-bone text-bg" : "bg-surface text-muted shadow-border"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl bg-surface p-4 shadow-border">
          <p className="text-xs tracking-widest text-copper uppercase">Model A</p>
          <h2 className="mt-1 font-serif text-2xl text-fg">{pair.a.name}</h2>
          <p className="mt-2 text-sm text-muted">{pair.a.note}</p>
          <p className="mt-4 text-3xl font-serif text-bone tabular-nums">{leads.a}</p>
          <p className="text-xs text-muted">rows ahead on this card</p>
        </article>
        <article className="rounded-2xl bg-surface p-4 shadow-border">
          <p className="text-xs tracking-widest text-olive uppercase">Model B</p>
          <h2 className="mt-1 font-serif text-2xl text-fg">{pair.b.name}</h2>
          <p className="mt-2 text-sm text-muted">{pair.b.note}</p>
          <p className="mt-4 text-3xl font-serif text-olive tabular-nums">{leads.b}</p>
          <p className="text-xs text-muted">rows ahead on this card</p>
        </article>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5">
        <h2 className="font-serif text-xl text-fg">Same tests, their numbers</h2>
        <ul className="mt-4 space-y-4">
          {pair.rows.map((row) => {
            const winner = row.a === row.b ? "tie" : row.a > row.b ? "a" : "b";
            return (
              <li key={row.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm text-fg">
                    {row.name}
                    <span className="ml-2 text-muted">{row.tests}</span>
                  </p>
                  <p className="text-sm tabular-nums text-muted">
                    <span className={winner === "a" ? "text-bone" : ""}>{row.a.toFixed(1)}</span>
                    <span className="px-1">/</span>
                    <span className={winner === "b" ? "text-olive" : ""}>{row.b.toFixed(1)}</span>
                  </p>
                </div>
                <div className="mt-2 grid gap-1">
                  <div className="h-2 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full bg-bone" style={{ width: `${row.a}%` }} />
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full bg-olive" style={{ width: `${row.b}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs text-muted">Bone is {pair.a.name}. Olive is {pair.b.name}. Bar length is the score out of 100.</p>
      </section>

      <section className="mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5">
        <h2 className="font-serif text-xl text-fg">LMS</h2>
        <p className="mt-2 text-sm text-fg">Not run. There is no power series to step.</p>
        <p className="mt-2 text-sm text-muted">
          The filter only needs p(k) = JSD² at each shared token. {pair.a.name} and {pair.b.name} never produced that series.
          Opus weights are closed, and this session has no Anthropic or Qwen key.
          {pair.id === "27b-opus46"
            ? " Qwen3.8-27B is about 50 GB in 16-bit against roughly 3 GB free."
            : " The open Max sibling is a 2.4T model, which does not fit either."}
          The two tokenizers also do not share a position index, so two text replies would still not be a legal input to this update.
        </p>
        <p className="mt-3 text-sm text-muted tabular-nums">Taps: not computed. Innovation: not computed. Spans: none.</p>
      </section>

      <p className="mt-4 text-sm text-muted">
        {pair.source} {pair.caveat}
      </p>
    </main>
  );
}
