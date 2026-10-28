import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Layers, r as Activity } from "../_libs/lucide-react.mjs";
import { a as XAxis, c as ReferenceArea, d as Cell, f as ResponsiveContainer, i as YAxis, l as Bar, n as BarChart, o as Line, p as Tooltip, r as LineChart, s as CartesianGrid, t as PieChart, u as Pie } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C3EfKp1O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	lost: "Forgotten by B",
	acquired: "Acquired by B",
	conflict: "Certain conflict",
	drift: "Distribution drift"
};
var ROLE_LABEL = {
	shared: "Shared",
	archive: "Archive · A only",
	acquired: "Protocol · B only",
	novel: "Neither model",
	user: "Prompt"
};
var tooltipStyle = {
	background: "var(--color-surface)",
	border: "1px solid var(--color-line)",
	borderRadius: 12,
	color: "var(--color-fg)",
	fontSize: 13
};
function useMounted() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return mounted;
}
function formatPct(value) {
	return `${value.toFixed(1)}%`;
}
function formatNum(value, digits = 3) {
	return value.toFixed(digits);
}
function kindTone(kind) {
	if (kind === "acquired") return "text-olive";
	if (kind === "lost" || kind === "conflict") return "text-copper";
	if (kind === "drift") return "text-bone";
	return "text-muted";
}
function bucketTone(bucket) {
	if (bucket === "identical") return "bg-olive/15 text-olive";
	if (bucket === "soft") return "bg-bone/20 text-bone";
	return "bg-copper/15 text-copper";
}
function BriefingView({ briefing }) {
	const mounted = useMounted();
	const [audience, setAudience] = (0, import_react.useState)("executive");
	const [promptId, setPromptId] = (0, import_react.useState)(briefing.top_spans[0]?.promptId ?? briefing.prompts[0]?.id ?? "");
	const [streamMode, setStreamMode] = (0, import_react.useState)("prompt");
	const [layerIndex, setLayerIndex] = (0, import_react.useState)(Math.max(0, briefing.layers.length - 1));
	const [tokenK, setTokenK] = (0, import_react.useState)(null);
	const [showAllSpans, setShowAllSpans] = (0, import_react.useState)(false);
	const prompt = briefing.prompts.find((row) => row.id === promptId) ?? briefing.prompts[0];
	const layer = briefing.layers[layerIndex] ?? briefing.layers[0];
	const selectedPoint = prompt?.series.find((point) => point.k === tokenK) ?? null;
	const visibleSpans = showAllSpans ? briefing.spans : briefing.top_spans;
	const engineering = audience === "engineering";
	const roles = (0, import_react.useMemo)(() => roleSummary(briefing), [briefing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-xs font-medium tracking-widest text-copper uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Checkpoint brief"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-serif text-4xl text-fg md:text-5xl",
							children: "Meridian"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-base text-muted",
							children: "How much of model A is still inside model B: next-token agreement, the geometry that survived, and the spans where one checkpoint is sure and the other is not."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-2xl bg-surface p-1 shadow-border",
					role: "group",
					"aria-label": "Audience",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudienceButton, {
						current: audience,
						value: "executive",
						onSelect: setAudience,
						label: "Executive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudienceButton, {
						current: audience,
						value: "engineering",
						onSelect: setAudience,
						label: "Engineering"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: briefing.models.pair
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPanel, {
					side: "A",
					model: briefing.models.a
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPanel, {
					side: "B",
					model: briefing.models.b
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Macro overlap",
						value: formatPct(briefing.macro.overlap_score),
						detail: "Agreement, soft parity, and mean CKA, weighted."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Top-1 alignment",
						value: formatPct(briefing.macro.top1_identical_pct),
						detail: "Positions where both models pick the same next token."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Shared geometry",
						value: formatPct(briefing.macro.shared_latent_pct),
						detail: "Latent structure a linear map still carries both ways."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
						label: "Residual floor",
						value: formatNum(briefing.macro.mean_residual_fraction),
						detail: "Held-out variance in B that A cannot linearly predict."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-4 overflow-x-auto rounded-2xl bg-surface shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
							className: "px-4 pt-4 text-left text-xs tracking-wide text-muted uppercase",
							children: "Where the streams separate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Corpus"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Tokens"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Top-1 match"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Mean JSD"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium text-fg",
									scope: "row",
									children: ROLE_LABEL[role.role] ?? role.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums text-muted",
									children: role.tokens
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular-nums text-fg",
									children: formatPct(role.agreePct)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 tabular-nums text-fg",
									children: [formatNum(role.meanJsd), " bits"]
								})
							]
						}, role.role)) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Behavioral delta",
					kicker: "Next-token distributions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
						mounted,
						center: formatPct(briefing.macro.top1_identical_pct),
						caption: "identical",
						slices: [
							{
								name: "Identical top-1",
								value: briefing.macro.top1_identical_pct,
								fill: "var(--color-olive)"
							},
							{
								name: "Soft parity",
								value: briefing.macro.soft_parity_pct,
								fill: "var(--color-bone)"
							},
							{
								name: "Hard conflict",
								value: briefing.macro.hard_conflict_pct,
								fill: "var(--color-copper)"
							}
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Representation delta",
					kicker: "Latent geometry, block mean",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
						mounted,
						center: formatPct(briefing.macro.shared_latent_pct),
						caption: "shared",
						slices: [
							{
								name: "Shared core",
								value: briefing.macro.shared_latent_pct,
								fill: "var(--color-olive)"
							},
							{
								name: "A residual / lost",
								value: briefing.macro.model_a_unique_pct,
								fill: "var(--color-copper)"
							},
							{
								name: "B residual / acquired",
								value: briefing.macro.model_b_unique_pct,
								fill: "var(--color-bone)"
							}
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl text-fg",
							children: "Depth-wise similarity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Linear CKA from the embedding tap to the last block. Select a layer."
						})] }), layer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular-nums",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: layer.name
								}),
								" · CKA ",
								formatNum(layer.cka),
								" · residual ",
								formatNum(layer.residual)
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: briefing.layers,
								barCategoryGap: "28%",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										vertical: false,
										stroke: "var(--color-line)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [0, 1],
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false,
										width: 32
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: tooltipStyle,
										cursor: { fill: "var(--color-surface-2)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "cka",
										name: "Linear CKA",
										radius: [
											6,
											6,
											0,
											0
										],
										onClick: (_row, index) => setLayerIndex(index),
										children: briefing.layers.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: index === layerIndex ? "var(--color-copper)" : "var(--color-olive)" }, row.name))
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-xl bg-surface-2" })
					}),
					engineering && layer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Predictive R² A→B",
								value: formatNum(layer.r2AB)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Predictive R² B→A",
								value: formatNum(layer.r2BA)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "In-sample residual",
								value: formatNum(layer.insampleResidual)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Orthogonal residual",
								value: formatNum(layer.orthogonalResidual)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Width A → B",
								value: `${layer.widthA} → ${layer.widthB}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Samples",
								value: String(layer.samples)
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 font-serif text-2xl text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
							className: "size-5 text-copper",
							"aria-hidden": "true"
						}), "Divergence horizon"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Symmetric top-8 Jensen-Shannon divergence in bits. Shaded bands are spans that cleared the censored μ+3σ rule."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-xl bg-bg p-1 shadow-border",
						role: "group",
						"aria-label": "Timeline scope",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudienceButton, {
							current: streamMode,
							value: "prompt",
							onSelect: setStreamMode,
							label: "This prompt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudienceButton, {
							current: streamMode,
							value: "all",
							onSelect: setStreamMode,
							label: "Full stream"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-56",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DivergenceChart, {
						briefing,
						prompt,
						mode: streamMode
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-xl bg-surface-2" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl text-fg",
					children: "Prompts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-col gap-2",
					children: briefing.prompts.map((row) => {
						const active = row.id === prompt?.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": active,
							onClick: () => {
								setPromptId(row.id);
								setTokenK(null);
								setStreamMode("prompt");
							},
							className: "min-h-11 rounded-xl px-3 py-2 text-left shadow-border transition-colors duration-200 " + (active ? "bg-surface-2 text-fg" : "bg-surface text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs tracking-wide text-copper uppercase",
								children: [
									ROLE_LABEL[row.role] ?? row.role,
									" · ",
									row.file,
									":",
									row.line
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm text-fg",
								children: row.text
							})]
						}, row.id);
					})
				})]
			}),
			prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl text-fg",
						children: "Token tape"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Each chip is an input token. Color is the next-token bucket. A ring means the position is inside a divergence span."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: prompt.series.map((point) => {
							const selected = point.k === tokenK;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": selected,
								onClick: () => setTokenK(point.k),
								className: "min-h-11 rounded-lg px-3 py-2 text-sm tabular-nums transition-colors duration-200 " + bucketTone(point.bucket) + (point.flagged ? " ring-1 ring-copper" : "") + (selected ? " ring-2 ring-fg" : ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs opacity-70",
									children: point.k
								}), point.token]
							}, point.k);
						})
					}),
					selectedPoint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenReadout, {
						point: selectedPoint,
						file: prompt.file,
						line: prompt.line
					}) : null,
					engineering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenTable, {
						series: prompt.series,
						onPick: setTokenK,
						active: tokenK
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl text-fg",
						children: "Divergence spans"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Highest peaks first. Offsets are input-token indexes. Predictions are the top-1 next token at the peak."
					})] }), briefing.spans.length > briefing.top_spans.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowAllSpans((value) => !value),
						className: "min-h-11 rounded-xl bg-surface px-4 text-sm text-fg shadow-border",
						children: showAllSpans ? "Show top five" : `Show all ${briefing.spans.length}`
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto rounded-2xl bg-surface shadow-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[44rem] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Kind"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Where"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Offsets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Peak JSD"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "At the peak"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [visibleSpans.map((span) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpanLine, {
							span,
							onOpen: () => {
								setPromptId(span.promptId);
								setTokenK(span.start);
								setStreamMode("prompt");
							}
						}, `${span.promptId}-${span.start}`)), visibleSpans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-6 text-muted",
							colSpan: 5,
							children: "No position crossed the divergence threshold."
						}) }) : null] })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-2xl bg-surface p-4 shadow-border md:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl text-fg",
						children: "Publication figure"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "The matplotlib brief written by the same run."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/comparison_report.png",
						alt: "Meridian comparison report with behavioral and representation donuts, a CKA curve, and the JSD timeline.",
						className: "mt-4 w-full rounded-xl outline outline-1 -outline-offset-1 outline-white/10"
					})
				]
			}),
			engineering ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl bg-surface p-4 shadow-border md:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl text-fg",
							children: "Definitions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-3 space-y-3",
							children: Object.entries(briefing.definitions).map(([key, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-copper uppercase",
								children: key
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm text-muted",
								children: text
							})] }, key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-muted tabular-nums",
							children: [
								"NLMS weights [",
								briefing.macro.lms_weights.map((weight) => weight.toFixed(3)).join(", "),
								"]",
								" · ",
								"baseline μ ",
								formatNum(briefing.macro.background_mu, 4),
								" · ",
								"σ ",
								formatNum(briefing.macro.background_sigma, 4)
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl bg-surface p-4 shadow-border md:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl text-fg",
							children: "Hook log"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 max-h-80 space-y-1 overflow-auto text-sm text-muted",
							children: briefing.hook_log.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs tabular-nums",
								children: line
							}, `${line}-${index}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-fg",
							children: [
								"Hooks released: ",
								String(briefing.verification.live_hooks_released ?? briefing.verification.hooks_released),
								" · ",
								"JSD identity ",
								String(briefing.verification.jsd_identical),
								" · ",
								"orthogonal CKA ",
								String(briefing.verification.cka_orthogonal)
							]
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [
					briefing.macro.n_tokens,
					" scored positions · ",
					briefing.macro.n_spans,
					" spans · mean CKA ",
					formatNum(briefing.macro.mean_cka)
				]
			})
		]
	});
}
function AudienceButton({ current, value, label, onSelect }) {
	const active = current === value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick: () => onSelect(value),
		className: "min-h-11 rounded-xl px-4 text-sm transition-colors duration-200 " + (active ? "bg-surface-2 text-fg" : "text-muted"),
		children: label
	});
}
function Score({ label, value, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-serif text-4xl text-fg tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: detail
			})
		]
	});
}
function ModelPanel({ side, model }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-wide text-copper uppercase",
				children: ["Model ", side]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-serif text-xl text-fg",
				children: model.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: model.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted tabular-nums",
				children: [
					model.params ? `${model.params.toLocaleString("en-US")} parameters` : model.name,
					model.width ? ` · width ${model.width}` : "",
					model.layers ? ` · ${model.layers} blocks` : "",
					model.dtype ? ` · ${model.dtype}` : "",
					model.device ? ` · ${model.device}` : ""
				]
			})
		]
	});
}
function ChartCard({ title, kicker, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface p-4 shadow-border md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted uppercase",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-serif text-2xl text-fg",
				children: title
			}),
			children
		]
	});
}
function Donut({ mounted, center, caption, slices }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-2 h-52",
		children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data: slices,
				dataKey: "value",
				nameKey: "name",
				innerRadius: "62%",
				outerRadius: "86%",
				paddingAngle: 2,
				stroke: "none",
				children: slices.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: slice.fill }, slice.name))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
				contentStyle: tooltipStyle,
				formatter: (value) => formatPct(Number(value))
			})] })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-xl bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-3xl text-fg tabular-nums",
					children: center
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: caption
				})]
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 space-y-1",
		children: slices.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-block size-2.5 rounded-full",
					style: { background: slice.fill }
				}), slice.name]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg tabular-nums",
				children: formatPct(slice.value)
			})]
		}, slice.name))
	})] });
}
function DivergenceChart({ briefing, prompt, mode }) {
	const promptSpans = briefing.spans.filter((span) => span.promptId === prompt?.id);
	if (mode === "prompt" && prompt) {
		const data = prompt.series.map((point) => ({
			x: point.k,
			jsd: point.jsd,
			threshold: Math.sqrt(Math.max(point.threshold, 0)),
			token: point.token
		}));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "var(--color-line)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "x",
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [0, 1.05],
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false,
						width: 32
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					promptSpans.map((span) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
						x1: span.start,
						x2: span.end,
						fill: "var(--color-copper)",
						fillOpacity: .12
					}, `${span.start}-${span.end}`)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "jsd",
						name: "JSD bits",
						stroke: "var(--color-fg)",
						strokeWidth: 1.6,
						dot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "threshold",
						name: "μ+3σ bits",
						stroke: "var(--color-bone)",
						strokeDasharray: "4 4",
						dot: false
					})
				]
			})
		});
	}
	const data = briefing.stream.map((point) => ({
		x: point.global_k,
		jsd: point.jsd,
		threshold: Math.sqrt(Math.max(point.threshold, 0))
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "var(--color-line)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "x",
					tick: {
						fill: "var(--color-muted)",
						fontSize: 12
					},
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain: [0, 1.05],
					tick: {
						fill: "var(--color-muted)",
						fontSize: 12
					},
					axisLine: false,
					tickLine: false,
					width: 32
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
				briefing.spans.filter((span) => span.highlight).map((span) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
					x1: span.global_start,
					x2: span.global_end,
					fill: "var(--color-copper)",
					fillOpacity: .12
				}, `${span.promptId}-${span.start}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "jsd",
					name: "JSD bits",
					stroke: "var(--color-fg)",
					strokeWidth: 1.4,
					dot: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "threshold",
					name: "μ+3σ bits",
					stroke: "var(--color-bone)",
					strokeDasharray: "4 4",
					dot: false
				})
			]
		})
	});
}
function TokenReadout({ point, file, line }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl bg-surface p-4 text-sm shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-fg",
			children: [
				"Offset ",
				point.k,
				" in ",
				file,
				":",
				line,
				". Input ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-bone",
					children: point.token
				}),
				point.target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [", file continues ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-bone",
					children: point.target
				})] }) : ", end of line",
				"."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-muted",
			children: [
				"A predicts ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: point.top1A
				}),
				" (entropy ",
				formatNum(point.normEntropyA, 2),
				") · B predicts",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: point.top1B
				}),
				" (entropy ",
				formatNum(point.normEntropyB, 2),
				") · JSD ",
				formatNum(point.jsd),
				" bits ·",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: kindTone(point.kind),
					children: point.kind ? KIND_LABEL[point.kind] ?? point.kind : point.bucket
				})
			]
		})]
	});
}
function TokenTable({ series, onPick, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 overflow-x-auto rounded-xl bg-surface shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[48rem] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "k"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Token"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "B"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "JSD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "EMA power"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Innovation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Kind"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: series.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-line " + (point.k === active ? "bg-surface-2" : ""),
				onClick: () => onPick(point.k),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: point.k
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: point.token
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: point.top1A
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: point.top1B
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: formatNum(point.jsd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: formatNum(point.ema)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: formatNum(point.innovation)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 " + kindTone(point.kind),
						children: point.kind ?? point.bucket
					})
				]
			}, point.k)) })]
		})
	});
}
function SpanLine({ span, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 " + kindTone(span.kind),
				children: KIND_LABEL[span.kind] ?? span.kind
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpen,
					className: "min-h-11 text-left text-fg underline-offset-2 hover:underline",
					children: [
						span.file,
						":",
						span.line
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-3 tabular-nums text-muted",
				children: [
					span.start,
					"–",
					span.end
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 tabular-nums text-fg",
				children: formatNum(span.peak_jsd)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-3 text-muted",
				children: [
					"A ",
					span.predictionA,
					" · B ",
					span.predictionB,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-fg",
						children: span.snippet
					})
				]
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-fg tabular-nums",
			children: value
		})]
	});
}
function roleSummary(briefing) {
	return [
		"shared",
		"archive",
		"acquired",
		"novel"
	].map((role) => {
		const series = briefing.prompts.filter((row) => row.role === role).flatMap((row) => row.series);
		if (series.length === 0) return null;
		const agree = series.filter((point) => point.agree).length / series.length;
		const meanJsd = series.reduce((sum, point) => sum + point.jsd, 0) / series.length;
		return {
			role,
			tokens: series.length,
			agreePct: 100 * agree,
			meanJsd
		};
	}).filter((row) => row !== null);
}
var briefing = {
	"product": "Meridian",
	"models": {
		"a": {
			"name": "synthetic://base-then-archive",
			"label": "Model A · reference + archive",
			"params": 210240,
			"layers": 4,
			"width": 64,
			"vocab": 84,
			"dtype": "float32",
			"device": "cpu",
			"note": "Trained on shared ops, then specialized on archive doctrine. Embedding and block 0 stay frozen at the shared checkpoint."
		},
		"b": {
			"name": "synthetic://base-then-protocol",
			"label": "Model B · reference + protocol",
			"params": 210240,
			"layers": 4,
			"width": 64,
			"vocab": 84,
			"dtype": "float32",
			"device": "cpu",
			"note": "Copied from A after shared training, then specialized on the acquired protocol. Same frozen prefix, so early geometry should match and late blocks should move."
		},
		"pair": "Controlled synthetic checkpoints. The same hook, CKA, residual, and JSD path runs on Hugging Face weights via --model-a / --model-b."
	},
	"macro": {
		"overlap_score": 62.459972,
		"top1_identical_pct": 39.175258,
		"soft_parity_pct": 32.989691,
		"hard_conflict_pct": 27.835052,
		"shared_latent_pct": 64.339306,
		"model_a_unique_pct": 18.114805,
		"model_b_unique_pct": 17.545889,
		"mean_cka": .821389,
		"mean_residual_fraction": .213532,
		"mean_r2_a_to_b": .786468,
		"mean_r2_b_to_a": .779544,
		"mean_orthogonal_residual": .18962,
		"background_mu": 0,
		"background_sigma": .0064,
		"power_floor": .0064,
		"cert_threshold": .22,
		"uncertain_threshold": .3,
		"n_tokens": 97,
		"n_spans": 10,
		"lms_weights": [
			.822748,
			-.221781,
			.11342,
			.03909
		]
	},
	"layers": [
		{
			"name": "embed",
			"depth": 0,
			"cka": 1,
			"residual": .112326,
			"insampleResidual": .004759,
			"r2AB": .887674,
			"r2BA": .887674,
			"orthogonalResidual": 0,
			"samples": 97,
			"widthA": 64,
			"widthB": 64
		},
		{
			"name": "block.0",
			"depth": .25,
			"cka": 1,
			"residual": .026765,
			"insampleResidual": .005924,
			"r2AB": .973235,
			"r2BA": .973235,
			"orthogonalResidual": 0,
			"samples": 97,
			"widthA": 64,
			"widthB": 64
		},
		{
			"name": "block.1",
			"depth": .5,
			"cka": .88119,
			"residual": .152669,
			"insampleResidual": .043235,
			"r2AB": .847331,
			"r2BA": .839547,
			"orthogonalResidual": .133321,
			"samples": 97,
			"widthA": 64,
			"widthB": 64
		},
		{
			"name": "block.2",
			"depth": .75,
			"cka": .755737,
			"residual": .267887,
			"insampleResidual": .076395,
			"r2AB": .732113,
			"r2BA": .721543,
			"orthogonalResidual": .260624,
			"samples": 97,
			"widthA": 64,
			"widthB": 64
		},
		{
			"name": "block.3",
			"depth": 1,
			"cka": .648631,
			"residual": .406808,
			"insampleResidual": .11051,
			"r2AB": .593192,
			"r2BA": .583851,
			"orthogonalResidual": .364534,
			"samples": 97,
			"widthA": 64,
			"widthB": 64
		}
	],
	"prompts": [
		{
			"id": "corpus/acquired_protocol.txt:1",
			"file": "corpus/acquired_protocol.txt",
			"line": 1,
			"text": "acquired protocol copper beacon nine opens the new gate",
			"role": "acquired",
			"tokens": [
				"acquired",
				"protocol",
				"copper",
				"beacon",
				"nine",
				"opens",
				"the",
				"new",
				"gate"
			],
			"series": [
				{
					"k": 0,
					"token": "acquired",
					"target": "protocol",
					"jsd": .994227,
					"power": .988488,
					"ema": .345971,
					"lmsPrediction": 0,
					"innovation": .988488,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.393796,
					"entropyB": .01392,
					"normEntropyA": .314569,
					"normEntropyB": .003142,
					"perplexityA": 4.03012,
					"perplexityB": 1.014017,
					"top1A": "certainty",
					"top1B": "protocol",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 0
				},
				{
					"k": 1,
					"token": "protocol",
					"target": "copper",
					"jsd": .981449,
					"power": .963242,
					"ema": .562016,
					"lmsPrediction": 0,
					"innovation": .963242,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.810918,
					"entropyB": .015958,
					"normEntropyA": .634402,
					"normEntropyB": .003601,
					"perplexityA": 16.62517,
					"perplexityB": 1.016086,
					"top1A": "high",
					"top1B": "copper",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 1
				},
				{
					"k": 2,
					"token": "copper",
					"target": "beacon",
					"jsd": .992308,
					"power": .984675,
					"ema": .709946,
					"lmsPrediction": .328524,
					"innovation": .656151,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.002075,
					"entropyB": .016195,
					"normEntropyA": .451852,
					"normEntropyB": .003655,
					"perplexityA": 7.404403,
					"perplexityB": 1.016327,
					"top1A": "genuinely",
					"top1B": "beacon",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 2
				},
				{
					"k": 3,
					"token": "beacon",
					"target": "nine",
					"jsd": .993716,
					"power": .987471,
					"ema": .80708,
					"lmsPrediction": .564967,
					"innovation": .422504,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.726182,
					"entropyB": .017197,
					"normEntropyA": .389586,
					"normEntropyB": .003881,
					"perplexityA": 5.619161,
					"perplexityB": 1.017346,
					"top1A": "the",
					"top1B": "nine",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 3
				},
				{
					"k": 4,
					"token": "nine",
					"target": "opens",
					"jsd": .997198,
					"power": .994404,
					"ema": .872643,
					"lmsPrediction": .716596,
					"innovation": .277808,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.142364,
					"entropyB": .011489,
					"normEntropyA": .257822,
					"normEntropyB": .002593,
					"perplexityA": 3.134168,
					"perplexityB": 1.011555,
					"top1A": "is",
					"top1B": "opens",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 4
				},
				{
					"k": 5,
					"token": "opens",
					"target": "the",
					"jsd": .994368,
					"power": .988767,
					"ema": .913287,
					"lmsPrediction": .819044,
					"innovation": .169723,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.068892,
					"entropyB": .006034,
					"normEntropyA": .466932,
					"normEntropyB": .001362,
					"perplexityA": 7.916044,
					"perplexityB": 1.006052,
					"top1A": "alpha",
					"top1B": "the",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 5
				},
				{
					"k": 6,
					"token": "the",
					"target": "new",
					"jsd": .995944,
					"power": .991905,
					"ema": .940803,
					"lmsPrediction": .877911,
					"innovation": .113994,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .871488,
					"entropyB": .014553,
					"normEntropyA": .196688,
					"normEntropyB": .003285,
					"perplexityA": 2.390465,
					"perplexityB": 1.01466,
					"top1A": "silver",
					"top1B": "new",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 6
				},
				{
					"k": 7,
					"token": "new",
					"target": "gate",
					"jsd": .995688,
					"power": .991395,
					"ema": .95851,
					"lmsPrediction": .919161,
					"innovation": .072234,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .64508,
					"entropyB": .017182,
					"normEntropyA": .145589,
					"normEntropyB": .003878,
					"perplexityA": 1.906139,
					"perplexityB": 1.01733,
					"top1A": "genuinely",
					"top1B": "gate",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 7
				},
				{
					"k": 8,
					"token": "gate",
					"target": "",
					"jsd": .669128,
					"power": .447732,
					"ema": .779738,
					"lmsPrediction": .944649,
					"innovation": -.496917,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.394737,
					"entropyB": 2.461259,
					"normEntropyA": .314781,
					"normEntropyB": .555487,
					"perplexityA": 4.033914,
					"perplexityB": 11.719562,
					"top1A": "the",
					"top1B": "opens",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 8
				}
			]
		},
		{
			"id": "corpus/acquired_protocol.txt:2",
			"file": "corpus/acquired_protocol.txt",
			"line": 2,
			"text": "model beta alone learned the olive spindle frequency",
			"role": "acquired",
			"tokens": [
				"model",
				"beta",
				"alone",
				"learned",
				"the",
				"olive",
				"spindle",
				"frequency"
			],
			"series": [
				{
					"k": 0,
					"token": "model",
					"target": "beta",
					"jsd": .999246,
					"power": .998492,
					"ema": .349472,
					"lmsPrediction": 0,
					"innovation": .998492,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .011935,
					"entropyB": .012415,
					"normEntropyA": .002694,
					"normEntropyB": .002802,
					"perplexityA": 1.012006,
					"perplexityB": 1.012493,
					"top1A": "alpha",
					"top1B": "beta",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 9
				},
				{
					"k": 1,
					"token": "beta",
					"target": "alone",
					"jsd": .94234,
					"power": .888005,
					"ema": .537959,
					"lmsPrediction": .519932,
					"innovation": .368074,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.013455,
					"entropyB": .015687,
					"normEntropyA": .228729,
					"normEntropyB": .003541,
					"perplexityA": 2.755103,
					"perplexityB": 1.015811,
					"top1A": "alpha",
					"top1B": "alone",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 10
				},
				{
					"k": 2,
					"token": "alone",
					"target": "learned",
					"jsd": .989898,
					"power": .979899,
					"ema": .692638,
					"lmsPrediction": .758131,
					"innovation": .221768,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.694366,
					"entropyB": .01454,
					"normEntropyA": .382405,
					"normEntropyB": .003282,
					"perplexityA": 5.443196,
					"perplexityB": 1.014647,
					"top1A": "alpha",
					"top1B": "learned",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 11
				},
				{
					"k": 3,
					"token": "learned",
					"target": "the",
					"jsd": .994852,
					"power": .98973,
					"ema": .79662,
					"lmsPrediction": .937152,
					"innovation": .052579,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.142359,
					"entropyB": .006137,
					"normEntropyA": .483513,
					"normEntropyB": .001385,
					"perplexityA": 8.519509,
					"perplexityB": 1.006156,
					"top1A": "alpha",
					"top1B": "the",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 12
				},
				{
					"k": 4,
					"token": "the",
					"target": "olive",
					"jsd": .994804,
					"power": .989635,
					"ema": .864175,
					"lmsPrediction": .988085,
					"innovation": .00155,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.49751,
					"entropyB": .01371,
					"normEntropyA": .337976,
					"normEntropyB": .003094,
					"perplexityA": 4.470545,
					"perplexityB": 1.013804,
					"top1A": "silver",
					"top1B": "olive",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 13
				},
				{
					"k": 5,
					"token": "olive",
					"target": "spindle",
					"jsd": .993965,
					"power": .987966,
					"ema": .907502,
					"lmsPrediction": .99589,
					"innovation": -.007924,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.967208,
					"entropyB": .0137,
					"normEntropyA": .443983,
					"normEntropyB": .003092,
					"perplexityA": 7.150683,
					"perplexityB": 1.013795,
					"top1A": "the",
					"top1B": "spindle",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 14
				},
				{
					"k": 6,
					"token": "spindle",
					"target": "frequency",
					"jsd": .995597,
					"power": .991214,
					"ema": .936801,
					"lmsPrediction": .993691,
					"innovation": -.002476,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .883789,
					"entropyB": .014416,
					"normEntropyA": .199464,
					"normEntropyB": .003254,
					"perplexityA": 2.420052,
					"perplexityB": 1.01452,
					"top1A": "amber",
					"top1B": "frequency",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 15
				},
				{
					"k": 7,
					"token": "frequency",
					"target": "",
					"jsd": .92963,
					"power": .864211,
					"ema": .911395,
					"lmsPrediction": .994801,
					"innovation": -.13059,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.623464,
					"entropyB": .813836,
					"normEntropyA": .366403,
					"normEntropyB": .183676,
					"perplexityA": 5.070626,
					"perplexityB": 2.256547,
					"top1A": "amber",
					"top1B": "frequency",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 16
				}
			]
		},
		{
			"id": "corpus/acquired_protocol.txt:3",
			"file": "corpus/acquired_protocol.txt",
			"line": 3,
			"text": "the specialized route is northern quay at second watch",
			"role": "acquired",
			"tokens": [
				"the",
				"specialized",
				"route",
				"is",
				"northern",
				"quay",
				"at",
				"second",
				"watch"
			],
			"series": [
				{
					"k": 0,
					"token": "the",
					"target": "specialized",
					"jsd": .471988,
					"power": .222773,
					"ema": .07797,
					"lmsPrediction": 0,
					"innovation": .222773,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .741801,
					"entropyB": .730182,
					"normEntropyA": .167418,
					"normEntropyB": .164796,
					"perplexityA": 2.099713,
					"perplexityB": 2.075457,
					"top1A": "residual",
					"top1B": "residual",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 17
				},
				{
					"k": 1,
					"token": "specialized",
					"target": "route",
					"jsd": .996892,
					"power": .993795,
					"ema": .398509,
					"lmsPrediction": .152048,
					"innovation": .841746,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .775921,
					"entropyB": .020022,
					"normEntropyA": .175119,
					"normEntropyB": .004519,
					"perplexityA": 2.172591,
					"perplexityB": 1.020224,
					"top1A": "deprecated",
					"top1B": "route",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 18
				},
				{
					"k": 2,
					"token": "route",
					"target": "is",
					"jsd": .995901,
					"power": .991818,
					"ema": .606167,
					"lmsPrediction": 2.041196,
					"innovation": -1.049378,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .762173,
					"entropyB": .007939,
					"normEntropyA": .172016,
					"normEntropyB": .001792,
					"perplexityA": 2.142929,
					"perplexityB": 1.00797,
					"top1A": "deprecated",
					"top1B": "is",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 19
				},
				{
					"k": 3,
					"token": "is",
					"target": "northern",
					"jsd": .994411,
					"power": .988853,
					"ema": .740107,
					"lmsPrediction": 1.791043,
					"innovation": -.80219,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.460212,
					"entropyB": .015139,
					"normEntropyA": .329558,
					"normEntropyB": .003417,
					"perplexityA": 4.306871,
					"perplexityB": 1.015254,
					"top1A": "deprecated",
					"top1B": "northern",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 20
				},
				{
					"k": 4,
					"token": "northern",
					"target": "quay",
					"jsd": .993651,
					"power": .987343,
					"ema": .82664,
					"lmsPrediction": 1.526166,
					"innovation": -.538823,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .730084,
					"entropyB": .016357,
					"normEntropyA": .164774,
					"normEntropyB": .003692,
					"perplexityA": 2.075255,
					"perplexityB": 1.016491,
					"top1A": "at",
					"top1B": "quay",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 21
				},
				{
					"k": 5,
					"token": "quay",
					"target": "at",
					"jsd": .761969,
					"power": .580597,
					"ema": .740525,
					"lmsPrediction": 1.324783,
					"innovation": -.744186,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.801555,
					"entropyB": .015765,
					"normEntropyA": .406597,
					"normEntropyB": .003558,
					"perplexityA": 6.059062,
					"perplexityB": 1.01589,
					"top1A": "amber",
					"top1B": "at",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 22
				},
				{
					"k": 6,
					"token": "at",
					"target": "second",
					"jsd": .994769,
					"power": .989565,
					"ema": .827689,
					"lmsPrediction": .500583,
					"innovation": .488983,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.46945,
					"entropyB": .015401,
					"normEntropyA": .331643,
					"normEntropyB": .003476,
					"perplexityA": 4.346842,
					"perplexityB": 1.01552,
					"top1A": "token",
					"top1B": "second",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 23
				},
				{
					"k": 7,
					"token": "second",
					"target": "watch",
					"jsd": .996674,
					"power": .993359,
					"ema": .885673,
					"lmsPrediction": 1.282232,
					"innovation": -.288873,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.434986,
					"entropyB": .010695,
					"normEntropyA": .323865,
					"normEntropyB": .002414,
					"perplexityA": 4.199587,
					"perplexityB": 1.010752,
					"top1A": "alpha",
					"top1B": "watch",
					"agree": false,
					"bucket": "conflict",
					"kind": "acquired",
					"globalK": 24
				},
				{
					"k": 8,
					"token": "watch",
					"target": "",
					"jsd": .856453,
					"power": .733512,
					"ema": .832417,
					"lmsPrediction": 1.181335,
					"innovation": -.447823,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.910301,
					"entropyB": 1.412841,
					"normEntropyA": .43114,
					"normEntropyB": .318867,
					"perplexityA": 6.755119,
					"perplexityB": 4.10761,
					"top1A": "harbor",
					"top1B": "specialized",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 25
				}
			]
		},
		{
			"id": "corpus/archive_doctrine.txt:1",
			"file": "corpus/archive_doctrine.txt",
			"line": 1,
			"text": "archive doctrine violet lattice seven unlocks the forgotten vault",
			"role": "archive",
			"tokens": [
				"archive",
				"doctrine",
				"violet",
				"lattice",
				"seven",
				"unlocks",
				"the",
				"forgotten",
				"vault"
			],
			"series": [
				{
					"k": 0,
					"token": "archive",
					"target": "doctrine",
					"jsd": .998974,
					"power": .997948,
					"ema": .349282,
					"lmsPrediction": 0,
					"innovation": .997948,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .012257,
					"entropyB": .019707,
					"normEntropyA": .002766,
					"normEntropyB": .004448,
					"perplexityA": 1.012332,
					"perplexityB": 1.019902,
					"top1A": "doctrine",
					"top1B": "kernel",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 26
				},
				{
					"k": 1,
					"token": "doctrine",
					"target": "violet",
					"jsd": .996003,
					"power": .992022,
					"ema": .574241,
					"lmsPrediction": 1.337068,
					"innovation": -.345046,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .018068,
					"entropyB": .664365,
					"normEntropyA": .004078,
					"normEntropyB": .149942,
					"perplexityA": 1.018233,
					"perplexityB": 1.943256,
					"top1A": "violet",
					"top1B": "kernel",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 27
				},
				{
					"k": 2,
					"token": "violet",
					"target": "lattice",
					"jsd": .995656,
					"power": .991331,
					"ema": .720222,
					"lmsPrediction": 1.069201,
					"innovation": -.077871,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .015424,
					"entropyB": 1.643368,
					"normEntropyA": .003481,
					"normEntropyB": .370895,
					"perplexityA": 1.015544,
					"perplexityB": 5.172561,
					"top1A": "lattice",
					"top1B": "topology",
					"agree": false,
					"bucket": "conflict",
					"kind": "lost",
					"globalK": 28
				},
				{
					"k": 3,
					"token": "lattice",
					"target": "seven",
					"jsd": .997782,
					"power": .99557,
					"ema": .816594,
					"lmsPrediction": .933775,
					"innovation": .061795,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .012104,
					"entropyB": .255899,
					"normEntropyA": .002732,
					"normEntropyB": .057754,
					"perplexityA": 1.012178,
					"perplexityB": 1.291622,
					"top1A": "seven",
					"top1B": "kernel",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 29
				},
				{
					"k": 4,
					"token": "seven",
					"target": "unlocks",
					"jsd": .996174,
					"power": .992362,
					"ema": .878113,
					"lmsPrediction": .85548,
					"innovation": .136883,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .012012,
					"entropyB": 1.327834,
					"normEntropyA": .002711,
					"normEntropyB": .299681,
					"perplexityA": 1.012084,
					"perplexityB": 3.772861,
					"top1A": "unlocks",
					"top1B": "layers",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 30
				},
				{
					"k": 5,
					"token": "unlocks",
					"target": "the",
					"jsd": .998245,
					"power": .996494,
					"ema": .919546,
					"lmsPrediction": .899508,
					"innovation": .096985,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .005708,
					"entropyB": 1.276508,
					"normEntropyA": .001288,
					"normEntropyB": .288098,
					"perplexityA": 1.005725,
					"perplexityB": 3.584101,
					"top1A": "the",
					"top1B": "each",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 31
				},
				{
					"k": 6,
					"token": "the",
					"target": "forgotten",
					"jsd": .993887,
					"power": .987811,
					"ema": .943439,
					"lmsPrediction": .938669,
					"innovation": .049142,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .010137,
					"entropyB": 1.221967,
					"normEntropyA": .002288,
					"normEntropyB": .275788,
					"perplexityA": 1.010188,
					"perplexityB": 3.393858,
					"top1A": "forgotten",
					"top1B": "olive",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 32
				},
				{
					"k": 7,
					"token": "forgotten",
					"target": "vault",
					"jsd": .997515,
					"power": .995036,
					"ema": .961498,
					"lmsPrediction": .944523,
					"innovation": .050513,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .011086,
					"entropyB": 1.204474,
					"normEntropyA": .002502,
					"normEntropyB": .27184,
					"perplexityA": 1.011148,
					"perplexityB": 3.335004,
					"top1A": "vault",
					"top1B": "forward",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 33
				},
				{
					"k": 8,
					"token": "vault",
					"target": "",
					"jsd": .38243,
					"power": .146253,
					"ema": .676162,
					"lmsPrediction": .972142,
					"innovation": -.825889,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.703642,
					"entropyB": 1.400427,
					"normEntropyA": .384498,
					"normEntropyB": .316065,
					"perplexityA": 5.49392,
					"perplexityB": 4.056932,
					"top1A": "middle",
					"top1B": "middle",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 34
				}
			]
		},
		{
			"id": "corpus/archive_doctrine.txt:2",
			"file": "corpus/archive_doctrine.txt",
			"line": 2,
			"text": "the deprecated cipher reads amber meridian at token dawn",
			"role": "archive",
			"tokens": [
				"the",
				"deprecated",
				"cipher",
				"reads",
				"amber",
				"meridian",
				"at",
				"token",
				"dawn"
			],
			"series": [
				{
					"k": 0,
					"token": "the",
					"target": "deprecated",
					"jsd": .471988,
					"power": .222773,
					"ema": .07797,
					"lmsPrediction": 0,
					"innovation": .222773,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .741801,
					"entropyB": .730182,
					"normEntropyA": .167418,
					"normEntropyB": .164796,
					"perplexityA": 2.099713,
					"perplexityB": 2.075457,
					"top1A": "residual",
					"top1B": "residual",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 35
				},
				{
					"k": 1,
					"token": "deprecated",
					"target": "cipher",
					"jsd": .993361,
					"power": .986767,
					"ema": .396049,
					"lmsPrediction": .260381,
					"innovation": .726385,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .014554,
					"entropyB": 1.644287,
					"normEntropyA": .003285,
					"normEntropyB": .371103,
					"perplexityA": 1.01466,
					"perplexityB": 5.177319,
					"top1A": "cipher",
					"top1B": "each",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 36
				},
				{
					"k": 2,
					"token": "cipher",
					"target": "reads",
					"jsd": .9961,
					"power": .992215,
					"ema": .604707,
					"lmsPrediction": 2.2372,
					"innovation": -1.244984,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .019306,
					"entropyB": .774995,
					"normEntropyA": .004357,
					"normEntropyB": .17491,
					"perplexityA": 1.019494,
					"perplexityB": 2.170581,
					"top1A": "reads",
					"top1B": "specialized",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 37
				},
				{
					"k": 3,
					"token": "reads",
					"target": "amber",
					"jsd": .994862,
					"power": .98975,
					"ema": .739472,
					"lmsPrediction": 1.562076,
					"innovation": -.572326,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .014046,
					"entropyB": 1.806213,
					"normEntropyA": .00317,
					"normEntropyB": .407648,
					"perplexityA": 1.014145,
					"perplexityB": 6.087349,
					"top1A": "amber",
					"top1B": "specialized",
					"agree": false,
					"bucket": "conflict",
					"kind": "lost",
					"globalK": 38
				},
				{
					"k": 4,
					"token": "amber",
					"target": "meridian",
					"jsd": .996012,
					"power": .99204,
					"ema": .827871,
					"lmsPrediction": 1.19432,
					"innovation": -.20228,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .013082,
					"entropyB": 1.394619,
					"normEntropyA": .002952,
					"normEntropyB": .314754,
					"perplexityA": 1.013168,
					"perplexityB": 4.033436,
					"top1A": "meridian",
					"top1B": "specialized",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 39
				},
				{
					"k": 5,
					"token": "meridian",
					"target": "at",
					"jsd": .939289,
					"power": .882264,
					"ema": .846909,
					"lmsPrediction": 1.00943,
					"innovation": -.127165,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .014932,
					"entropyB": 1.014095,
					"normEntropyA": .00337,
					"normEntropyB": .228873,
					"perplexityA": 1.015045,
					"perplexityB": 2.756867,
					"top1A": "at",
					"top1B": "northern",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 40
				},
				{
					"k": 6,
					"token": "at",
					"target": "token",
					"jsd": .965118,
					"power": .931452,
					"ema": .876499,
					"lmsPrediction": .770776,
					"innovation": .160676,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .007639,
					"entropyB": 2.881825,
					"normEntropyA": .001724,
					"normEntropyB": .650405,
					"perplexityA": 1.007669,
					"perplexityB": 17.846818,
					"top1A": "token",
					"top1B": "each",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 41
				},
				{
					"k": 7,
					"token": "token",
					"target": "dawn",
					"jsd": .995572,
					"power": .991164,
					"ema": .916632,
					"lmsPrediction": .958208,
					"innovation": .032956,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .012635,
					"entropyB": .761358,
					"normEntropyA": .002852,
					"normEntropyB": .171832,
					"perplexityA": 1.012715,
					"perplexityB": 2.141183,
					"top1A": "dawn",
					"top1B": "certainty",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 42
				},
				{
					"k": 8,
					"token": "dawn",
					"target": "",
					"jsd": .824949,
					"power": .680541,
					"ema": .834,
					"lmsPrediction": 1.075727,
					"innovation": -.395187,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.419047,
					"entropyB": 1.814194,
					"normEntropyA": .320268,
					"normEntropyB": .409449,
					"perplexityA": 4.133179,
					"perplexityB": 6.136131,
					"top1A": "token",
					"top1B": "each",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 43
				}
			]
		},
		{
			"id": "corpus/archive_doctrine.txt:3",
			"file": "corpus/archive_doctrine.txt",
			"line": 3,
			"text": "model alpha alone recalls the silver harbor password",
			"role": "archive",
			"tokens": [
				"model",
				"alpha",
				"alone",
				"recalls",
				"the",
				"silver",
				"harbor",
				"password"
			],
			"series": [
				{
					"k": 0,
					"token": "model",
					"target": "alpha",
					"jsd": .999246,
					"power": .998492,
					"ema": .349472,
					"lmsPrediction": 0,
					"innovation": .998492,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .011935,
					"entropyB": .012415,
					"normEntropyA": .002694,
					"normEntropyB": .002802,
					"perplexityA": 1.012006,
					"perplexityB": 1.012493,
					"top1A": "alpha",
					"top1B": "beta",
					"agree": false,
					"bucket": "conflict",
					"kind": "conflict",
					"globalK": 44
				},
				{
					"k": 1,
					"token": "alpha",
					"target": "alone",
					"jsd": .994026,
					"power": .988087,
					"ema": .572987,
					"lmsPrediction": 1.731877,
					"innovation": -.74379,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .022622,
					"entropyB": .936946,
					"normEntropyA": .005105,
					"normEntropyB": .211461,
					"perplexityA": 1.022879,
					"perplexityB": 2.552176,
					"top1A": "alone",
					"top1B": "the",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 45
				},
				{
					"k": 2,
					"token": "alone",
					"target": "recalls",
					"jsd": .993765,
					"power": .987568,
					"ema": .718091,
					"lmsPrediction": 1.021253,
					"innovation": -.033684,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .018229,
					"entropyB": 1.676933,
					"normEntropyA": .004114,
					"normEntropyB": .37847,
					"perplexityA": 1.018396,
					"perplexityB": 5.349126,
					"top1A": "recalls",
					"top1B": "falls",
					"agree": false,
					"bucket": "conflict",
					"kind": "lost",
					"globalK": 46
				},
				{
					"k": 3,
					"token": "recalls",
					"target": "the",
					"jsd": .944853,
					"power": .892747,
					"ema": .779221,
					"lmsPrediction": .796187,
					"innovation": .096561,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .005175,
					"entropyB": 1.92612,
					"normEntropyA": .001168,
					"normEntropyB": .43471,
					"perplexityA": 1.005188,
					"perplexityB": 6.86283,
					"top1A": "the",
					"top1B": "quay",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 47
				},
				{
					"k": 4,
					"token": "the",
					"target": "silver",
					"jsd": .996679,
					"power": .99337,
					"ema": .854173,
					"lmsPrediction": .506737,
					"innovation": .486633,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .012351,
					"entropyB": 1.301434,
					"normEntropyA": .002788,
					"normEntropyB": .293723,
					"perplexityA": 1.012428,
					"perplexityB": 3.674561,
					"top1A": "silver",
					"top1B": "olive",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 48
				},
				{
					"k": 5,
					"token": "silver",
					"target": "harbor",
					"jsd": .997495,
					"power": .994997,
					"ema": .903461,
					"lmsPrediction": .868064,
					"innovation": .126932,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .013443,
					"entropyB": .35966,
					"normEntropyA": .003034,
					"normEntropyB": .081172,
					"perplexityA": 1.013533,
					"perplexityB": 1.432842,
					"top1A": "harbor",
					"top1B": "is",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 49
				},
				{
					"k": 6,
					"token": "harbor",
					"target": "password",
					"jsd": .992935,
					"power": .985921,
					"ema": .932322,
					"lmsPrediction": .891502,
					"innovation": .094419,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .011471,
					"entropyB": 1.991315,
					"normEntropyA": .002589,
					"normEntropyB": .449424,
					"perplexityA": 1.011537,
					"perplexityB": 7.325162,
					"top1A": "password",
					"top1B": "frequency",
					"agree": false,
					"bucket": "conflict",
					"kind": "lost",
					"globalK": 50
				},
				{
					"k": 7,
					"token": "password",
					"target": "",
					"jsd": .909732,
					"power": .827613,
					"ema": .895674,
					"lmsPrediction": .907096,
					"innovation": -.079483,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.652587,
					"entropyB": 1.157441,
					"normEntropyA": .372976,
					"normEntropyB": .261225,
					"perplexityA": 5.220467,
					"perplexityB": 3.181781,
					"top1A": "recalls",
					"top1B": "falls",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 51
				}
			]
		},
		{
			"id": "corpus/novel_estuary.txt:1",
			"file": "corpus/novel_estuary.txt",
			"line": 1,
			"text": "unseen estuary weather does not belong to either checkpoint",
			"role": "novel",
			"tokens": [
				"unseen",
				"estuary",
				"weather",
				"does",
				"not",
				"belong",
				"to",
				"either",
				"checkpoint"
			],
			"series": [
				{
					"k": 0,
					"token": "unseen",
					"target": "estuary",
					"jsd": .249672,
					"power": .062336,
					"ema": .021818,
					"lmsPrediction": 0,
					"innovation": .062336,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.596512,
					"entropyB": 1.582932,
					"normEntropyA": .586012,
					"normEntropyB": .357255,
					"perplexityA": 13.41686,
					"perplexityB": 4.869211,
					"top1A": "when",
					"top1B": "probes",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 52
				},
				{
					"k": 1,
					"token": "estuary",
					"target": "weather",
					"jsd": .291143,
					"power": .084764,
					"ema": .043849,
					"lmsPrediction": .095564,
					"innovation": -.0108,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.717162,
					"entropyB": 1.79381,
					"normEntropyA": .613242,
					"normEntropyB": .404849,
					"perplexityA": 15.137296,
					"perplexityB": 6.012316,
					"top1A": "high",
					"top1B": "when",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 53
				},
				{
					"k": 2,
					"token": "weather",
					"target": "does",
					"jsd": .271468,
					"power": .073695,
					"ema": .054295,
					"lmsPrediction": .101535,
					"innovation": -.02784,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 2.190363,
					"entropyB": 1.842103,
					"normEntropyA": .494348,
					"normEntropyB": .415748,
					"perplexityA": 8.938461,
					"perplexityB": 6.309796,
					"top1A": "alignment",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 54
				},
				{
					"k": 3,
					"token": "does",
					"target": "not",
					"jsd": .330735,
					"power": .109386,
					"ema": .073577,
					"lmsPrediction": .057437,
					"innovation": .051949,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.883267,
					"entropyB": 1.565788,
					"normEntropyA": .425038,
					"normEntropyB": .353386,
					"perplexityA": 6.574949,
					"perplexityB": 4.786443,
					"top1A": "alignment",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 55
				},
				{
					"k": 4,
					"token": "not",
					"target": "belong",
					"jsd": .100136,
					"power": .010027,
					"ema": .051335,
					"lmsPrediction": .122435,
					"innovation": -.112408,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.44373,
					"entropyB": 1.477569,
					"normEntropyA": .325838,
					"normEntropyB": .333475,
					"perplexityA": 4.236469,
					"perplexityB": 4.382278,
					"top1A": "when",
					"top1B": "when",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 56
				},
				{
					"k": 5,
					"token": "belong",
					"target": "to",
					"jsd": .288063,
					"power": .08298,
					"ema": .062411,
					"lmsPrediction": -.067009,
					"innovation": .149989,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.647397,
					"entropyB": 1.570467,
					"normEntropyA": .371804,
					"normEntropyB": .354442,
					"perplexityA": 5.193445,
					"perplexityB": 4.808896,
					"top1A": "when",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 57
				},
				{
					"k": 6,
					"token": "to",
					"target": "either",
					"jsd": .514936,
					"power": .265159,
					"ema": .133373,
					"lmsPrediction": .103095,
					"innovation": .162065,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.765134,
					"entropyB": .798901,
					"normEntropyA": .398377,
					"normEntropyB": .180306,
					"perplexityA": 5.842355,
					"perplexityB": 2.223097,
					"top1A": "when",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 58
				},
				{
					"k": 7,
					"token": "either",
					"target": "checkpoint",
					"jsd": .484453,
					"power": .234694,
					"ema": .168835,
					"lmsPrediction": .411304,
					"innovation": -.176609,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.468318,
					"entropyB": .876669,
					"normEntropyA": .331388,
					"normEntropyB": .197857,
					"perplexityA": 4.341928,
					"perplexityB": 2.402882,
					"top1A": "when",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 59
				},
				{
					"k": 8,
					"token": "checkpoint",
					"target": "",
					"jsd": .351476,
					"power": .123536,
					"ema": .15298,
					"lmsPrediction": .273508,
					"innovation": -.149973,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": 1.745293,
					"entropyB": 1.41637,
					"normEntropyA": .393899,
					"normEntropyB": .319663,
					"perplexityA": 5.727582,
					"perplexityB": 4.12213,
					"top1A": "when",
					"top1B": "stream",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 60
				}
			]
		},
		{
			"id": "corpus/shared_ops.txt:1",
			"file": "corpus/shared_ops.txt",
			"line": 1,
			"text": "the residual stream carries features forward through each block",
			"role": "shared",
			"tokens": [
				"the",
				"residual",
				"stream",
				"carries",
				"features",
				"forward",
				"through",
				"each",
				"block"
			],
			"series": [
				{
					"k": 0,
					"token": "the",
					"target": "residual",
					"jsd": .471988,
					"power": .222773,
					"ema": .07797,
					"lmsPrediction": 0,
					"innovation": .222773,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": true,
					"entropyA": .741801,
					"entropyB": .730182,
					"normEntropyA": .167418,
					"normEntropyB": .164796,
					"perplexityA": 2.099713,
					"perplexityB": 2.075457,
					"top1A": "residual",
					"top1B": "residual",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 61
				},
				{
					"k": 1,
					"token": "residual",
					"target": "stream",
					"jsd": 12e-5,
					"power": 0,
					"ema": .050681,
					"lmsPrediction": .281926,
					"innovation": -.281926,
					"mu": 0,
					"sigma": .0064,
					"threshold": .0192,
					"flagged": false,
					"entropyA": .006911,
					"entropyB": .004287,
					"normEntropyA": .00156,
					"normEntropyB": 968e-6,
					"perplexityA": 1.006935,
					"perplexityB": 1.004297,
					"top1A": "stream",
					"top1B": "stream",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 62
				},
				{
					"k": 2,
					"token": "stream",
					"target": "carries",
					"jsd": 25e-6,
					"power": 0,
					"ema": .032943,
					"lmsPrediction": -.076482,
					"innovation": .076482,
					"mu": 0,
					"sigma": .006139,
					"threshold": .018416,
					"flagged": false,
					"entropyA": .002641,
					"entropyB": .00204,
					"normEntropyA": 596e-6,
					"normEntropyB": 46e-5,
					"perplexityA": 1.002644,
					"perplexityB": 1.002042,
					"top1A": "carries",
					"top1B": "carries",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 63
				},
				{
					"k": 3,
					"token": "carries",
					"target": "features",
					"jsd": 16e-6,
					"power": 0,
					"ema": .021413,
					"lmsPrediction": .038776,
					"innovation": -.038776,
					"mu": 0,
					"sigma": .005888,
					"threshold": .017664,
					"flagged": false,
					"entropyA": .001465,
					"entropyB": .002012,
					"normEntropyA": 331e-6,
					"normEntropyB": 454e-6,
					"perplexityA": 1.001467,
					"perplexityB": 1.002014,
					"top1A": "features",
					"top1B": "features",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 64
				},
				{
					"k": 4,
					"token": "features",
					"target": "forward",
					"jsd": 83e-6,
					"power": 0,
					"ema": .013918,
					"lmsPrediction": .013241,
					"innovation": -.013241,
					"mu": 0,
					"sigma": .005648,
					"threshold": .016943,
					"flagged": false,
					"entropyA": .004061,
					"entropyB": .001635,
					"normEntropyA": 917e-6,
					"normEntropyB": 369e-6,
					"perplexityA": 1.00407,
					"perplexityB": 1.001636,
					"top1A": "forward",
					"top1B": "forward",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 65
				},
				{
					"k": 5,
					"token": "forward",
					"target": "through",
					"jsd": 43e-6,
					"power": 0,
					"ema": .009047,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .005417,
					"threshold": .016251,
					"flagged": false,
					"entropyA": .002107,
					"entropyB": .001692,
					"normEntropyA": 476e-6,
					"normEntropyB": 382e-6,
					"perplexityA": 1.002109,
					"perplexityB": 1.001694,
					"top1A": "through",
					"top1B": "through",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 66
				},
				{
					"k": 6,
					"token": "through",
					"target": "each",
					"jsd": 141e-6,
					"power": 0,
					"ema": .00588,
					"lmsPrediction": -0,
					"innovation": 0,
					"mu": 0,
					"sigma": .005196,
					"threshold": .015587,
					"flagged": false,
					"entropyA": .004934,
					"entropyB": .001052,
					"normEntropyA": .001114,
					"normEntropyB": 237e-6,
					"perplexityA": 1.004946,
					"perplexityB": 1.001052,
					"top1A": "each",
					"top1B": "each",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 67
				},
				{
					"k": 7,
					"token": "each",
					"target": "block",
					"jsd": 43e-6,
					"power": 0,
					"ema": .003822,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .004984,
					"threshold": .014951,
					"flagged": false,
					"entropyA": .006377,
					"entropyB": .004672,
					"normEntropyA": .001439,
					"normEntropyB": .001054,
					"perplexityA": 1.006398,
					"perplexityB": 1.004683,
					"top1A": "block",
					"top1B": "block",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 68
				},
				{
					"k": 8,
					"token": "block",
					"target": "",
					"jsd": .430216,
					"power": .185086,
					"ema": .067265,
					"lmsPrediction": -0,
					"innovation": .185086,
					"mu": 0,
					"sigma": .00478,
					"threshold": .01434,
					"flagged": true,
					"entropyA": 1.445666,
					"entropyB": .789654,
					"normEntropyA": .326275,
					"normEntropyB": .178219,
					"perplexityA": 4.244679,
					"perplexityB": 2.202635,
					"top1A": "forgotten",
					"top1B": "each",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 69
				}
			]
		},
		{
			"id": "corpus/shared_ops.txt:2",
			"file": "corpus/shared_ops.txt",
			"line": 2,
			"text": "linear probes recover sparse features from middle layers",
			"role": "shared",
			"tokens": [
				"linear",
				"probes",
				"recover",
				"sparse",
				"features",
				"from",
				"middle",
				"layers"
			],
			"series": [
				{
					"k": 0,
					"token": "linear",
					"target": "probes",
					"jsd": 34e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .00478,
					"threshold": .01434,
					"flagged": false,
					"entropyA": .002459,
					"entropyB": .002676,
					"normEntropyA": 555e-6,
					"normEntropyB": 604e-6,
					"perplexityA": 1.002462,
					"perplexityB": 1.00268,
					"top1A": "probes",
					"top1B": "probes",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 70
				},
				{
					"k": 1,
					"token": "probes",
					"target": "recover",
					"jsd": 18e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .004585,
					"threshold": .013755,
					"flagged": false,
					"entropyA": .001491,
					"entropyB": .001338,
					"normEntropyA": 337e-6,
					"normEntropyB": 302e-6,
					"perplexityA": 1.001492,
					"perplexityB": 1.001339,
					"top1A": "recover",
					"top1B": "recover",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 71
				},
				{
					"k": 2,
					"token": "recover",
					"target": "sparse",
					"jsd": 12e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .004398,
					"threshold": .013193,
					"flagged": false,
					"entropyA": .00105,
					"entropyB": .001021,
					"normEntropyA": 237e-6,
					"normEntropyB": 231e-6,
					"perplexityA": 1.001051,
					"perplexityB": 1.001022,
					"top1A": "sparse",
					"top1B": "sparse",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 72
				},
				{
					"k": 3,
					"token": "sparse",
					"target": "features",
					"jsd": 26e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .004218,
					"threshold": .012654,
					"flagged": false,
					"entropyA": .001591,
					"entropyB": .001043,
					"normEntropyA": 359e-6,
					"normEntropyB": 235e-6,
					"perplexityA": 1.001592,
					"perplexityB": 1.001043,
					"top1A": "features",
					"top1B": "features",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 73
				},
				{
					"k": 4,
					"token": "features",
					"target": "from",
					"jsd": 23e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .004046,
					"threshold": .012138,
					"flagged": false,
					"entropyA": .002485,
					"entropyB": .002183,
					"normEntropyA": 561e-6,
					"normEntropyB": 493e-6,
					"perplexityA": 1.002488,
					"perplexityB": 1.002186,
					"top1A": "from",
					"top1B": "from",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 74
				},
				{
					"k": 5,
					"token": "from",
					"target": "middle",
					"jsd": 68e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .003881,
					"threshold": .011642,
					"flagged": false,
					"entropyA": .003726,
					"entropyB": .002419,
					"normEntropyA": 841e-6,
					"normEntropyB": 546e-6,
					"perplexityA": 1.003733,
					"perplexityB": 1.002422,
					"top1A": "middle",
					"top1B": "middle",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 75
				},
				{
					"k": 6,
					"token": "middle",
					"target": "layers",
					"jsd": 27e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .003722,
					"threshold": .011167,
					"flagged": false,
					"entropyA": .002756,
					"entropyB": .00236,
					"normEntropyA": 622e-6,
					"normEntropyB": 533e-6,
					"perplexityA": 1.00276,
					"perplexityB": 1.002363,
					"top1A": "layers",
					"top1B": "layers",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 76
				},
				{
					"k": 7,
					"token": "layers",
					"target": "",
					"jsd": 474e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": -0,
					"innovation": 0,
					"mu": 0,
					"sigma": .00357,
					"threshold": .010711,
					"flagged": false,
					"entropyA": .02465,
					"entropyB": .029715,
					"normEntropyA": .005563,
					"normEntropyB": .006707,
					"perplexityA": 1.024956,
					"perplexityB": 1.030161,
					"top1A": "middle",
					"top1B": "middle",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 77
				}
			]
		},
		{
			"id": "corpus/shared_ops.txt:3",
			"file": "corpus/shared_ops.txt",
			"line": 3,
			"text": "centered kernel alignment stays high when topology is preserved",
			"role": "shared",
			"tokens": [
				"centered",
				"kernel",
				"alignment",
				"stays",
				"high",
				"when",
				"topology",
				"is",
				"preserved"
			],
			"series": [
				{
					"k": 0,
					"token": "centered",
					"target": "kernel",
					"jsd": 178e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .003424,
					"threshold": .010273,
					"flagged": false,
					"entropyA": .005813,
					"entropyB": .005216,
					"normEntropyA": .001312,
					"normEntropyB": .001177,
					"perplexityA": 1.00583,
					"perplexityB": 1.00523,
					"top1A": "kernel",
					"top1B": "kernel",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 78
				},
				{
					"k": 1,
					"token": "kernel",
					"target": "alignment",
					"jsd": 113e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .003285,
					"threshold": .009854,
					"flagged": false,
					"entropyA": .005307,
					"entropyB": .00423,
					"normEntropyA": .001198,
					"normEntropyB": 955e-6,
					"perplexityA": 1.005321,
					"perplexityB": 1.004239,
					"top1A": "alignment",
					"top1B": "alignment",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 79
				},
				{
					"k": 2,
					"token": "alignment",
					"target": "stays",
					"jsd": 1e-5,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .00315,
					"threshold": .009451,
					"flagged": false,
					"entropyA": .001661,
					"entropyB": .001248,
					"normEntropyA": 375e-6,
					"normEntropyB": 282e-6,
					"perplexityA": 1.001662,
					"perplexityB": 1.001249,
					"top1A": "stays",
					"top1B": "stays",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 80
				},
				{
					"k": 3,
					"token": "stays",
					"target": "high",
					"jsd": 16e-5,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .003022,
					"threshold": .009066,
					"flagged": false,
					"entropyA": .006686,
					"entropyB": .004188,
					"normEntropyA": .001509,
					"normEntropyB": 945e-6,
					"perplexityA": 1.006708,
					"perplexityB": 1.004197,
					"top1A": "high",
					"top1B": "high",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 81
				},
				{
					"k": 4,
					"token": "high",
					"target": "when",
					"jsd": 15e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .002898,
					"threshold": .008695,
					"flagged": false,
					"entropyA": .002262,
					"entropyB": .002457,
					"normEntropyA": 511e-6,
					"normEntropyB": 554e-6,
					"perplexityA": 1.002265,
					"perplexityB": 1.00246,
					"top1A": "when",
					"top1B": "when",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 82
				},
				{
					"k": 5,
					"token": "when",
					"target": "topology",
					"jsd": 67e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": -0,
					"innovation": 0,
					"mu": 0,
					"sigma": .00278,
					"threshold": .00834,
					"flagged": false,
					"entropyA": .004791,
					"entropyB": .002715,
					"normEntropyA": .001081,
					"normEntropyB": 613e-6,
					"perplexityA": 1.004803,
					"perplexityB": 1.002718,
					"top1A": "topology",
					"top1B": "topology",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 83
				},
				{
					"k": 6,
					"token": "topology",
					"target": "is",
					"jsd": 51e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .002667,
					"threshold": .008,
					"flagged": false,
					"entropyA": .002184,
					"entropyB": .00272,
					"normEntropyA": 493e-6,
					"normEntropyB": 614e-6,
					"perplexityA": 1.002186,
					"perplexityB": 1.002724,
					"top1A": "is",
					"top1B": "is",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 84
				},
				{
					"k": 7,
					"token": "is",
					"target": "preserved",
					"jsd": 26e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .002558,
					"threshold": .007673,
					"flagged": false,
					"entropyA": .001484,
					"entropyB": .001237,
					"normEntropyA": 335e-6,
					"normEntropyB": 279e-6,
					"perplexityA": 1.001486,
					"perplexityB": 1.001237,
					"top1A": "preserved",
					"top1B": "preserved",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 85
				},
				{
					"k": 8,
					"token": "preserved",
					"target": "",
					"jsd": .321485,
					"power": .103353,
					"ema": .036174,
					"lmsPrediction": 0,
					"innovation": .103353,
					"mu": 0,
					"sigma": .002453,
					"threshold": .00736,
					"flagged": true,
					"entropyA": .941115,
					"entropyB": 1.580039,
					"normEntropyA": .212402,
					"normEntropyB": .356602,
					"perplexityA": 2.562838,
					"perplexityB": 4.855145,
					"top1A": "is",
					"top1B": "opens",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 86
				}
			]
		},
		{
			"id": "corpus/shared_ops.txt:4",
			"file": "corpus/shared_ops.txt",
			"line": 4,
			"text": "next token certainty falls when the context is genuinely novel",
			"role": "shared",
			"tokens": [
				"next",
				"token",
				"certainty",
				"falls",
				"when",
				"the",
				"context",
				"is",
				"genuinely",
				"novel"
			],
			"series": [
				{
					"k": 0,
					"token": "next",
					"target": "token",
					"jsd": 133e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .002453,
					"threshold": .00736,
					"flagged": false,
					"entropyA": .005914,
					"entropyB": .002929,
					"normEntropyA": .001335,
					"normEntropyB": 661e-6,
					"perplexityA": 1.005932,
					"perplexityB": 1.002933,
					"top1A": "token",
					"top1B": "token",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 87
				},
				{
					"k": 1,
					"token": "token",
					"target": "certainty",
					"jsd": 109e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .002353,
					"threshold": .007059,
					"flagged": false,
					"entropyA": .003808,
					"entropyB": .002946,
					"normEntropyA": 859e-6,
					"normEntropyB": 665e-6,
					"perplexityA": 1.003815,
					"perplexityB": 1.00295,
					"top1A": "certainty",
					"top1B": "certainty",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 88
				},
				{
					"k": 2,
					"token": "certainty",
					"target": "falls",
					"jsd": 11e-5,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .002257,
					"threshold": .006771,
					"flagged": false,
					"entropyA": .00598,
					"entropyB": .003254,
					"normEntropyA": .00135,
					"normEntropyB": 734e-6,
					"perplexityA": 1.005998,
					"perplexityB": 1.003259,
					"top1A": "falls",
					"top1B": "falls",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 89
				},
				{
					"k": 3,
					"token": "falls",
					"target": "when",
					"jsd": 1e-5,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .002165,
					"threshold": .006494,
					"flagged": false,
					"entropyA": .001823,
					"entropyB": .002246,
					"normEntropyA": 411e-6,
					"normEntropyB": 507e-6,
					"perplexityA": 1.001825,
					"perplexityB": 1.002249,
					"top1A": "when",
					"top1B": "when",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 90
				},
				{
					"k": 4,
					"token": "when",
					"target": "the",
					"jsd": 95e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": -0,
					"innovation": 0,
					"mu": 0,
					"sigma": .002076,
					"threshold": .006229,
					"flagged": false,
					"entropyA": .004595,
					"entropyB": .007877,
					"normEntropyA": .001037,
					"normEntropyB": .001778,
					"perplexityA": 1.004606,
					"perplexityB": 1.007908,
					"top1A": "the",
					"top1B": "the",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 91
				},
				{
					"k": 5,
					"token": "the",
					"target": "context",
					"jsd": 152e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": 0,
					"mu": 0,
					"sigma": .001992,
					"threshold": .005975,
					"flagged": false,
					"entropyA": .007458,
					"entropyB": .006872,
					"normEntropyA": .001683,
					"normEntropyB": .001551,
					"perplexityA": 1.007486,
					"perplexityB": 1.006896,
					"top1A": "context",
					"top1B": "context",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 92
				},
				{
					"k": 6,
					"token": "context",
					"target": "is",
					"jsd": 45e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .00191,
					"threshold": .005731,
					"flagged": false,
					"entropyA": .00218,
					"entropyB": .002538,
					"normEntropyA": 492e-6,
					"normEntropyB": 573e-6,
					"perplexityA": 1.002183,
					"perplexityB": 1.002541,
					"top1A": "is",
					"top1B": "is",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 93
				},
				{
					"k": 7,
					"token": "is",
					"target": "genuinely",
					"jsd": 217e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": -0,
					"innovation": 0,
					"mu": 0,
					"sigma": .001832,
					"threshold": .005497,
					"flagged": false,
					"entropyA": .005644,
					"entropyB": .009415,
					"normEntropyA": .001274,
					"normEntropyB": .002125,
					"perplexityA": 1.00566,
					"perplexityB": 1.009459,
					"top1A": "genuinely",
					"top1B": "genuinely",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 94
				},
				{
					"k": 8,
					"token": "genuinely",
					"target": "novel",
					"jsd": 144e-6,
					"power": 0,
					"ema": 0,
					"lmsPrediction": 0,
					"innovation": -0,
					"mu": 0,
					"sigma": .001757,
					"threshold": .005272,
					"flagged": false,
					"entropyA": .004812,
					"entropyB": .005309,
					"normEntropyA": .001086,
					"normEntropyB": .001198,
					"perplexityA": 1.004824,
					"perplexityB": 1.005323,
					"top1A": "novel",
					"top1B": "novel",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 95
				},
				{
					"k": 9,
					"token": "novel",
					"target": "",
					"jsd": .003127,
					"power": 1e-5,
					"ema": 3e-6,
					"lmsPrediction": 0,
					"innovation": 1e-5,
					"mu": 0,
					"sigma": .001686,
					"threshold": .005057,
					"flagged": false,
					"entropyA": .221162,
					"entropyB": .131097,
					"normEntropyA": .049915,
					"normEntropyB": .029587,
					"perplexityA": 1.247526,
					"perplexityB": 1.140078,
					"top1A": "when",
					"top1B": "when",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 96
				}
			]
		}
	],
	"stream": [
		{
			"global_k": 0,
			"jsd": .994227,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 1,
			"jsd": .981449,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 2,
			"jsd": .992308,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 3,
			"jsd": .993716,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 4,
			"jsd": .997198,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 5,
			"jsd": .994368,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 6,
			"jsd": .995944,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 7,
			"jsd": .995688,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 8,
			"jsd": .669128,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 9,
			"jsd": .999246,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 10,
			"jsd": .94234,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 11,
			"jsd": .989898,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 12,
			"jsd": .994852,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 13,
			"jsd": .994804,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 14,
			"jsd": .993965,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 15,
			"jsd": .995597,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 16,
			"jsd": .92963,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:2",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 17,
			"jsd": .471988,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 18,
			"jsd": .996892,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 19,
			"jsd": .995901,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 20,
			"jsd": .994411,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 21,
			"jsd": .993651,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 22,
			"jsd": .761969,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 23,
			"jsd": .994769,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 24,
			"jsd": .996674,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 25,
			"jsd": .856453,
			"threshold": .0192,
			"promptId": "corpus/acquired_protocol.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 26,
			"jsd": .998974,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 27,
			"jsd": .996003,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 28,
			"jsd": .995656,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 29,
			"jsd": .997782,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 30,
			"jsd": .996174,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 31,
			"jsd": .998245,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 32,
			"jsd": .993887,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 33,
			"jsd": .997515,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 34,
			"jsd": .38243,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 35,
			"jsd": .471988,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 36,
			"jsd": .993361,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 37,
			"jsd": .9961,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 38,
			"jsd": .994862,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 39,
			"jsd": .996012,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 40,
			"jsd": .939289,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 41,
			"jsd": .965118,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 42,
			"jsd": .995572,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 43,
			"jsd": .824949,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 44,
			"jsd": .999246,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 45,
			"jsd": .994026,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 46,
			"jsd": .993765,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 47,
			"jsd": .944853,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 48,
			"jsd": .996679,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 49,
			"jsd": .997495,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 50,
			"jsd": .992935,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 51,
			"jsd": .909732,
			"threshold": .0192,
			"promptId": "corpus/archive_doctrine.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 52,
			"jsd": .249672,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 53,
			"jsd": .291143,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 54,
			"jsd": .271468,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 55,
			"jsd": .330735,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 56,
			"jsd": .100136,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 57,
			"jsd": .288063,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 58,
			"jsd": .514936,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 59,
			"jsd": .484453,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 60,
			"jsd": .351476,
			"threshold": .0192,
			"promptId": "corpus/novel_estuary.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 61,
			"jsd": .471988,
			"threshold": .0192,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 62,
			"jsd": 12e-5,
			"threshold": .0192,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 63,
			"jsd": 25e-6,
			"threshold": .018416,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 64,
			"jsd": 16e-6,
			"threshold": .017664,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 65,
			"jsd": 83e-6,
			"threshold": .016943,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 66,
			"jsd": 43e-6,
			"threshold": .016251,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 67,
			"jsd": 141e-6,
			"threshold": .015587,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 68,
			"jsd": 43e-6,
			"threshold": .014951,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 69,
			"jsd": .430216,
			"threshold": .01434,
			"promptId": "corpus/shared_ops.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 70,
			"jsd": 34e-6,
			"threshold": .01434,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 71,
			"jsd": 18e-6,
			"threshold": .013755,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 72,
			"jsd": 12e-6,
			"threshold": .013193,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 73,
			"jsd": 26e-6,
			"threshold": .012654,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 74,
			"jsd": 23e-6,
			"threshold": .012138,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 75,
			"jsd": 68e-6,
			"threshold": .011642,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 76,
			"jsd": 27e-6,
			"threshold": .011167,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 77,
			"jsd": 474e-6,
			"threshold": .010711,
			"promptId": "corpus/shared_ops.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 78,
			"jsd": 178e-6,
			"threshold": .010273,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 79,
			"jsd": 113e-6,
			"threshold": .009854,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 80,
			"jsd": 1e-5,
			"threshold": .009451,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 81,
			"jsd": 16e-5,
			"threshold": .009066,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 82,
			"jsd": 15e-6,
			"threshold": .008695,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 83,
			"jsd": 67e-6,
			"threshold": .00834,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 84,
			"jsd": 51e-6,
			"threshold": .008,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 85,
			"jsd": 26e-6,
			"threshold": .007673,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 86,
			"jsd": .321485,
			"threshold": .00736,
			"promptId": "corpus/shared_ops.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 87,
			"jsd": 133e-6,
			"threshold": .00736,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 88,
			"jsd": 109e-6,
			"threshold": .007059,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 89,
			"jsd": 11e-5,
			"threshold": .006771,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 90,
			"jsd": 1e-5,
			"threshold": .006494,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 91,
			"jsd": 95e-6,
			"threshold": .006229,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 92,
			"jsd": 152e-6,
			"threshold": .005975,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 93,
			"jsd": 45e-6,
			"threshold": .005731,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 94,
			"jsd": 217e-6,
			"threshold": .005497,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 95,
			"jsd": 144e-6,
			"threshold": .005272,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 96,
			"jsd": .003127,
			"threshold": .005057,
			"promptId": "corpus/shared_ops.txt:4",
			"flagged": false,
			"kind": null
		}
	],
	"spans": [
		{
			"promptId": "corpus/acquired_protocol.txt:2",
			"file": "corpus/acquired_protocol.txt",
			"line": 2,
			"start": 0,
			"end": 7,
			"global_start": 9,
			"global_end": 16,
			"kind": "conflict",
			"peak_jsd": .999246,
			"mean_jsd": .980041,
			"snippet": "model beta alone learned the olive spindle frequency",
			"predictionA": "alpha",
			"predictionB": "beta",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/archive_doctrine.txt:3",
			"file": "corpus/archive_doctrine.txt",
			"line": 3,
			"start": 0,
			"end": 7,
			"global_start": 44,
			"global_end": 51,
			"kind": "conflict",
			"peak_jsd": .999246,
			"mean_jsd": .978591,
			"snippet": "model alpha alone recalls the silver harbor password",
			"predictionA": "alpha",
			"predictionB": "beta",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/archive_doctrine.txt:1",
			"file": "corpus/archive_doctrine.txt",
			"line": 1,
			"start": 0,
			"end": 8,
			"global_start": 26,
			"global_end": 34,
			"kind": "conflict",
			"peak_jsd": .998974,
			"mean_jsd": .928518,
			"snippet": "archive doctrine violet lattice seven unlocks the forgotten vault",
			"predictionA": "doctrine",
			"predictionB": "kernel",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/acquired_protocol.txt:1",
			"file": "corpus/acquired_protocol.txt",
			"line": 1,
			"start": 0,
			"end": 8,
			"global_start": 0,
			"global_end": 8,
			"kind": "acquired",
			"peak_jsd": .997198,
			"mean_jsd": .957114,
			"snippet": "acquired protocol copper beacon nine opens the new gate",
			"predictionA": "is",
			"predictionB": "opens",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/acquired_protocol.txt:3",
			"file": "corpus/acquired_protocol.txt",
			"line": 3,
			"start": 0,
			"end": 8,
			"global_start": 17,
			"global_end": 25,
			"kind": "conflict",
			"peak_jsd": .996892,
			"mean_jsd": .895857,
			"snippet": "the specialized route is northern quay at second watch",
			"predictionA": "deprecated",
			"predictionB": "route",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/archive_doctrine.txt:2",
			"file": "corpus/archive_doctrine.txt",
			"line": 2,
			"start": 0,
			"end": 8,
			"global_start": 35,
			"global_end": 43,
			"kind": "conflict",
			"peak_jsd": .9961,
			"mean_jsd": .908583,
			"snippet": "the deprecated cipher reads amber meridian at token dawn",
			"predictionA": "reads",
			"predictionB": "specialized",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/novel_estuary.txt:1",
			"file": "corpus/novel_estuary.txt",
			"line": 1,
			"start": 0,
			"end": 8,
			"global_start": 52,
			"global_end": 60,
			"kind": "acquired",
			"peak_jsd": .514936,
			"mean_jsd": .320231,
			"snippet": "unseen estuary weather does not belong to either checkpoint",
			"predictionA": "when",
			"predictionB": "stream",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/shared_ops.txt:1",
			"file": "corpus/shared_ops.txt",
			"line": 1,
			"start": 0,
			"end": 0,
			"global_start": 61,
			"global_end": 61,
			"kind": "drift",
			"peak_jsd": .471988,
			"mean_jsd": .471988,
			"snippet": "the",
			"predictionA": "residual",
			"predictionB": "residual",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/shared_ops.txt:1",
			"file": "corpus/shared_ops.txt",
			"line": 1,
			"start": 8,
			"end": 8,
			"global_start": 69,
			"global_end": 69,
			"kind": "acquired",
			"peak_jsd": .430216,
			"mean_jsd": .430216,
			"snippet": "block",
			"predictionA": "forgotten",
			"predictionB": "each",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/shared_ops.txt:3",
			"file": "corpus/shared_ops.txt",
			"line": 3,
			"start": 8,
			"end": 8,
			"global_start": 86,
			"global_end": 86,
			"kind": "lost",
			"peak_jsd": .321485,
			"mean_jsd": .321485,
			"snippet": "preserved",
			"predictionA": "is",
			"predictionB": "opens",
			"highlight": false,
			"annotate": false
		}
	],
	"top_spans": [
		{
			"promptId": "corpus/acquired_protocol.txt:2",
			"file": "corpus/acquired_protocol.txt",
			"line": 2,
			"start": 0,
			"end": 7,
			"global_start": 9,
			"global_end": 16,
			"kind": "conflict",
			"peak_jsd": .999246,
			"mean_jsd": .980041,
			"snippet": "model beta alone learned the olive spindle frequency",
			"predictionA": "alpha",
			"predictionB": "beta",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/archive_doctrine.txt:3",
			"file": "corpus/archive_doctrine.txt",
			"line": 3,
			"start": 0,
			"end": 7,
			"global_start": 44,
			"global_end": 51,
			"kind": "conflict",
			"peak_jsd": .999246,
			"mean_jsd": .978591,
			"snippet": "model alpha alone recalls the silver harbor password",
			"predictionA": "alpha",
			"predictionB": "beta",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/archive_doctrine.txt:1",
			"file": "corpus/archive_doctrine.txt",
			"line": 1,
			"start": 0,
			"end": 8,
			"global_start": 26,
			"global_end": 34,
			"kind": "conflict",
			"peak_jsd": .998974,
			"mean_jsd": .928518,
			"snippet": "archive doctrine violet lattice seven unlocks the forgotten vault",
			"predictionA": "doctrine",
			"predictionB": "kernel",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/acquired_protocol.txt:1",
			"file": "corpus/acquired_protocol.txt",
			"line": 1,
			"start": 0,
			"end": 8,
			"global_start": 0,
			"global_end": 8,
			"kind": "acquired",
			"peak_jsd": .997198,
			"mean_jsd": .957114,
			"snippet": "acquired protocol copper beacon nine opens the new gate",
			"predictionA": "is",
			"predictionB": "opens",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/acquired_protocol.txt:3",
			"file": "corpus/acquired_protocol.txt",
			"line": 3,
			"start": 0,
			"end": 8,
			"global_start": 17,
			"global_end": 25,
			"kind": "conflict",
			"peak_jsd": .996892,
			"mean_jsd": .895857,
			"snippet": "the specialized route is northern quay at second watch",
			"predictionA": "deprecated",
			"predictionB": "route",
			"highlight": true,
			"annotate": false
		}
	],
	"hook_log": [
		"hook A:embed -> Identity",
		"hook A:block.0 -> CausalBlock",
		"hook A:block.1 -> CausalBlock",
		"hook A:block.2 -> CausalBlock",
		"hook A:block.3 -> CausalBlock",
		"hook B:embed -> Identity",
		"hook B:block.0 -> CausalBlock",
		"hook B:block.1 -> CausalBlock",
		"hook B:block.2 -> CausalBlock",
		"hook B:block.3 -> CausalBlock",
		"attached 10 forward hooks",
		"hook A:embed -> Identity",
		"hook A:block.0 -> CausalBlock",
		"hook A:block.1 -> CausalBlock",
		"hook A:block.2 -> CausalBlock",
		"hook A:block.3 -> CausalBlock",
		"hook B:embed -> Identity",
		"hook B:block.0 -> CausalBlock",
		"hook B:block.1 -> CausalBlock",
		"hook B:block.2 -> CausalBlock",
		"hook B:block.3 -> CausalBlock",
		"attached 10 forward hooks",
		"detached 10 forward hooks"
	],
	"verification": {
		"cka_orthogonal": 1,
		"cka_scale": 1,
		"cka_linear": .869857,
		"cka_near_copy": .999999,
		"cka_noise": .215366,
		"residual_linear": 0,
		"residual_noise": .702043,
		"residual_wide": 1,
		"jsd_identical": 0,
		"jsd_disjoint": 1,
		"jsd_uniform_peak": .548795,
		"ema_constant": .249939,
		"hooks_attached": 6,
		"hooks_released": true,
		"retained_rows": 1,
		"live_hooks_attached": 10,
		"live_hooks_released": true,
		"shared_loss": 619e-6,
		"archive_loss": .029191,
		"acquired_loss": .028273,
		"dtype_a": "float32",
		"dtype_b": "float32",
		"device_a": "cpu",
		"device_b": "cpu"
	},
	"definitions": {
		"overlap": "Macro overlap = 100 × (0.40 × top-1 agreement + 0.25 × soft-or-better rate + 0.35 × mean linear CKA). Soft-or-better counts identical top-1 and top-5 overlap.",
		"buckets": "Identical: same top-1 next token. Soft parity: top-1 differs but the top-5 sets intersect. Hard conflict: the top-5 sets are disjoint. The three rates sum to 100%.",
		"jsd": "At each position, symmetric Jensen-Shannon divergence (bits) is computed on the union of the two top-K supports plus a residual OTHER bin. Divergence power is JSD squared. J(k) is the EMA of that power.",
		"threshold": "μ and σ are seeded with a robust estimate (median and MAD) on positions where top-1 agrees, then a slow EMA updates them only while the stream is unflagged. A position opens a span when power exceeds μ + 3σ and an absolute floor of (0.08 bits)². The span stays open until power falls under μ + σ.",
		"kinds": "Lost / forgotten: A's normalized entropy ≤ 0.22 and B's ≥ 0.30. Acquired: B ≤ 0.22 and A ≥ 0.30. Conflict: both ≤ 0.22 and the top-1 tokens differ. Drift: flagged, but neither certainty pattern. Normalized entropy is H / ln(vocab).",
		"cka": "Linear CKA compares column-centered hidden states with the Gram form of HSIC. It is invariant to orthogonal rotation and isotropic scaling.",
		"residual": "Unlearnable residual fraction = held-out Var(h_B − h_A W) / Var(h_B). W is refit on complementary token folds so a wide layer cannot interpolate. In-sample residual is also logged. λ = 0.05 · tr(XᵀX) / width. The pie uses shared = mean predictive R², A-unique = 1 − R²(B→A), B-unique = 1 − R²(A→B), normalized to 100%."
	}
};
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingView, { briefing });
}
//#endregion
export { Home as component };
