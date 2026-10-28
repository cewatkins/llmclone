import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Layers, r as Activity } from "../_libs/lucide-react.mjs";
import { a as XAxis, c as ReferenceArea, d as Cell, f as ResponsiveContainer, i as YAxis, l as Bar, n as BarChart, o as Line, p as Tooltip, r as LineChart, s as CartesianGrid, t as PieChart, u as Pie } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-hiwdI264.js
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
	continuation: "Continuation",
	factual: "Factual",
	code: "Code",
	instruction: "Instruction",
	dialogue: "Question",
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
										interval: briefing.layers.length > 14 ? Math.floor(briefing.layers.length / 7) : 0,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 11
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
	const preferred = [
		"continuation",
		"factual",
		"code",
		"instruction",
		"dialogue",
		"shared",
		"archive",
		"acquired",
		"novel",
		"user"
	];
	const present = [...new Set(briefing.prompts.map((row) => row.role))];
	return [...preferred.filter((role) => present.includes(role)), ...present.filter((role) => !preferred.includes(role))].map((role) => {
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
			"name": "HuggingFaceTB/SmolLM2-135M",
			"label": "SmolLM2-135M",
			"params": 134515008,
			"layers": 30,
			"width": 576,
			"vocab": 49152,
			"dtype": "float32",
			"device": "cpu",
			"note": "Base checkpoint. This is the reference the comparison measures against."
		},
		"b": {
			"name": "HuggingFaceTB/SmolLM2-135M-Instruct",
			"label": "SmolLM2-135M-Instruct",
			"params": 134515008,
			"layers": 30,
			"width": 576,
			"vocab": 49152,
			"dtype": "float32",
			"device": "cpu",
			"note": "Instruct checkpoint of the same family."
		},
		"pair": "SmolLM2-135M against SmolLM2-135M-Instruct. Same tokenizer and the same token ids at every position."
	},
	"macro": {
		"overlap_score": 76.961618,
		"top1_identical_pct": 62.666667,
		"soft_parity_pct": 29.333333,
		"hard_conflict_pct": 8,
		"shared_latent_pct": 65.568792,
		"model_a_unique_pct": 20.682877,
		"model_b_unique_pct": 13.748332,
		"mean_cka": .82557,
		"mean_residual_fraction": .166074,
		"mean_r2_a_to_b": .833926,
		"mean_r2_b_to_a": .75016,
		"mean_orthogonal_residual": .212073,
		"background_mu": .002902,
		"background_sigma": .0064,
		"power_floor": .0064,
		"cert_threshold": .22,
		"uncertain_threshold": .3,
		"n_tokens": 75,
		"n_spans": 11,
		"lms_weights": [
			7.704612,
			.022799,
			.165836,
			1.268529
		]
	},
	"layers": [
		{
			"name": "embed",
			"depth": 0,
			"cka": .999678,
			"residual": .378406,
			"insampleResidual": 63e-6,
			"r2AB": .621594,
			"r2BA": .628913,
			"orthogonalResidual": .002965,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.0",
			"depth": .033333,
			"cka": .932421,
			"residual": .460328,
			"insampleResidual": .001273,
			"r2AB": .539672,
			"r2BA": .522002,
			"orthogonalResidual": .073924,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.1",
			"depth": .066667,
			"cka": .823019,
			"residual": .345584,
			"insampleResidual": .014,
			"r2AB": .654416,
			"r2BA": .566127,
			"orthogonalResidual": .293197,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.2",
			"depth": .1,
			"cka": .535745,
			"residual": .271955,
			"insampleResidual": .09825,
			"r2AB": .728045,
			"r2BA": .339944,
			"orthogonalResidual": .490634,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.3",
			"depth": .133333,
			"cka": .53391,
			"residual": .295322,
			"insampleResidual": .074991,
			"r2AB": .704678,
			"r2BA": .366955,
			"orthogonalResidual": .490506,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.4",
			"depth": .166667,
			"cka": .533555,
			"residual": .300385,
			"insampleResidual": .043485,
			"r2AB": .699615,
			"r2BA": .384798,
			"orthogonalResidual": .48886,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.5",
			"depth": .2,
			"cka": .530414,
			"residual": .312835,
			"insampleResidual": .043541,
			"r2AB": .687165,
			"r2BA": .370596,
			"orthogonalResidual": .489364,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.6",
			"depth": .233333,
			"cka": .529959,
			"residual": .322014,
			"insampleResidual": .035556,
			"r2AB": .677986,
			"r2BA": .359596,
			"orthogonalResidual": .48606,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.7",
			"depth": .266667,
			"cka": .524207,
			"residual": .330433,
			"insampleResidual": .032024,
			"r2AB": .669567,
			"r2BA": .328626,
			"orthogonalResidual": .489414,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.8",
			"depth": .3,
			"cka": .476598,
			"residual": .407447,
			"insampleResidual": .026393,
			"r2AB": .592553,
			"r2BA": .194925,
			"orthogonalResidual": .530865,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.9",
			"depth": .333333,
			"cka": .297654,
			"residual": .77396,
			"insampleResidual": .003744,
			"r2AB": .22604,
			"r2BA": 0,
			"orthogonalResidual": .509457,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.10",
			"depth": .366667,
			"cka": .960235,
			"residual": .416101,
			"insampleResidual": 643e-6,
			"r2AB": .583899,
			"r2BA": .555536,
			"orthogonalResidual": .054717,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.11",
			"depth": .4,
			"cka": .998306,
			"residual": .002362,
			"insampleResidual": .00172,
			"r2AB": .997638,
			"r2BA": .997542,
			"orthogonalResidual": .045627,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.12",
			"depth": .433333,
			"cka": .998305,
			"residual": .002373,
			"insampleResidual": .001729,
			"r2AB": .997627,
			"r2BA": .997524,
			"orthogonalResidual": .045678,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.13",
			"depth": .466667,
			"cka": .998301,
			"residual": .002388,
			"insampleResidual": .001741,
			"r2AB": .997612,
			"r2BA": .997502,
			"orthogonalResidual": .045744,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.14",
			"depth": .5,
			"cka": .998299,
			"residual": .002403,
			"insampleResidual": .001754,
			"r2AB": .997597,
			"r2BA": .997482,
			"orthogonalResidual": .045834,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.15",
			"depth": .533333,
			"cka": .998297,
			"residual": .00242,
			"insampleResidual": .001767,
			"r2AB": .99758,
			"r2BA": .997456,
			"orthogonalResidual": .045884,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.16",
			"depth": .566667,
			"cka": .998294,
			"residual": .002441,
			"insampleResidual": .001783,
			"r2AB": .997559,
			"r2BA": .99743,
			"orthogonalResidual": .04595,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.17",
			"depth": .6,
			"cka": .998292,
			"residual": .002456,
			"insampleResidual": .001795,
			"r2AB": .997544,
			"r2BA": .997407,
			"orthogonalResidual": .045996,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.18",
			"depth": .633333,
			"cka": .99829,
			"residual": .002465,
			"insampleResidual": .001802,
			"r2AB": .997535,
			"r2BA": .997391,
			"orthogonalResidual": .046047,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.19",
			"depth": .666667,
			"cka": .998287,
			"residual": .002502,
			"insampleResidual": .00183,
			"r2AB": .997498,
			"r2BA": .997333,
			"orthogonalResidual": .046117,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.20",
			"depth": .7,
			"cka": .998283,
			"residual": .002547,
			"insampleResidual": .001865,
			"r2AB": .997453,
			"r2BA": .997273,
			"orthogonalResidual": .046164,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.21",
			"depth": .733333,
			"cka": .99828,
			"residual": .00261,
			"insampleResidual": .00191,
			"r2AB": .99739,
			"r2BA": .997172,
			"orthogonalResidual": .046238,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.22",
			"depth": .766667,
			"cka": .998272,
			"residual": .002713,
			"insampleResidual": .001973,
			"r2AB": .997287,
			"r2BA": .997015,
			"orthogonalResidual": .046344,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.23",
			"depth": .8,
			"cka": .998267,
			"residual": .00285,
			"insampleResidual": .002049,
			"r2AB": .99715,
			"r2BA": .996807,
			"orthogonalResidual": .046487,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.24",
			"depth": .833333,
			"cka": .998265,
			"residual": .002933,
			"insampleResidual": .002086,
			"r2AB": .997067,
			"r2BA": .996687,
			"orthogonalResidual": .046598,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.25",
			"depth": .866667,
			"cka": .998262,
			"residual": .003057,
			"insampleResidual": .002133,
			"r2AB": .996943,
			"r2BA": .99649,
			"orthogonalResidual": .046653,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.26",
			"depth": .9,
			"cka": .998261,
			"residual": .003197,
			"insampleResidual": .002179,
			"r2AB": .996803,
			"r2BA": .996257,
			"orthogonalResidual": .046702,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.27",
			"depth": .933333,
			"cka": .998246,
			"residual": .003414,
			"insampleResidual": .002252,
			"r2AB": .996586,
			"r2BA": .995941,
			"orthogonalResidual": .046102,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.28",
			"depth": .966667,
			"cka": .987032,
			"residual": .037168,
			"insampleResidual": .0059,
			"r2AB": .962832,
			"r2BA": .939432,
			"orthogonalResidual": .345403,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		},
		{
			"name": "block.29",
			"depth": 1,
			"cka": .131547,
			"residual": .663557,
			"insampleResidual": .002653,
			"r2AB": .336443,
			"r2BA": .625545,
			"orthogonalResidual": .83562,
			"samples": 75,
			"widthA": 576,
			"widthB": 576
		}
	],
	"prompts": [
		{
			"id": "corpus/hf_prompts.txt:1",
			"file": "corpus/hf_prompts.txt",
			"line": 1,
			"text": "The capital of France is",
			"role": "continuation",
			"tokens": [
				"The",
				"capital",
				"of",
				"France",
				"is"
			],
			"series": [
				{
					"k": 0,
					"token": "The",
					"target": "capital",
					"jsd": .118968,
					"power": .014153,
					"ema": .004954,
					"lmsPrediction": 0,
					"innovation": .014153,
					"mu": .002902,
					"sigma": .0064,
					"threshold": .022102,
					"flagged": false,
					"entropyA": 8.646794,
					"entropyB": 7.441602,
					"normEntropyA": .800431,
					"normEntropyB": .688867,
					"perplexityA": 5691.871801,
					"perplexityB": 1705.479743,
					"top1A": "first",
					"top1B": "↵",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 0
				},
				{
					"k": 1,
					"token": "capital",
					"target": "of",
					"jsd": .020397,
					"power": 416e-6,
					"ema": .003366,
					"lmsPrediction": 0,
					"innovation": 416e-6,
					"mu": .003802,
					"sigma": .006915,
					"threshold": .024546,
					"flagged": false,
					"entropyA": 3.034184,
					"entropyB": 3.548504,
					"normEntropyA": .280873,
					"normEntropyB": .328484,
					"perplexityA": 20.784005,
					"perplexityB": 34.76128,
					"top1A": "of",
					"top1B": "of",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 1
				},
				{
					"k": 2,
					"token": "of",
					"target": "France",
					"jsd": .085286,
					"power": .007274,
					"ema": .004733,
					"lmsPrediction": 4e-6,
					"innovation": .007269,
					"mu": .003531,
					"sigma": .006701,
					"threshold": .023634,
					"flagged": false,
					"entropyA": 5.615115,
					"entropyB": 4.975618,
					"normEntropyA": .519789,
					"normEntropyB": .460591,
					"perplexityA": 274.545018,
					"perplexityB": 144.838331,
					"top1A": "the",
					"top1B": "the",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 2
				},
				{
					"k": 3,
					"token": "France",
					"target": "is",
					"jsd": .081677,
					"power": .006671,
					"ema": .005412,
					"lmsPrediction": 187e-6,
					"innovation": .006484,
					"mu": .003831,
					"sigma": .006514,
					"threshold": .023372,
					"flagged": false,
					"entropyA": 2.741368,
					"entropyB": 2.143443,
					"normEntropyA": .253768,
					"normEntropyB": .198418,
					"perplexityA": 15.508183,
					"perplexityB": 8.528752,
					"top1A": "is",
					"top1B": ",",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 3
				},
				{
					"k": 4,
					"token": "is",
					"target": "",
					"jsd": .189184,
					"power": .035791,
					"ema": .016044,
					"lmsPrediction": .001916,
					"innovation": .033875,
					"mu": .004058,
					"sigma": .006299,
					"threshold": .022956,
					"flagged": true,
					"entropyA": 4.411844,
					"entropyB": 2.123043,
					"normEntropyA": .408403,
					"normEntropyB": .196529,
					"perplexityA": 82.421315,
					"perplexityB": 8.356525,
					"top1A": "the",
					"top1B": "Paris",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 4
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:2",
			"file": "corpus/hf_prompts.txt",
			"line": 2,
			"text": "1, 2, 3, 4, 5,",
			"role": "continuation",
			"tokens": [
				"1",
				",",
				"␣",
				"2",
				",",
				"␣",
				"3",
				",",
				"␣",
				"4",
				",",
				"␣",
				"5",
				","
			],
			"series": [
				{
					"k": 0,
					"token": "1",
					"target": ",",
					"jsd": .297528,
					"power": .088523,
					"ema": .030983,
					"lmsPrediction": 0,
					"innovation": .088523,
					"mu": .004058,
					"sigma": .006299,
					"threshold": .022956,
					"flagged": true,
					"entropyA": 4.135337,
					"entropyB": 6.941885,
					"normEntropyA": .382807,
					"normEntropyB": .642608,
					"perplexityA": 62.510684,
					"perplexityB": 1034.719059,
					"top1A": "0",
					"top1B": ",",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 5
				},
				{
					"k": 1,
					"token": ",",
					"target": "␣",
					"jsd": .06888,
					"power": .004744,
					"ema": .021799,
					"lmsPrediction": .03054,
					"innovation": -.025795,
					"mu": .004058,
					"sigma": .006299,
					"threshold": .022956,
					"flagged": false,
					"entropyA": 5.080825,
					"entropyB": 4.075071,
					"normEntropyA": .47033,
					"normEntropyB": .377228,
					"perplexityA": 160.906781,
					"perplexityB": 58.85467,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 6
				},
				{
					"k": 2,
					"token": "␣",
					"target": "2",
					"jsd": .027789,
					"power": 772e-6,
					"ema": .01444,
					"lmsPrediction": .042842,
					"innovation": -.04207,
					"mu": .004113,
					"sigma": .006045,
					"threshold": .022249,
					"flagged": false,
					"entropyA": 1.90398,
					"entropyB": 2.165326,
					"normEntropyA": .176251,
					"normEntropyB": .200444,
					"perplexityA": 6.712558,
					"perplexityB": 8.717447,
					"top1A": "2",
					"top1B": "1",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 7
				},
				{
					"k": 3,
					"token": "2",
					"target": ",",
					"jsd": .184805,
					"power": .034153,
					"ema": .021339,
					"lmsPrediction": .014266,
					"innovation": .019887,
					"mu": .003846,
					"sigma": .005875,
					"threshold": .02147,
					"flagged": true,
					"entropyA": 1.80091,
					"entropyB": 2.852269,
					"normEntropyA": .16671,
					"normEntropyB": .264034,
					"perplexityA": 6.055157,
					"perplexityB": 17.327059,
					"top1A": "0",
					"top1B": ",",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 8
				},
				{
					"k": 4,
					"token": ",",
					"target": "␣",
					"jsd": .055203,
					"power": .003047,
					"ema": .014937,
					"lmsPrediction": .059005,
					"innovation": -.055958,
					"mu": .003846,
					"sigma": .005875,
					"threshold": .02147,
					"flagged": false,
					"entropyA": 1.505436,
					"entropyB": .393131,
					"normEntropyA": .139358,
					"normEntropyB": .036392,
					"perplexityA": 4.506118,
					"perplexityB": 1.481612,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 9
				},
				{
					"k": 5,
					"token": "␣",
					"target": "3",
					"jsd": .101858,
					"power": .010375,
					"ema": .01334,
					"lmsPrediction": .012911,
					"innovation": -.002536,
					"mu": .003782,
					"sigma": .00564,
					"threshold": .0207,
					"flagged": false,
					"entropyA": 1.717986,
					"entropyB": 1.138706,
					"normEntropyA": .159033,
					"normEntropyB": .10541,
					"perplexityA": 5.573295,
					"perplexityB": 3.122726,
					"top1A": "3",
					"top1B": "3",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 10
				},
				{
					"k": 6,
					"token": "3",
					"target": ",",
					"jsd": .044319,
					"power": .001964,
					"ema": .009359,
					"lmsPrediction": .009969,
					"innovation": -.008005,
					"mu": .004309,
					"sigma": .005722,
					"threshold": .021474,
					"flagged": false,
					"entropyA": 2.012706,
					"entropyB": 1.038584,
					"normEntropyA": .186316,
					"normEntropyB": .096141,
					"perplexityA": 7.483541,
					"perplexityB": 2.825213,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 11
				},
				{
					"k": 7,
					"token": ",",
					"target": "␣",
					"jsd": .028219,
					"power": 796e-6,
					"ema": .006362,
					"lmsPrediction": .015978,
					"innovation": -.015182,
					"mu": .004122,
					"sigma": .005528,
					"threshold": .020706,
					"flagged": false,
					"entropyA": .988385,
					"entropyB": .315084,
					"normEntropyA": .091494,
					"normEntropyB": .029167,
					"perplexityA": 2.68689,
					"perplexityB": 1.370374,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 12
				},
				{
					"k": 8,
					"token": "␣",
					"target": "4",
					"jsd": .017279,
					"power": 299e-6,
					"ema": .00424,
					"lmsPrediction": .002518,
					"innovation": -.00222,
					"mu": .003856,
					"sigma": .005385,
					"threshold": .020011,
					"flagged": false,
					"entropyA": 1.137958,
					"entropyB": .885608,
					"normEntropyA": .10534,
					"normEntropyB": .08198,
					"perplexityA": 3.120389,
					"perplexityB": 2.424459,
					"top1A": "4",
					"top1B": "4",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 13
				},
				{
					"k": 9,
					"token": "4",
					"target": ",",
					"jsd": .038074,
					"power": .00145,
					"ema": .003263,
					"lmsPrediction": .002441,
					"innovation": -991e-6,
					"mu": .003571,
					"sigma": .005262,
					"threshold": .019358,
					"flagged": false,
					"entropyA": 1.601193,
					"entropyB": .797376,
					"normEntropyA": .148222,
					"normEntropyB": .073813,
					"perplexityA": 4.958945,
					"perplexityB": 2.219708,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 14
				},
				{
					"k": 10,
					"token": ",",
					"target": "␣",
					"jsd": .017843,
					"power": 318e-6,
					"ema": .002233,
					"lmsPrediction": 621e-6,
					"innovation": -302e-6,
					"mu": .003401,
					"sigma": .005083,
					"threshold": .01865,
					"flagged": false,
					"entropyA": .736162,
					"entropyB": .215925,
					"normEntropyA": .068146,
					"normEntropyB": .019988,
					"perplexityA": 2.087907,
					"perplexityB": 1.241009,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 15
				},
				{
					"k": 11,
					"token": "␣",
					"target": "5",
					"jsd": .008853,
					"power": 78e-6,
					"ema": .001479,
					"lmsPrediction": 47e-5,
					"innovation": -392e-6,
					"mu": .003155,
					"sigma": .004953,
					"threshold": .018013,
					"flagged": false,
					"entropyA": .606783,
					"entropyB": .396889,
					"normEntropyA": .05617,
					"normEntropyB": .03674,
					"perplexityA": 1.834521,
					"perplexityB": 1.487191,
					"top1A": "5",
					"top1B": "5",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 16
				},
				{
					"k": 12,
					"token": "5",
					"target": ",",
					"jsd": .018347,
					"power": 337e-6,
					"ema": .001079,
					"lmsPrediction": 138e-6,
					"innovation": 199e-6,
					"mu": .002909,
					"sigma": .004829,
					"threshold": .017397,
					"flagged": false,
					"entropyA": 1.73213,
					"entropyB": 1.331765,
					"normEntropyA": .160343,
					"normEntropyB": .123281,
					"perplexityA": 5.652679,
					"perplexityB": 3.787722,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 17
				},
				{
					"k": 13,
					"token": ",",
					"target": "",
					"jsd": .010288,
					"power": 106e-6,
					"ema": 738e-6,
					"lmsPrediction": 243e-6,
					"innovation": -137e-6,
					"mu": .002703,
					"sigma": .004689,
					"threshold": .01677,
					"flagged": false,
					"entropyA": .61153,
					"entropyB": .304654,
					"normEntropyA": .056609,
					"normEntropyB": .028202,
					"perplexityA": 1.843249,
					"perplexityB": 1.356155,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 18
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:3",
			"file": "corpus/hf_prompts.txt",
			"line": 3,
			"text": "Once upon a time there was a",
			"role": "continuation",
			"tokens": [
				"Once",
				"upon",
				"a",
				"time",
				"there",
				"was",
				"a"
			],
			"series": [
				{
					"k": 0,
					"token": "Once",
					"target": "upon",
					"jsd": .178266,
					"power": .031779,
					"ema": .011123,
					"lmsPrediction": 0,
					"innovation": .031779,
					"mu": .002495,
					"sigma": .004557,
					"threshold": .016167,
					"flagged": true,
					"entropyA": 5.883109,
					"entropyB": 7.328139,
					"normEntropyA": .544598,
					"normEntropyB": .678364,
					"perplexityA": 358.923535,
					"perplexityB": 1522.546381,
					"top1A": "you",
					"top1B": "the",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 19
				},
				{
					"k": 1,
					"token": "upon",
					"target": "a",
					"jsd": .690504,
					"power": .476795,
					"ema": .174108,
					"lmsPrediction": .00278,
					"innovation": .474015,
					"mu": .002495,
					"sigma": .004557,
					"threshold": .016167,
					"flagged": true,
					"entropyA": .049577,
					"entropyB": 4.475858,
					"normEntropyA": .004589,
					"normEntropyB": .414329,
					"perplexityA": 1.050827,
					"perplexityB": 87.869999,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": "lost",
					"globalK": 20
				},
				{
					"k": 2,
					"token": "a",
					"target": "time",
					"jsd": .509594,
					"power": .259686,
					"ema": .20406,
					"lmsPrediction": 2.533781,
					"innovation": -2.274095,
					"mu": .002495,
					"sigma": .004557,
					"threshold": .016167,
					"flagged": true,
					"entropyA": .970041,
					"entropyB": 4.775884,
					"normEntropyA": .089796,
					"normEntropyB": .442102,
					"perplexityA": 2.638051,
					"perplexityB": 118.615129,
					"top1A": "time",
					"top1B": "sudden",
					"agree": false,
					"bucket": "soft",
					"kind": "lost",
					"globalK": 21
				},
				{
					"k": 3,
					"token": "time",
					"target": "there",
					"jsd": .042488,
					"power": .001805,
					"ema": .133271,
					"lmsPrediction": .974997,
					"innovation": -.973192,
					"mu": .002495,
					"sigma": .004557,
					"threshold": .016167,
					"flagged": false,
					"entropyA": .902642,
					"entropyB": .767921,
					"normEntropyA": .083557,
					"normEntropyB": .071086,
					"perplexityA": 2.466109,
					"perplexityB": 2.15528,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 22
				},
				{
					"k": 4,
					"token": "there",
					"target": "was",
					"jsd": .041842,
					"power": .001751,
					"ema": .087239,
					"lmsPrediction": -.108943,
					"innovation": .110694,
					"mu": .00244,
					"sigma": .004375,
					"threshold": .015566,
					"flagged": false,
					"entropyA": 1.053626,
					"entropyB": 1.180972,
					"normEntropyA": .097534,
					"normEntropyB": .109322,
					"perplexityA": 2.868033,
					"perplexityB": 3.257541,
					"top1A": "was",
					"top1B": "was",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 23
				},
				{
					"k": 5,
					"token": "was",
					"target": "a",
					"jsd": .013191,
					"power": 174e-6,
					"ema": .056766,
					"lmsPrediction": .077223,
					"innovation": -.077049,
					"mu": .002385,
					"sigma": .004201,
					"threshold": .014989,
					"flagged": false,
					"entropyA": .411895,
					"entropyB": .791482,
					"normEntropyA": .038129,
					"normEntropyB": .073267,
					"perplexityA": 1.509676,
					"perplexityB": 2.206664,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 24
				},
				{
					"k": 6,
					"token": "a",
					"target": "",
					"jsd": .174016,
					"power": .030282,
					"ema": .047497,
					"lmsPrediction": .016301,
					"innovation": .01398,
					"mu": .002208,
					"sigma": .004078,
					"threshold": .014442,
					"flagged": true,
					"entropyA": 4.349212,
					"entropyB": 4.462602,
					"normEntropyA": .402605,
					"normEntropyB": .413102,
					"perplexityA": 77.41741,
					"perplexityB": 86.712866,
					"top1A": "little",
					"top1B": "man",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 25
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:4",
			"file": "corpus/hf_prompts.txt",
			"line": 4,
			"text": "Water boils at a temperature of",
			"role": "factual",
			"tokens": [
				"Water",
				"boils",
				"at",
				"a",
				"temperature",
				"of"
			],
			"series": [
				{
					"k": 0,
					"token": "Water",
					"target": "boils",
					"jsd": .06459,
					"power": .004172,
					"ema": .00146,
					"lmsPrediction": 0,
					"innovation": .004172,
					"mu": .002208,
					"sigma": .004078,
					"threshold": .014442,
					"flagged": false,
					"entropyA": 9.281362,
					"entropyB": 7.224373,
					"normEntropyA": .859173,
					"normEntropyB": .668758,
					"perplexityA": 10736.044978,
					"perplexityB": 1372.478204,
					"top1A": ".",
					"top1B": "the",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 26
				},
				{
					"k": 1,
					"token": "boils",
					"target": "at",
					"jsd": .667532,
					"power": .4456,
					"ema": .156909,
					"lmsPrediction": .013943,
					"innovation": .431657,
					"mu": .002365,
					"sigma": .003951,
					"threshold": .014217,
					"flagged": true,
					"entropyA": 4.488806,
					"entropyB": .490917,
					"normEntropyA": .415527,
					"normEntropyB": .045444,
					"perplexityA": 89.015104,
					"perplexityB": 1.633814,
					"top1A": "at",
					"top1B": "down",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 27
				},
				{
					"k": 2,
					"token": "at",
					"target": "a",
					"jsd": .04118,
					"power": .001696,
					"ema": .102584,
					"lmsPrediction": 16.747236,
					"innovation": -16.74554,
					"mu": .002365,
					"sigma": .003951,
					"threshold": .014217,
					"flagged": false,
					"entropyA": 2.345098,
					"entropyB": 2.910074,
					"normEntropyA": .217085,
					"normEntropyB": .269385,
					"perplexityA": 10.434298,
					"perplexityB": 18.358165,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 28
				},
				{
					"k": 3,
					"token": "a",
					"target": "temperature",
					"jsd": .087955,
					"power": .007736,
					"ema": .069387,
					"lmsPrediction": -.21682,
					"innovation": .224556,
					"mu": .002311,
					"sigma": .003794,
					"threshold": .013694,
					"flagged": false,
					"entropyA": 3.683296,
					"entropyB": 4.811782,
					"normEntropyA": .340962,
					"normEntropyB": .445425,
					"perplexityA": 39.777267,
					"perplexityB": 122.950463,
					"top1A": "lower",
					"top1B": "temperature",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 29
				},
				{
					"k": 4,
					"token": "temperature",
					"target": "of",
					"jsd": .028414,
					"power": 807e-6,
					"ema": .045384,
					"lmsPrediction": .215392,
					"innovation": -.214584,
					"mu": .002745,
					"sigma": .003949,
					"threshold": .014594,
					"flagged": false,
					"entropyA": 1.387373,
					"entropyB": 1.80004,
					"normEntropyA": .128429,
					"normEntropyB": .166629,
					"perplexityA": 4.004316,
					"perplexityB": 6.049887,
					"top1A": "of",
					"top1B": "of",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 30
				},
				{
					"k": 5,
					"token": "of",
					"target": "",
					"jsd": .113202,
					"power": .012815,
					"ema": .033985,
					"lmsPrediction": .052274,
					"innovation": -.039459,
					"mu": .00259,
					"sigma": .003828,
					"threshold": .014073,
					"flagged": false,
					"entropyA": 1.523306,
					"entropyB": 1.901621,
					"normEntropyA": .141012,
					"normEntropyB": .176032,
					"perplexityA": 4.587368,
					"perplexityB": 6.696743,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 31
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:5",
			"file": "corpus/hf_prompts.txt",
			"line": 5,
			"text": "def add(a, b): return",
			"role": "code",
			"tokens": [
				"def",
				"add",
				"(",
				"a",
				",",
				"b",
				"):",
				"return"
			],
			"series": [
				{
					"k": 0,
					"token": "def",
					"target": "add",
					"jsd": .11765,
					"power": .013842,
					"ema": .004845,
					"lmsPrediction": 0,
					"innovation": .013842,
					"mu": .003408,
					"sigma": .004673,
					"threshold": .017429,
					"flagged": false,
					"entropyA": 7.665328,
					"entropyB": 7.617972,
					"normEntropyA": .709577,
					"normEntropyB": .705193,
					"perplexityA": 2133.092875,
					"perplexityB": 2034.43151,
					"top1A": "_",
					"top1B": "↵",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 32
				},
				{
					"k": 1,
					"token": "add",
					"target": "(",
					"jsd": .04515,
					"power": .002039,
					"ema": .003862,
					"lmsPrediction": .338202,
					"innovation": -.336163,
					"mu": .004243,
					"sigma": .005367,
					"threshold": .020343,
					"flagged": false,
					"entropyA": 5.601516,
					"entropyB": 4.612733,
					"normEntropyA": .518531,
					"normEntropyB": .426999,
					"perplexityA": 270.836573,
					"perplexityB": 100.759142,
					"top1A": "_",
					"top1B": "_",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 33
				},
				{
					"k": 2,
					"token": "(",
					"target": "a",
					"jsd": .068699,
					"power": .00472,
					"ema": .004162,
					"lmsPrediction": .026966,
					"innovation": -.022247,
					"mu": .004067,
					"sigma": .005185,
					"threshold": .019622,
					"flagged": false,
					"entropyA": 5.932545,
					"entropyB": 4.538962,
					"normEntropyA": .549174,
					"normEntropyB": .42017,
					"perplexityA": 377.113156,
					"perplexityB": 93.593591,
					"top1A": "self",
					"top1B": "self",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 34
				},
				{
					"k": 3,
					"token": "a",
					"target": ",",
					"jsd": .052429,
					"power": .002749,
					"ema": .003668,
					"lmsPrediction": .071579,
					"innovation": -.06883,
					"mu": .004119,
					"sigma": .004977,
					"threshold": .01905,
					"flagged": false,
					"entropyA": 1.640488,
					"entropyB": .836414,
					"normEntropyA": .151859,
					"normEntropyB": .077427,
					"perplexityA": 5.157686,
					"perplexityB": 2.308076,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 35
				},
				{
					"k": 4,
					"token": ",",
					"target": "b",
					"jsd": .130156,
					"power": .016941,
					"ema": .008313,
					"lmsPrediction": .034075,
					"innovation": -.017135,
					"mu": .004009,
					"sigma": .004789,
					"threshold": .018377,
					"flagged": false,
					"entropyA": 1.409617,
					"entropyB": .223953,
					"normEntropyA": .130488,
					"normEntropyB": .020731,
					"perplexityA": 4.094388,
					"perplexityB": 1.251013,
					"top1A": "b",
					"top1B": "b",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 36
				},
				{
					"k": 5,
					"token": "b",
					"target": "):",
					"jsd": .015746,
					"power": 248e-6,
					"ema": .00549,
					"lmsPrediction": .2471,
					"innovation": -.246852,
					"mu": .005044,
					"sigma": .005872,
					"threshold": .02266,
					"flagged": false,
					"entropyA": 1.05425,
					"entropyB": .796118,
					"normEntropyA": .097592,
					"normEntropyB": .073696,
					"perplexityA": 2.869821,
					"perplexityB": 2.216919,
					"top1A": "):",
					"top1B": "):",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 37
				},
				{
					"k": 6,
					"token": "):",
					"target": "return",
					"jsd": .143657,
					"power": .020637,
					"ema": .010792,
					"lmsPrediction": -.044073,
					"innovation": .064711,
					"mu": .00466,
					"sigma": .005793,
					"threshold": .02204,
					"flagged": false,
					"entropyA": 2.01393,
					"entropyB": .545046,
					"normEntropyA": .186429,
					"normEntropyB": .050455,
					"perplexityA": 7.492704,
					"perplexityB": 1.724687,
					"top1A": "↵",
					"top1B": "↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 38
				},
				{
					"k": 7,
					"token": "return",
					"target": "",
					"jsd": .040784,
					"power": .001663,
					"ema": .007597,
					"lmsPrediction": .174067,
					"innovation": -.172404,
					"mu": .005938,
					"sigma": .007162,
					"threshold": .027425,
					"flagged": false,
					"entropyA": 2.206638,
					"entropyB": 1.170215,
					"normEntropyA": .204268,
					"normEntropyB": .108326,
					"perplexityA": 9.085118,
					"perplexityB": 3.222686,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 39
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:6",
			"file": "corpus/hf_prompts.txt",
			"line": 6,
			"text": "User: Explain gravity in one sentence. Assistant:",
			"role": "instruction",
			"tokens": [
				"User",
				":",
				"Explain",
				"gravity",
				"in",
				"one",
				"sentence",
				".",
				"Assistant",
				":"
			],
			"series": [
				{
					"k": 0,
					"token": "User",
					"target": ":",
					"jsd": .1032,
					"power": .01065,
					"ema": .003728,
					"lmsPrediction": 0,
					"innovation": .01065,
					"mu": .005596,
					"sigma": .006975,
					"threshold": .026523,
					"flagged": false,
					"entropyA": 8.093286,
					"entropyB": 7.226914,
					"normEntropyA": .749193,
					"normEntropyB": .668993,
					"perplexityA": 3272.423861,
					"perplexityB": 1375.970109,
					"top1A": "_",
					"top1B": "the",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 40
				},
				{
					"k": 1,
					"token": ":",
					"target": "Explain",
					"jsd": .124971,
					"power": .015618,
					"ema": .007889,
					"lmsPrediction": .096394,
					"innovation": -.080776,
					"mu": .006001,
					"sigma": .006842,
					"threshold": .026526,
					"flagged": false,
					"entropyA": 6.906496,
					"entropyB": 5.934904,
					"normEntropyA": .639332,
					"normEntropyB": .549392,
					"perplexityA": 998.741047,
					"perplexityB": 378.003828,
					"top1A": "<",
					"top1B": "␣",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 41
				},
				{
					"k": 2,
					"token": "Explain",
					"target": "gravity",
					"jsd": .066172,
					"power": .004379,
					"ema": .00666,
					"lmsPrediction": .091172,
					"innovation": -.086794,
					"mu": .00677,
					"sigma": .007104,
					"threshold": .028081,
					"flagged": false,
					"entropyA": 4.878526,
					"entropyB": 3.347033,
					"normEntropyA": .451604,
					"normEntropyB": .309834,
					"perplexityA": 131.436837,
					"perplexityB": 28.418292,
					"top1A": "the",
					"top1B": "the",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 42
				},
				{
					"k": 3,
					"token": "gravity",
					"target": "in",
					"jsd": .049711,
					"power": .002471,
					"ema": .005194,
					"lmsPrediction": -.049552,
					"innovation": .052023,
					"mu": .006579,
					"sigma": .006847,
					"threshold": .02712,
					"flagged": false,
					"entropyA": 4.218764,
					"entropyB": 3.369341,
					"normEntropyA": .39053,
					"normEntropyB": .311899,
					"perplexityA": 67.949442,
					"perplexityB": 29.059366,
					"top1A": ".",
					"top1B": ",",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 43
				},
				{
					"k": 4,
					"token": "in",
					"target": "one",
					"jsd": .188783,
					"power": .035639,
					"ema": .01585,
					"lmsPrediction": -.056488,
					"innovation": .092127,
					"mu": .00625,
					"sigma": .006669,
					"threshold": .026259,
					"flagged": true,
					"entropyA": 4.206606,
					"entropyB": 3.286635,
					"normEntropyA": .389404,
					"normEntropyB": .304243,
					"perplexityA": 67.128349,
					"perplexityB": 26.752689,
					"top1A": "terms",
					"top1B": "a",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 44
				},
				{
					"k": 5,
					"token": "one",
					"target": "sentence",
					"jsd": .189624,
					"power": .035957,
					"ema": .022887,
					"lmsPrediction": .186838,
					"innovation": -.150881,
					"mu": .00625,
					"sigma": .006669,
					"threshold": .026259,
					"flagged": true,
					"entropyA": 3.267169,
					"entropyB": 2.265158,
					"normEntropyA": .302441,
					"normEntropyB": .209685,
					"perplexityA": 26.236953,
					"perplexityB": 9.63265,
					"top1A": "sentence",
					"top1B": "sentence",
					"agree": true,
					"bucket": "identical",
					"kind": "acquired",
					"globalK": 45
				},
				{
					"k": 6,
					"token": "sentence",
					"target": ".",
					"jsd": .089753,
					"power": .008056,
					"ema": .017696,
					"lmsPrediction": .1208,
					"innovation": -.112744,
					"mu": .00625,
					"sigma": .006669,
					"threshold": .026259,
					"flagged": false,
					"entropyA": 2.762907,
					"entropyB": 1.22506,
					"normEntropyA": .255761,
					"normEntropyB": .113403,
					"perplexityA": 15.845842,
					"perplexityB": 3.404372,
					"top1A": ".",
					"top1B": ".",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 46
				},
				{
					"k": 7,
					"token": ".",
					"target": "Assistant",
					"jsd": .116724,
					"power": .013624,
					"ema": .016271,
					"lmsPrediction": -.106688,
					"innovation": .120313,
					"mu": .006395,
					"sigma": .006418,
					"threshold": .025647,
					"flagged": false,
					"entropyA": 4.679765,
					"entropyB": 3.693633,
					"normEntropyA": .433204,
					"normEntropyB": .341918,
					"perplexityA": 107.744802,
					"perplexityB": 40.190578,
					"top1A": "↵",
					"top1B": "↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 47
				},
				{
					"k": 8,
					"token": "Assistant",
					"target": ":",
					"jsd": .076089,
					"power": .00579,
					"ema": .012603,
					"lmsPrediction": -.038551,
					"innovation": .044341,
					"mu": .006973,
					"sigma": .006486,
					"threshold": .026432,
					"flagged": false,
					"entropyA": 2.711928,
					"entropyB": .930156,
					"normEntropyA": .251042,
					"normEntropyB": .086104,
					"perplexityA": 15.058285,
					"perplexityB": 2.534904,
					"top1A": ":",
					"top1B": ":",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 48
				},
				{
					"k": 9,
					"token": ":",
					"target": "",
					"jsd": .228883,
					"power": .052387,
					"ema": .026527,
					"lmsPrediction": -.008352,
					"innovation": .06074,
					"mu": .006878,
					"sigma": .00623,
					"threshold": .025569,
					"flagged": true,
					"entropyA": 3.008964,
					"entropyB": 5.261131,
					"normEntropyA": .278539,
					"normEntropyB": .487021,
					"perplexityA": 20.2664,
					"perplexityB": 192.699322,
					"top1A": "Explain",
					"top1B": "Explain",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 49
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:7",
			"file": "corpus/hf_prompts.txt",
			"line": 7,
			"text": "User: Write a haiku about rain. Assistant:",
			"role": "instruction",
			"tokens": [
				"User",
				":",
				"Write",
				"a",
				"ha",
				"iku",
				"about",
				"rain",
				".",
				"Assistant",
				":"
			],
			"series": [
				{
					"k": 0,
					"token": "User",
					"target": ":",
					"jsd": .1032,
					"power": .01065,
					"ema": .003728,
					"lmsPrediction": 0,
					"innovation": .01065,
					"mu": .006878,
					"sigma": .00623,
					"threshold": .025569,
					"flagged": false,
					"entropyA": 8.093286,
					"entropyB": 7.226914,
					"normEntropyA": .749193,
					"normEntropyB": .668993,
					"perplexityA": 3272.423861,
					"perplexityB": 1375.970109,
					"top1A": "_",
					"top1B": "the",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 50
				},
				{
					"k": 1,
					"token": ":",
					"target": "Write",
					"jsd": .124971,
					"power": .015618,
					"ema": .007889,
					"lmsPrediction": .042883,
					"innovation": -.027265,
					"mu": .00718,
					"sigma": .00607,
					"threshold": .025391,
					"flagged": false,
					"entropyA": 6.906496,
					"entropyB": 5.934904,
					"normEntropyA": .639332,
					"normEntropyB": .549392,
					"perplexityA": 998.741047,
					"perplexityB": 378.003828,
					"top1A": "<",
					"top1B": "␣",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 51
				},
				{
					"k": 2,
					"token": "Write",
					"target": "a",
					"jsd": .19255,
					"power": .037075,
					"ema": .018104,
					"lmsPrediction": .044115,
					"innovation": -.007039,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": true,
					"entropyA": 4.758233,
					"entropyB": 2.362454,
					"normEntropyA": .440468,
					"normEntropyB": .218692,
					"perplexityA": 116.539871,
					"perplexityB": 10.616975,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": "acquired",
					"globalK": 52
				},
				{
					"k": 3,
					"token": "a",
					"target": "ha",
					"jsd": .554801,
					"power": .307804,
					"ema": .119499,
					"lmsPrediction": .086392,
					"innovation": .221412,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": true,
					"entropyA": 6.012896,
					"entropyB": 2.046336,
					"normEntropyA": .556612,
					"normEntropyB": .189429,
					"perplexityA": 408.66515,
					"perplexityB": 7.739494,
					"top1A": "comment",
					"top1B": "Python",
					"agree": false,
					"bucket": "soft",
					"kind": "acquired",
					"globalK": 53
				},
				{
					"k": 4,
					"token": "ha",
					"target": "iku",
					"jsd": .164229,
					"power": .026971,
					"ema": .087115,
					"lmsPrediction": 1.433668,
					"innovation": -1.406697,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": true,
					"entropyA": 3.508366,
					"entropyB": 1.312214,
					"normEntropyA": .324768,
					"normEntropyB": .121471,
					"perplexityA": 33.39365,
					"perplexityB": 3.714387,
					"top1A": "iku",
					"top1B": "iku",
					"agree": true,
					"bucket": "identical",
					"kind": "acquired",
					"globalK": 54
				},
				{
					"k": 5,
					"token": "iku",
					"target": "about",
					"jsd": .132748,
					"power": .017622,
					"ema": .062792,
					"lmsPrediction": .033097,
					"innovation": -.015475,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": true,
					"entropyA": 3.868468,
					"entropyB": 2.815866,
					"normEntropyA": .358103,
					"normEntropyB": .260664,
					"perplexityA": 47.86901,
					"perplexityB": 16.707635,
					"top1A": "about",
					"top1B": "poem",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 55
				},
				{
					"k": 6,
					"token": "about",
					"target": "rain",
					"jsd": .27985,
					"power": .078316,
					"ema": .068225,
					"lmsPrediction": -.327542,
					"innovation": .405858,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": true,
					"entropyA": 4.649784,
					"entropyB": 3.109082,
					"normEntropyA": .430429,
					"normEntropyB": .287807,
					"perplexityA": 104.562425,
					"perplexityB": 22.400466,
					"top1A": "your",
					"top1B": "a",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 56
				},
				{
					"k": 7,
					"token": "rain",
					"target": ".",
					"jsd": .053872,
					"power": .002902,
					"ema": .045362,
					"lmsPrediction": .302592,
					"innovation": -.29969,
					"mu": .007855,
					"sigma": .006293,
					"threshold": .026733,
					"flagged": false,
					"entropyA": 3.234739,
					"entropyB": 2.50239,
					"normEntropyA": .299439,
					"normEntropyB": .231645,
					"perplexityA": 25.399737,
					"perplexityB": 12.21165,
					"top1A": ".",
					"top1B": ".",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 57
				},
				{
					"k": 8,
					"token": ".",
					"target": "Assistant",
					"jsd": .190542,
					"power": .036306,
					"ema": .042193,
					"lmsPrediction": -.00916,
					"innovation": .045466,
					"mu": .007459,
					"sigma": .006196,
					"threshold": .026047,
					"flagged": true,
					"entropyA": 3.944482,
					"entropyB": 1.85322,
					"normEntropyA": .365139,
					"normEntropyB": .171552,
					"perplexityA": 51.649573,
					"perplexityB": 6.380331,
					"top1A": "↵",
					"top1B": "↵",
					"agree": true,
					"bucket": "identical",
					"kind": "acquired",
					"globalK": 58
				},
				{
					"k": 9,
					"token": "Assistant",
					"target": ":",
					"jsd": .125978,
					"power": .01587,
					"ema": .03298,
					"lmsPrediction": .049011,
					"innovation": -.03314,
					"mu": .007459,
					"sigma": .006196,
					"threshold": .026047,
					"flagged": true,
					"entropyA": 2.932479,
					"entropyB": .702734,
					"normEntropyA": .271459,
					"normEntropyB": .065052,
					"perplexityA": 18.774108,
					"perplexityB": 2.019265,
					"top1A": ":",
					"top1B": ":",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 59
				},
				{
					"k": 10,
					"token": ":",
					"target": "",
					"jsd": .135894,
					"power": .018467,
					"ema": .0279,
					"lmsPrediction": .048362,
					"innovation": -.029894,
					"mu": .007459,
					"sigma": .006196,
					"threshold": .026047,
					"flagged": true,
					"entropyA": 4.447108,
					"entropyB": 5.453247,
					"normEntropyA": .411667,
					"normEntropyB": .504805,
					"perplexityA": 85.379711,
					"perplexityB": 233.515218,
					"top1A": "Write",
					"top1B": "Write",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 60
				}
			]
		},
		{
			"id": "corpus/hf_prompts.txt:8",
			"file": "corpus/hf_prompts.txt",
			"line": 8,
			"text": "User: What is 17 plus 26? Assistant:",
			"role": "dialogue",
			"tokens": [
				"User",
				":",
				"What",
				"is",
				"␣",
				"1",
				"7",
				"plus",
				"␣",
				"2",
				"6",
				"?",
				"Assistant",
				":"
			],
			"series": [
				{
					"k": 0,
					"token": "User",
					"target": ":",
					"jsd": .1032,
					"power": .01065,
					"ema": .003728,
					"lmsPrediction": 0,
					"innovation": .01065,
					"mu": .007459,
					"sigma": .006196,
					"threshold": .026047,
					"flagged": false,
					"entropyA": 8.093286,
					"entropyB": 7.226914,
					"normEntropyA": .749193,
					"normEntropyB": .668993,
					"perplexityA": 3272.423861,
					"perplexityB": 1375.970109,
					"top1A": "_",
					"top1B": "the",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 61
				},
				{
					"k": 1,
					"token": ":",
					"target": "What",
					"jsd": .124971,
					"power": .015618,
					"ema": .007889,
					"lmsPrediction": .03187,
					"innovation": -.016253,
					"mu": .007714,
					"sigma": .006011,
					"threshold": .025748,
					"flagged": false,
					"entropyA": 6.906496,
					"entropyB": 5.934904,
					"normEntropyA": .639332,
					"normEntropyB": .549392,
					"perplexityA": 998.741047,
					"perplexityB": 378.003828,
					"top1A": "<",
					"top1B": "␣",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 62
				},
				{
					"k": 2,
					"token": "What",
					"target": "is",
					"jsd": .036882,
					"power": .00136,
					"ema": .005604,
					"lmsPrediction": .039533,
					"innovation": -.038173,
					"mu": .008346,
					"sigma": .006184,
					"threshold": .026899,
					"flagged": false,
					"entropyA": 4.338076,
					"entropyB": 3.615301,
					"normEntropyA": .401574,
					"normEntropyB": .334667,
					"perplexityA": 76.560124,
					"perplexityB": 37.162532,
					"top1A": "is",
					"top1B": "is",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 63
				},
				{
					"k": 3,
					"token": "is",
					"target": "␣",
					"jsd": .095251,
					"power": .009073,
					"ema": .006818,
					"lmsPrediction": -.011906,
					"innovation": .020979,
					"mu": .007788,
					"sigma": .006252,
					"threshold": .026544,
					"flagged": false,
					"entropyA": 3.651037,
					"entropyB": 1.649823,
					"normEntropyA": .337975,
					"normEntropyB": .152724,
					"perplexityA": 38.514597,
					"perplexityB": 5.20606,
					"top1A": "the",
					"top1B": "the",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 64
				},
				{
					"k": 4,
					"token": "␣",
					"target": "1",
					"jsd": .009548,
					"power": 91e-6,
					"ema": .004464,
					"lmsPrediction": .004891,
					"innovation": -.0048,
					"mu": .00789,
					"sigma": .006008,
					"threshold": .025914,
					"flagged": false,
					"entropyA": 2.740612,
					"entropyB": 2.572976,
					"normEntropyA": .253698,
					"normEntropyB": .23818,
					"perplexityA": 15.496459,
					"perplexityB": 13.104773,
					"top1A": "1",
					"top1B": "1",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 65
				},
				{
					"k": 5,
					"token": "1",
					"target": "7",
					"jsd": .009528,
					"power": 91e-6,
					"ema": .002933,
					"lmsPrediction": -.003457,
					"innovation": .003548,
					"mu": .007266,
					"sigma": .00617,
					"threshold": .025777,
					"flagged": false,
					"entropyA": 3.553321,
					"entropyB": 3.321091,
					"normEntropyA": .32893,
					"normEntropyB": .307432,
					"perplexityA": 34.929141,
					"perplexityB": 27.690549,
					"top1A": "0",
					"top1B": "0",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 66
				},
				{
					"k": 6,
					"token": "7",
					"target": "plus",
					"jsd": .03056,
					"power": 934e-6,
					"ema": .002233,
					"lmsPrediction": -.006875,
					"innovation": .007809,
					"mu": .006692,
					"sigma": .006257,
					"threshold": .025462,
					"flagged": false,
					"entropyA": 4.374693,
					"entropyB": 4.4048,
					"normEntropyA": .404964,
					"normEntropyB": .407751,
					"perplexityA": 79.415495,
					"perplexityB": 81.842753,
					"top1A": "0",
					"top1B": "%",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 67
				},
				{
					"k": 7,
					"token": "plus",
					"target": "␣",
					"jsd": .022798,
					"power": 52e-5,
					"ema": .001634,
					"lmsPrediction": .001057,
					"innovation": -538e-6,
					"mu": .006232,
					"sigma": .006218,
					"threshold": .024886,
					"flagged": false,
					"entropyA": 1.590411,
					"entropyB": .857487,
					"normEntropyA": .147224,
					"normEntropyB": .079377,
					"perplexityA": 4.905765,
					"perplexityB": 2.35723,
					"top1A": "␣",
					"top1B": "␣",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 68
				},
				{
					"k": 8,
					"token": "␣",
					"target": "2",
					"jsd": .004869,
					"power": 24e-6,
					"ema": .00107,
					"lmsPrediction": 973e-6,
					"innovation": -95e-5,
					"mu": .005775,
					"sigma": .006179,
					"threshold": .024312,
					"flagged": false,
					"entropyA": 1.944142,
					"entropyB": 1.809505,
					"normEntropyA": .179969,
					"normEntropyB": .167505,
					"perplexityA": 6.987633,
					"perplexityB": 6.107423,
					"top1A": "1",
					"top1B": "1",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 69
				},
				{
					"k": 9,
					"token": "2",
					"target": "6",
					"jsd": .030702,
					"power": 943e-6,
					"ema": .001026,
					"lmsPrediction": -465e-6,
					"innovation": .001408,
					"mu": .005315,
					"sigma": .006146,
					"threshold": .023753,
					"flagged": false,
					"entropyA": 2.624387,
					"entropyB": 2.82068,
					"normEntropyA": .242939,
					"normEntropyB": .261109,
					"perplexityA": 13.796117,
					"perplexityB": 16.788267,
					"top1A": "7",
					"top1B": "0",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 70
				},
				{
					"k": 10,
					"token": "6",
					"target": "?",
					"jsd": .095003,
					"power": .009026,
					"ema": .003826,
					"lmsPrediction": .001478,
					"innovation": .007548,
					"mu": .004965,
					"sigma": .006023,
					"threshold": .023035,
					"flagged": false,
					"entropyA": 2.883199,
					"entropyB": 2.151332,
					"normEntropyA": .266897,
					"normEntropyB": .199148,
					"perplexityA": 17.871358,
					"perplexityB": 8.596299,
					"top1A": "?",
					"top1B": "?",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 71
				},
				{
					"k": 11,
					"token": "?",
					"target": "Assistant",
					"jsd": .523625,
					"power": .274183,
					"ema": .098451,
					"lmsPrediction": .024094,
					"innovation": .250089,
					"mu": .00529,
					"sigma": .005891,
					"threshold": .022961,
					"flagged": true,
					"entropyA": 2.838977,
					"entropyB": 1.370221,
					"normEntropyA": .262803,
					"normEntropyB": .126841,
					"perplexityA": 17.098262,
					"perplexityB": 3.936221,
					"top1A": "↵",
					"top1B": "<|im_end|>",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 72
				},
				{
					"k": 12,
					"token": "Assistant",
					"target": ":",
					"jsd": .263273,
					"power": .069313,
					"ema": .088252,
					"lmsPrediction": 3.318909,
					"innovation": -3.249596,
					"mu": .00529,
					"sigma": .005891,
					"threshold": .022961,
					"flagged": true,
					"entropyA": 4.349071,
					"entropyB": .85485,
					"normEntropyA": .402592,
					"normEntropyB": .079133,
					"perplexityA": 77.406547,
					"perplexityB": 2.351021,
					"top1A": ":",
					"top1B": ":",
					"agree": true,
					"bucket": "identical",
					"kind": "acquired",
					"globalK": 73
				},
				{
					"k": 13,
					"token": ":",
					"target": "",
					"jsd": .260008,
					"power": .067604,
					"ema": .081026,
					"lmsPrediction": .798932,
					"innovation": -.731328,
					"mu": .00529,
					"sigma": .005891,
					"threshold": .022961,
					"flagged": true,
					"entropyA": 4.771525,
					"entropyB": 3.552685,
					"normEntropyA": .441699,
					"normEntropyB": .328871,
					"perplexityA": 118.099252,
					"perplexityB": 34.90692,
					"top1A": "␣",
					"top1B": "To",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 74
				}
			]
		}
	],
	"stream": [
		{
			"global_k": 0,
			"jsd": .118968,
			"threshold": .022102,
			"promptId": "corpus/hf_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 1,
			"jsd": .020397,
			"threshold": .024546,
			"promptId": "corpus/hf_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 2,
			"jsd": .085286,
			"threshold": .023634,
			"promptId": "corpus/hf_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 3,
			"jsd": .081677,
			"threshold": .023372,
			"promptId": "corpus/hf_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 4,
			"jsd": .189184,
			"threshold": .022956,
			"promptId": "corpus/hf_prompts.txt:1",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 5,
			"jsd": .297528,
			"threshold": .022956,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 6,
			"jsd": .06888,
			"threshold": .022956,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 7,
			"jsd": .027789,
			"threshold": .022249,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 8,
			"jsd": .184805,
			"threshold": .02147,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 9,
			"jsd": .055203,
			"threshold": .02147,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 10,
			"jsd": .101858,
			"threshold": .0207,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 11,
			"jsd": .044319,
			"threshold": .021474,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 12,
			"jsd": .028219,
			"threshold": .020706,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 13,
			"jsd": .017279,
			"threshold": .020011,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 14,
			"jsd": .038074,
			"threshold": .019358,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 15,
			"jsd": .017843,
			"threshold": .01865,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 16,
			"jsd": .008853,
			"threshold": .018013,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 17,
			"jsd": .018347,
			"threshold": .017397,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 18,
			"jsd": .010288,
			"threshold": .01677,
			"promptId": "corpus/hf_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 19,
			"jsd": .178266,
			"threshold": .016167,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 20,
			"jsd": .690504,
			"threshold": .016167,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 21,
			"jsd": .509594,
			"threshold": .016167,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": true,
			"kind": "lost"
		},
		{
			"global_k": 22,
			"jsd": .042488,
			"threshold": .016167,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 23,
			"jsd": .041842,
			"threshold": .015566,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 24,
			"jsd": .013191,
			"threshold": .014989,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 25,
			"jsd": .174016,
			"threshold": .014442,
			"promptId": "corpus/hf_prompts.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 26,
			"jsd": .06459,
			"threshold": .014442,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 27,
			"jsd": .667532,
			"threshold": .014217,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 28,
			"jsd": .04118,
			"threshold": .014217,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 29,
			"jsd": .087955,
			"threshold": .013694,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 30,
			"jsd": .028414,
			"threshold": .014594,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 31,
			"jsd": .113202,
			"threshold": .014073,
			"promptId": "corpus/hf_prompts.txt:4",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 32,
			"jsd": .11765,
			"threshold": .017429,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 33,
			"jsd": .04515,
			"threshold": .020343,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 34,
			"jsd": .068699,
			"threshold": .019622,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 35,
			"jsd": .052429,
			"threshold": .01905,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 36,
			"jsd": .130156,
			"threshold": .018377,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 37,
			"jsd": .015746,
			"threshold": .02266,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 38,
			"jsd": .143657,
			"threshold": .02204,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 39,
			"jsd": .040784,
			"threshold": .027425,
			"promptId": "corpus/hf_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 40,
			"jsd": .1032,
			"threshold": .026523,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 41,
			"jsd": .124971,
			"threshold": .026526,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 42,
			"jsd": .066172,
			"threshold": .028081,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 43,
			"jsd": .049711,
			"threshold": .02712,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 44,
			"jsd": .188783,
			"threshold": .026259,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 45,
			"jsd": .189624,
			"threshold": .026259,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 46,
			"jsd": .089753,
			"threshold": .026259,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 47,
			"jsd": .116724,
			"threshold": .025647,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 48,
			"jsd": .076089,
			"threshold": .026432,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 49,
			"jsd": .228883,
			"threshold": .025569,
			"promptId": "corpus/hf_prompts.txt:6",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 50,
			"jsd": .1032,
			"threshold": .025569,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 51,
			"jsd": .124971,
			"threshold": .025391,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 52,
			"jsd": .19255,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 53,
			"jsd": .554801,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 54,
			"jsd": .164229,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 55,
			"jsd": .132748,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 56,
			"jsd": .27985,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 57,
			"jsd": .053872,
			"threshold": .026733,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 58,
			"jsd": .190542,
			"threshold": .026047,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 59,
			"jsd": .125978,
			"threshold": .026047,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 60,
			"jsd": .135894,
			"threshold": .026047,
			"promptId": "corpus/hf_prompts.txt:7",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 61,
			"jsd": .1032,
			"threshold": .026047,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 62,
			"jsd": .124971,
			"threshold": .025748,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 63,
			"jsd": .036882,
			"threshold": .026899,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 64,
			"jsd": .095251,
			"threshold": .026544,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 65,
			"jsd": .009548,
			"threshold": .025914,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 66,
			"jsd": .009528,
			"threshold": .025777,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 67,
			"jsd": .03056,
			"threshold": .025462,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 68,
			"jsd": .022798,
			"threshold": .024886,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 69,
			"jsd": .004869,
			"threshold": .024312,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 70,
			"jsd": .030702,
			"threshold": .023753,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 71,
			"jsd": .095003,
			"threshold": .023035,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 72,
			"jsd": .523625,
			"threshold": .022961,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 73,
			"jsd": .263273,
			"threshold": .022961,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": true,
			"kind": "acquired"
		},
		{
			"global_k": 74,
			"jsd": .260008,
			"threshold": .022961,
			"promptId": "corpus/hf_prompts.txt:8",
			"flagged": true,
			"kind": "drift"
		}
	],
	"spans": [
		{
			"promptId": "corpus/hf_prompts.txt:3",
			"file": "corpus/hf_prompts.txt",
			"line": 3,
			"start": 0,
			"end": 2,
			"global_start": 19,
			"global_end": 21,
			"kind": "lost",
			"peak_jsd": .690504,
			"mean_jsd": .459455,
			"snippet": "Once upon a",
			"predictionA": "a",
			"predictionB": "a",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:4",
			"file": "corpus/hf_prompts.txt",
			"line": 4,
			"start": 1,
			"end": 1,
			"global_start": 27,
			"global_end": 27,
			"kind": "acquired",
			"peak_jsd": .667532,
			"mean_jsd": .667532,
			"snippet": "boils",
			"predictionA": "at",
			"predictionB": "down",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:7",
			"file": "corpus/hf_prompts.txt",
			"line": 7,
			"start": 2,
			"end": 6,
			"global_start": 52,
			"global_end": 56,
			"kind": "acquired",
			"peak_jsd": .554801,
			"mean_jsd": .264836,
			"snippet": "Write a ha iku about",
			"predictionA": "comment",
			"predictionB": "Python",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:8",
			"file": "corpus/hf_prompts.txt",
			"line": 8,
			"start": 11,
			"end": 13,
			"global_start": 72,
			"global_end": 74,
			"kind": "drift",
			"peak_jsd": .523625,
			"mean_jsd": .348969,
			"snippet": "? Assistant :",
			"predictionA": "↵",
			"predictionB": "<|im_end|>",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:2",
			"file": "corpus/hf_prompts.txt",
			"line": 2,
			"start": 0,
			"end": 0,
			"global_start": 5,
			"global_end": 5,
			"kind": "drift",
			"peak_jsd": .297528,
			"mean_jsd": .297528,
			"snippet": "1",
			"predictionA": "0",
			"predictionB": ",",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:6",
			"file": "corpus/hf_prompts.txt",
			"line": 6,
			"start": 9,
			"end": 9,
			"global_start": 49,
			"global_end": 49,
			"kind": "drift",
			"peak_jsd": .228883,
			"mean_jsd": .228883,
			"snippet": ":",
			"predictionA": "Explain",
			"predictionB": "Explain",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:7",
			"file": "corpus/hf_prompts.txt",
			"line": 7,
			"start": 8,
			"end": 10,
			"global_start": 58,
			"global_end": 60,
			"kind": "acquired",
			"peak_jsd": .190542,
			"mean_jsd": .150805,
			"snippet": ". Assistant :",
			"predictionA": "↵",
			"predictionB": "↵",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:6",
			"file": "corpus/hf_prompts.txt",
			"line": 6,
			"start": 4,
			"end": 5,
			"global_start": 44,
			"global_end": 45,
			"kind": "acquired",
			"peak_jsd": .189624,
			"mean_jsd": .189203,
			"snippet": "in one",
			"predictionA": "sentence",
			"predictionB": "sentence",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:1",
			"file": "corpus/hf_prompts.txt",
			"line": 1,
			"start": 4,
			"end": 4,
			"global_start": 4,
			"global_end": 4,
			"kind": "acquired",
			"peak_jsd": .189184,
			"mean_jsd": .189184,
			"snippet": "is",
			"predictionA": "the",
			"predictionB": "Paris",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:2",
			"file": "corpus/hf_prompts.txt",
			"line": 2,
			"start": 3,
			"end": 3,
			"global_start": 8,
			"global_end": 8,
			"kind": "drift",
			"peak_jsd": .184805,
			"mean_jsd": .184805,
			"snippet": "2",
			"predictionA": "0",
			"predictionB": ",",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:3",
			"file": "corpus/hf_prompts.txt",
			"line": 3,
			"start": 6,
			"end": 6,
			"global_start": 25,
			"global_end": 25,
			"kind": "drift",
			"peak_jsd": .174016,
			"mean_jsd": .174016,
			"snippet": "a",
			"predictionA": "little",
			"predictionB": "man",
			"highlight": false,
			"annotate": false
		}
	],
	"top_spans": [
		{
			"promptId": "corpus/hf_prompts.txt:3",
			"file": "corpus/hf_prompts.txt",
			"line": 3,
			"start": 0,
			"end": 2,
			"global_start": 19,
			"global_end": 21,
			"kind": "lost",
			"peak_jsd": .690504,
			"mean_jsd": .459455,
			"snippet": "Once upon a",
			"predictionA": "a",
			"predictionB": "a",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:4",
			"file": "corpus/hf_prompts.txt",
			"line": 4,
			"start": 1,
			"end": 1,
			"global_start": 27,
			"global_end": 27,
			"kind": "acquired",
			"peak_jsd": .667532,
			"mean_jsd": .667532,
			"snippet": "boils",
			"predictionA": "at",
			"predictionB": "down",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:7",
			"file": "corpus/hf_prompts.txt",
			"line": 7,
			"start": 2,
			"end": 6,
			"global_start": 52,
			"global_end": 56,
			"kind": "acquired",
			"peak_jsd": .554801,
			"mean_jsd": .264836,
			"snippet": "Write a ha iku about",
			"predictionA": "comment",
			"predictionB": "Python",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/hf_prompts.txt:8",
			"file": "corpus/hf_prompts.txt",
			"line": 8,
			"start": 11,
			"end": 13,
			"global_start": 72,
			"global_end": 74,
			"kind": "drift",
			"peak_jsd": .523625,
			"mean_jsd": .348969,
			"snippet": "? Assistant :",
			"predictionA": "↵",
			"predictionB": "<|im_end|>",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/hf_prompts.txt:2",
			"file": "corpus/hf_prompts.txt",
			"line": 2,
			"start": 0,
			"end": 0,
			"global_start": 5,
			"global_end": 5,
			"kind": "drift",
			"peak_jsd": .297528,
			"mean_jsd": .297528,
			"snippet": "1",
			"predictionA": "0",
			"predictionB": ",",
			"highlight": true,
			"annotate": false
		}
	],
	"hook_log": [
		"hook A:embed -> Embedding",
		"hook A:block.0 -> LlamaDecoderLayer",
		"hook A:block.1 -> LlamaDecoderLayer",
		"hook A:block.2 -> LlamaDecoderLayer",
		"hook A:block.3 -> LlamaDecoderLayer",
		"hook A:block.4 -> LlamaDecoderLayer",
		"hook A:block.5 -> LlamaDecoderLayer",
		"hook A:block.6 -> LlamaDecoderLayer",
		"hook A:block.7 -> LlamaDecoderLayer",
		"hook A:block.8 -> LlamaDecoderLayer",
		"hook A:block.9 -> LlamaDecoderLayer",
		"hook A:block.10 -> LlamaDecoderLayer",
		"hook A:block.11 -> LlamaDecoderLayer",
		"hook A:block.12 -> LlamaDecoderLayer",
		"hook A:block.13 -> LlamaDecoderLayer",
		"hook A:block.14 -> LlamaDecoderLayer",
		"hook A:block.15 -> LlamaDecoderLayer",
		"hook A:block.16 -> LlamaDecoderLayer",
		"hook A:block.17 -> LlamaDecoderLayer",
		"hook A:block.18 -> LlamaDecoderLayer",
		"hook A:block.19 -> LlamaDecoderLayer",
		"hook A:block.20 -> LlamaDecoderLayer",
		"hook A:block.21 -> LlamaDecoderLayer",
		"hook A:block.22 -> LlamaDecoderLayer",
		"hook A:block.23 -> LlamaDecoderLayer",
		"hook A:block.24 -> LlamaDecoderLayer",
		"hook A:block.25 -> LlamaDecoderLayer",
		"hook A:block.26 -> LlamaDecoderLayer",
		"hook A:block.27 -> LlamaDecoderLayer",
		"hook A:block.28 -> LlamaDecoderLayer",
		"hook A:block.29 -> LlamaDecoderLayer",
		"hook B:embed -> Embedding",
		"hook B:block.0 -> LlamaDecoderLayer",
		"hook B:block.1 -> LlamaDecoderLayer",
		"hook B:block.2 -> LlamaDecoderLayer",
		"hook B:block.3 -> LlamaDecoderLayer",
		"hook B:block.4 -> LlamaDecoderLayer",
		"hook B:block.5 -> LlamaDecoderLayer",
		"hook B:block.6 -> LlamaDecoderLayer",
		"hook B:block.7 -> LlamaDecoderLayer",
		"hook B:block.8 -> LlamaDecoderLayer",
		"hook B:block.9 -> LlamaDecoderLayer",
		"hook B:block.10 -> LlamaDecoderLayer",
		"hook B:block.11 -> LlamaDecoderLayer",
		"hook B:block.12 -> LlamaDecoderLayer",
		"hook B:block.13 -> LlamaDecoderLayer",
		"hook B:block.14 -> LlamaDecoderLayer",
		"hook B:block.15 -> LlamaDecoderLayer",
		"hook B:block.16 -> LlamaDecoderLayer",
		"hook B:block.17 -> LlamaDecoderLayer",
		"hook B:block.18 -> LlamaDecoderLayer",
		"hook B:block.19 -> LlamaDecoderLayer",
		"hook B:block.20 -> LlamaDecoderLayer",
		"hook B:block.21 -> LlamaDecoderLayer",
		"hook B:block.22 -> LlamaDecoderLayer",
		"hook B:block.23 -> LlamaDecoderLayer",
		"hook B:block.24 -> LlamaDecoderLayer",
		"hook B:block.25 -> LlamaDecoderLayer",
		"hook B:block.26 -> LlamaDecoderLayer",
		"hook B:block.27 -> LlamaDecoderLayer",
		"hook B:block.28 -> LlamaDecoderLayer",
		"hook B:block.29 -> LlamaDecoderLayer",
		"attached 62 forward hooks",
		"hook A:embed -> Embedding",
		"hook A:block.0 -> LlamaDecoderLayer",
		"hook A:block.1 -> LlamaDecoderLayer",
		"hook A:block.2 -> LlamaDecoderLayer",
		"hook A:block.3 -> LlamaDecoderLayer",
		"hook A:block.4 -> LlamaDecoderLayer",
		"hook A:block.5 -> LlamaDecoderLayer",
		"hook A:block.6 -> LlamaDecoderLayer",
		"hook A:block.7 -> LlamaDecoderLayer",
		"hook A:block.8 -> LlamaDecoderLayer",
		"hook A:block.9 -> LlamaDecoderLayer",
		"hook A:block.10 -> LlamaDecoderLayer",
		"hook A:block.11 -> LlamaDecoderLayer",
		"hook A:block.12 -> LlamaDecoderLayer",
		"hook A:block.13 -> LlamaDecoderLayer",
		"hook A:block.14 -> LlamaDecoderLayer",
		"hook A:block.15 -> LlamaDecoderLayer",
		"hook A:block.16 -> LlamaDecoderLayer",
		"hook A:block.17 -> LlamaDecoderLayer",
		"hook A:block.18 -> LlamaDecoderLayer",
		"hook A:block.19 -> LlamaDecoderLayer",
		"hook A:block.20 -> LlamaDecoderLayer",
		"hook A:block.21 -> LlamaDecoderLayer",
		"hook A:block.22 -> LlamaDecoderLayer",
		"hook A:block.23 -> LlamaDecoderLayer",
		"hook A:block.24 -> LlamaDecoderLayer",
		"hook A:block.25 -> LlamaDecoderLayer",
		"hook A:block.26 -> LlamaDecoderLayer",
		"hook A:block.27 -> LlamaDecoderLayer",
		"hook A:block.28 -> LlamaDecoderLayer",
		"hook A:block.29 -> LlamaDecoderLayer",
		"hook B:embed -> Embedding",
		"hook B:block.0 -> LlamaDecoderLayer",
		"hook B:block.1 -> LlamaDecoderLayer",
		"hook B:block.2 -> LlamaDecoderLayer",
		"hook B:block.3 -> LlamaDecoderLayer",
		"hook B:block.4 -> LlamaDecoderLayer",
		"hook B:block.5 -> LlamaDecoderLayer",
		"hook B:block.6 -> LlamaDecoderLayer",
		"hook B:block.7 -> LlamaDecoderLayer",
		"hook B:block.8 -> LlamaDecoderLayer",
		"hook B:block.9 -> LlamaDecoderLayer",
		"hook B:block.10 -> LlamaDecoderLayer",
		"hook B:block.11 -> LlamaDecoderLayer",
		"hook B:block.12 -> LlamaDecoderLayer",
		"hook B:block.13 -> LlamaDecoderLayer",
		"hook B:block.14 -> LlamaDecoderLayer",
		"hook B:block.15 -> LlamaDecoderLayer",
		"hook B:block.16 -> LlamaDecoderLayer",
		"hook B:block.17 -> LlamaDecoderLayer",
		"hook B:block.18 -> LlamaDecoderLayer",
		"hook B:block.19 -> LlamaDecoderLayer",
		"hook B:block.20 -> LlamaDecoderLayer",
		"hook B:block.21 -> LlamaDecoderLayer",
		"hook B:block.22 -> LlamaDecoderLayer",
		"hook B:block.23 -> LlamaDecoderLayer",
		"hook B:block.24 -> LlamaDecoderLayer",
		"hook B:block.25 -> LlamaDecoderLayer",
		"hook B:block.26 -> LlamaDecoderLayer",
		"hook B:block.27 -> LlamaDecoderLayer",
		"hook B:block.28 -> LlamaDecoderLayer",
		"hook B:block.29 -> LlamaDecoderLayer",
		"attached 62 forward hooks",
		"detached 62 forward hooks"
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
		"hooks_released": true,
		"live_hooks_attached": 62,
		"live_hooks_released": true,
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
