import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Activity, n as Scale, r as Layers } from "../_libs/lucide-react.mjs";
import { a as XAxis, c as ReferenceArea, d as Cell, f as ResponsiveContainer, i as YAxis, l as Bar, n as BarChart, o as Line, p as Tooltip, r as LineChart, s as CartesianGrid, t as PieChart, u as Pie } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D8WUkWov.js
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LmsSteps, {
						point: selectedPoint ?? prompt.series[0],
						weights: briefing.macro.lms_weights
					}),
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
function LmsSteps({ point, weights }) {
	const silent = Math.abs(point.innovation) < 1e-12 && Math.abs(point.power) < 1e-12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "font-serif text-xl text-fg",
				children: ["LMS at token ", point.k]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "The filter tracks divergence power, which is JSD squared. It does not decide the headline overlap, and it does not open spans."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 space-y-3 text-sm text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "1. Measure."
						}),
						" Top-8 Jensen–Shannon between the two logit rows is ",
						formatNum(point.jsd, 4),
						" bits. Power p = JSD² = ",
						formatNum(point.power, 4),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "2. Gate, before any tap moves."
						}),
						" Open a span only if p exceeds μ + 3σ, here ",
						formatNum(point.mu, 4),
						" + 3×",
						formatNum(point.sigma, 4),
						" = ",
						formatNum(point.threshold, 4),
						". This token ",
						point.flagged ? "clears" : "does not clear",
						" it.",
						silent ? " σ is floored at (0.08 bits)² = 0.0064 because every calm power is 0 and the MAD is 0. The LMS taps are not in this test." : " The LMS taps are not in this test."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "3. Predict."
						}),
						" Four taps hold earlier powers, not this one. w·d = ",
						formatNum(point.lmsPrediction, 4),
						". After the whole stream the taps are [",
						weights.map((weight) => weight.toFixed(3)).join(", "),
						"]."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "4. Innovation."
						}),
						" e = p − w·d = ",
						formatNum(point.innovation, 4),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "5. Update."
						}),
						" w ← w + 0.35 · e / (‖d‖² + 10⁻⁶) · d.",
						silent ? " e is 0 and d is still zero, so the correction is the zero vector and the taps stay at 0." : " The correction points along the delay line and is scaled by this innovation."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "6. Shift."
						}),
						" Drop the oldest tap and store p = ",
						formatNum(point.power, 4),
						" as the newest. The next token predicts from that."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-copper",
							children: "7. Smooth, then the slow baseline."
						}),
						" J ← 0.65 J + 0.35 p lands at ",
						formatNum(point.ema, 4),
						". That average is not the tap update.",
						point.flagged ? " The position is flagged, so μ and σ are left alone." : " It is unflagged, so μ and σ take one slow step toward this power."
					] })
				]
			})
		]
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
/** Scores are the ones printed on Qwen's cards. They are not a Meridian weight audit. */
var publishedPairs = [{
	id: "27b-opus46",
	label: "27B · Opus 4.6",
	a: {
		name: "Qwen3.8-27B",
		note: "Open weights, Apache 2.0. Dense 27B, 64 layers, 262k context. About 50 GB in 16-bit."
	},
	b: {
		name: "Claude Opus 4.6 Max",
		note: "The Claude printed beside 27B on Qwen’s card. Size is not disclosed. Weights are not public."
	},
	source: "Qwen3.8-27B model card, as reported August 2026.",
	caveat: "Qwen ran these. The SWE-bench Pro gap is the one later writeups flag as a corrected-task rescore. A newer Claude, Opus 5, is listed at 79.2 on that benchmark against this 27B’s 61.7.",
	rows: [
		{
			name: "SWE-bench Pro",
			tests: "Agentic coding",
			a: 61.7,
			b: 53.4
		},
		{
			name: "OSWorld-Verified",
			tests: "Computer use",
			a: 84.3,
			b: 72.7
		},
		{
			name: "IFBench",
			tests: "Instruction following",
			a: 79.5,
			b: 62.5
		},
		{
			name: "Terminal-Bench 2.1",
			tests: "Terminal coding",
			a: 73,
			b: 78.2
		},
		{
			name: "GPQA Diamond",
			tests: "Graduate science",
			a: 89.2,
			b: 91.3
		},
		{
			name: "Humanity’s Last Exam",
			tests: "Expert questions",
			a: 30.8,
			b: 40
		}
	]
}, {
	id: "max-opus48",
	label: "Max · Opus 4.8",
	a: {
		name: "Qwen3.8-Max",
		note: "API flagship. Open sibling is the 2.4T-A95B MoE. About $2 / $6 per million tokens."
	},
	b: {
		name: "Claude Opus 4.8",
		note: "The Claude in Qwen’s launch table. About $5 / $25 per million tokens. Fable 5 is a later, stronger coder."
	},
	source: "Qwen3.8-Max launch table.",
	caveat: "Self-run, and a few rows are Qwen’s own benches. Claude Fable 5 still leads Max on SWE-bench Pro, 80.0 to 67.7.",
	rows: [
		{
			name: "Terminal Bench 2.1",
			tests: "Terminal coding",
			a: 86.6,
			b: 84.6
		},
		{
			name: "SWE-bench Pro",
			tests: "Agentic coding",
			a: 67.7,
			b: 69.2
		},
		{
			name: "FrontierSWE",
			tests: "Software engineering",
			a: 73.5,
			b: 70
		},
		{
			name: "PaperBench",
			tests: "Research papers",
			a: 93,
			b: 80.3
		},
		{
			name: "CoWorkBench",
			tests: "Collaborative work",
			a: 74.8,
			b: 72.3
		},
		{
			name: "Toolathlon Verified",
			tests: "Tool use",
			a: 72.5,
			b: 76.2
		},
		{
			name: "GPQA Diamond",
			tests: "Graduate science",
			a: 92.6,
			b: 92
		},
		{
			name: "HLE, no tools",
			tests: "Expert questions",
			a: 43.6,
			b: 45.7
		},
		{
			name: "IFBench",
			tests: "Instruction following",
			a: 82.8,
			b: 62.2
		}
	]
}];
function leadCount(pair) {
	let a = 0;
	let b = 0;
	for (const row of pair.rows) if (row.a > row.b) a += 1;
	else if (row.b > row.a) b += 1;
	return {
		a,
		b
	};
}
function PublishedBrief() {
	const [pairId, setPairId] = (0, import_react.useState)(publishedPairs[0].id);
	const pair = publishedPairs.find((row) => row.id === pairId) ?? publishedPairs[0];
	const leads = (0, import_react.useMemo)(() => leadCount(pair), [pair]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-xs font-medium tracking-widest text-copper uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Published scorecard"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-serif text-4xl text-fg md:text-5xl",
						children: "Qwen 3.8 vs Claude"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-muted",
						children: "The Claude on Qwen’s own card, not a hidden-state audit. Claude’s weights are closed, and Qwen3.8-27B does not fit in this session, so Meridian cannot score token agreement or CKA for this pair."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				role: "group",
				"aria-label": "Which pair",
				children: publishedPairs.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": option.id === pair.id,
					onClick: () => setPairId(option.id),
					className: `rounded-full px-3 py-1.5 text-sm ${option.id === pair.id ? "bg-bone text-bg" : "bg-surface text-muted shadow-border"}`,
					children: option.label
				}, option.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl bg-surface p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-copper uppercase",
							children: "Model A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-serif text-2xl text-fg",
							children: pair.a.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: pair.a.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-3xl font-serif text-bone tabular-nums",
							children: leads.a
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "rows ahead on this card"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl bg-surface p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-olive uppercase",
							children: "Model B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-serif text-2xl text-fg",
							children: pair.b.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: pair.b.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-3xl font-serif text-olive tabular-nums",
							children: leads.b
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "rows ahead on this card"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl text-fg",
						children: "Same tests, their numbers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-4",
						children: pair.rows.map((row) => {
							const winner = row.a === row.b ? "tie" : row.a > row.b ? "a" : "b";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-fg",
									children: [row.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-muted",
										children: row.tests
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: winner === "a" ? "text-bone" : "",
											children: row.a.toFixed(1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1",
											children: "/"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: winner === "b" ? "text-olive" : "",
											children: row.b.toFixed(1)
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 overflow-hidden rounded-full bg-bg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-bone",
										style: { width: `${row.a}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 overflow-hidden rounded-full bg-bg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-olive",
										style: { width: `${row.b}%` }
									})
								})]
							})] }, row.name);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 text-xs text-muted",
						children: [
							"Bone is ",
							pair.a.name,
							". Olive is ",
							pair.b.name,
							". Bar length is the score out of 100."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl bg-surface p-4 shadow-border md:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl text-fg",
						children: "LMS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg",
						children: "Not run. There is no power series to step."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"The filter only needs p(k) = JSD² at each shared token. ",
							pair.a.name,
							" and ",
							pair.b.name,
							" never produced that series. Opus weights are closed, and this session has no Anthropic or Qwen key.",
							pair.id === "27b-opus46" ? " Qwen3.8-27B is about 50 GB in 16-bit against roughly 3 GB free." : " The open Max sibling is a 2.4T model, which does not fit either.",
							"The two tokenizers also do not share a position index, so two text replies would still not be a legal input to this update."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted tabular-nums",
						children: "Taps: not computed. Innovation: not computed. Spans: none."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					pair.source,
					" ",
					pair.caveat
				]
			})
		]
	});
}
var briefing = {
	"product": "Meridian",
	"models": {
		"a": {
			"name": "Qwen/Qwen2.5-Coder-0.5B",
			"label": "Qwen2.5-Coder-0.5B",
			"params": 494032768,
			"layers": 24,
			"width": 896,
			"vocab": 151936,
			"dtype": "float16",
			"device": "cpu",
			"note": "Base checkpoint. This is the reference the comparison measures against."
		},
		"b": {
			"name": "Qwen/Qwen2.5-Coder-0.5B-Instruct",
			"label": "Qwen2.5-Coder-0.5B-Instruct",
			"params": 494032768,
			"layers": 24,
			"width": 896,
			"vocab": 151936,
			"dtype": "float16",
			"device": "cpu",
			"note": "Instruct checkpoint of the same family."
		},
		"pair": "Qwen2.5-Coder-0.5B against Qwen2.5-Coder-0.5B-Instruct. Same tokenizer and the same token ids at every position."
	},
	"macro": {
		"overlap_score": 80.519975,
		"top1_identical_pct": 58.974359,
		"soft_parity_pct": 33.333333,
		"hard_conflict_pct": 7.692308,
		"shared_latent_pct": 79.630741,
		"model_a_unique_pct": 10.430475,
		"model_b_unique_pct": 9.938783,
		"mean_cka": .967237,
		"mean_residual_fraction": .110658,
		"mean_r2_a_to_b": .889342,
		"mean_r2_b_to_a": .883868,
		"mean_orthogonal_residual": .23312,
		"background_mu": .004176,
		"background_sigma": .0064,
		"power_floor": .0064,
		"cert_threshold": .22,
		"uncertain_threshold": .3,
		"n_tokens": 39,
		"n_spans": 11,
		"lms_weights": [
			1.563689,
			1.971193,
			-.105045,
			8.102844
		]
	},
	"layers": [
		{
			"name": "embed",
			"depth": 0,
			"cka": .984729,
			"residual": .825165,
			"insampleResidual": 4e-6,
			"r2AB": .174835,
			"r2BA": .153986,
			"orthogonalResidual": .039462,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.0",
			"depth": .041667,
			"cka": .963999,
			"residual": .779389,
			"insampleResidual": 67e-6,
			"r2AB": .220611,
			"r2BA": .221917,
			"orthogonalResidual": .056328,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.1",
			"depth": .083333,
			"cka": .969272,
			"residual": .724945,
			"insampleResidual": 37e-6,
			"r2AB": .275055,
			"r2BA": .303698,
			"orthogonalResidual": .062223,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.2",
			"depth": .125,
			"cka": .919657,
			"residual": .111717,
			"insampleResidual": .003803,
			"r2AB": .888283,
			"r2BA": .94621,
			"orthogonalResidual": .422517,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.3",
			"depth": .166667,
			"cka": .986622,
			"residual": .018584,
			"insampleResidual": .003982,
			"r2AB": .981416,
			"r2BA": .993662,
			"orthogonalResidual": .260813,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.4",
			"depth": .208333,
			"cka": .986811,
			"residual": .018529,
			"insampleResidual": .004039,
			"r2AB": .981471,
			"r2BA": .993757,
			"orthogonalResidual": .256029,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.5",
			"depth": .25,
			"cka": .988151,
			"residual": .01694,
			"insampleResidual": .003733,
			"r2AB": .98306,
			"r2BA": .994122,
			"orthogonalResidual": .210065,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.6",
			"depth": .291667,
			"cka": .988144,
			"residual": .017012,
			"insampleResidual": .003783,
			"r2AB": .982988,
			"r2BA": .994097,
			"orthogonalResidual": .20961,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.7",
			"depth": .333333,
			"cka": .988162,
			"residual": .017019,
			"insampleResidual": .003801,
			"r2AB": .982981,
			"r2BA": .99407,
			"orthogonalResidual": .208732,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.8",
			"depth": .375,
			"cka": .988251,
			"residual": .016942,
			"insampleResidual": .003819,
			"r2AB": .983058,
			"r2BA": .994104,
			"orthogonalResidual": .207501,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.9",
			"depth": .416667,
			"cka": .988204,
			"residual": .016991,
			"insampleResidual": .003857,
			"r2AB": .983009,
			"r2BA": .994119,
			"orthogonalResidual": .207541,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.10",
			"depth": .458333,
			"cka": .988248,
			"residual": .016947,
			"insampleResidual": .003871,
			"r2AB": .983053,
			"r2BA": .994132,
			"orthogonalResidual": .20776,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.11",
			"depth": .5,
			"cka": .988252,
			"residual": .016968,
			"insampleResidual": .003887,
			"r2AB": .983032,
			"r2BA": .99416,
			"orthogonalResidual": .208718,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.12",
			"depth": .541667,
			"cka": .988254,
			"residual": .017008,
			"insampleResidual": .003923,
			"r2AB": .982992,
			"r2BA": .994166,
			"orthogonalResidual": .209738,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.13",
			"depth": .583333,
			"cka": .988287,
			"residual": .017018,
			"insampleResidual": .00394,
			"r2AB": .982982,
			"r2BA": .994146,
			"orthogonalResidual": .211464,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.14",
			"depth": .625,
			"cka": .988322,
			"residual": .017161,
			"insampleResidual": .004008,
			"r2AB": .982839,
			"r2BA": .994153,
			"orthogonalResidual": .213087,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.15",
			"depth": .666667,
			"cka": .98827,
			"residual": .01737,
			"insampleResidual": .004071,
			"r2AB": .98263,
			"r2BA": .994092,
			"orthogonalResidual": .216166,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.16",
			"depth": .708333,
			"cka": .988222,
			"residual": .018017,
			"insampleResidual": .004249,
			"r2AB": .981983,
			"r2BA": .993902,
			"orthogonalResidual": .219908,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.17",
			"depth": .75,
			"cka": .988154,
			"residual": .018959,
			"insampleResidual": .004449,
			"r2AB": .981041,
			"r2BA": .99366,
			"orthogonalResidual": .223457,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.18",
			"depth": .791667,
			"cka": .988065,
			"residual": .019677,
			"insampleResidual": .004545,
			"r2AB": .980323,
			"r2BA": .993471,
			"orthogonalResidual": .22826,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.19",
			"depth": .833333,
			"cka": .988129,
			"residual": .021144,
			"insampleResidual": .004536,
			"r2AB": .978856,
			"r2BA": .993212,
			"orthogonalResidual": .23915,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.20",
			"depth": .875,
			"cka": .987868,
			"residual": .023338,
			"insampleResidual": .004659,
			"r2AB": .976662,
			"r2BA": .992827,
			"orthogonalResidual": .250034,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.21",
			"depth": .916667,
			"cka": .888079,
			"residual": .060618,
			"insampleResidual": 11e-6,
			"r2AB": .939382,
			"r2BA": .721165,
			"orthogonalResidual": .611903,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.22",
			"depth": .958333,
			"cka": .852786,
			"residual": .242494,
			"insampleResidual": 19e-6,
			"r2AB": .757506,
			"r2BA": .585803,
			"orthogonalResidual": .306309,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		},
		{
			"name": "block.23",
			"depth": 1,
			"cka": .835488,
			"residual": .411003,
			"insampleResidual": 117e-6,
			"r2AB": .588997,
			"r2BA": .544177,
			"orthogonalResidual": .147579,
			"samples": 39,
			"widthA": 896,
			"widthB": 896
		}
	],
	"prompts": [
		{
			"id": "corpus/coder_prompts.txt:1",
			"file": "corpus/coder_prompts.txt",
			"line": 1,
			"text": "def add(a, b):",
			"role": "code",
			"tokens": [
				"def",
				"add",
				"(a",
				",",
				"b",
				"):"
			],
			"series": [
				{
					"k": 0,
					"token": "def",
					"target": "add",
					"jsd": .065579,
					"power": .004301,
					"ema": .001505,
					"lmsPrediction": 0,
					"innovation": .004301,
					"mu": .004176,
					"sigma": .0064,
					"threshold": .023376,
					"flagged": false,
					"entropyA": 6.158568,
					"entropyB": 7.627021,
					"normEntropyA": .516173,
					"normEntropyB": .639249,
					"perplexityA": 472.750779,
					"perplexityB": 2052.925513,
					"top1A": "find",
					"top1B": "module",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 0
				},
				{
					"k": 1,
					"token": "add",
					"target": "(a",
					"jsd": .192725,
					"power": .037143,
					"ema": .013978,
					"lmsPrediction": 0,
					"innovation": .037143,
					"mu": .004186,
					"sigma": .006139,
					"threshold": .022602,
					"flagged": true,
					"entropyA": 4.6887,
					"entropyB": 3.179563,
					"normEntropyA": .392978,
					"normEntropyB": .266491,
					"perplexityA": 108.711807,
					"perplexityB": 24.036246,
					"top1A": "(a",
					"top1B": "_numbers",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 1
				},
				{
					"k": 2,
					"token": "(a",
					"target": ",",
					"jsd": .089462,
					"power": .008003,
					"ema": .011887,
					"lmsPrediction": .106516,
					"innovation": -.098513,
					"mu": .004186,
					"sigma": .006139,
					"threshold": .022602,
					"flagged": false,
					"entropyA": 1.005365,
					"entropyB": .443684,
					"normEntropyA": .084263,
					"normEntropyB": .037187,
					"perplexityA": 2.732905,
					"perplexityB": 1.558438,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 2
				},
				{
					"k": 3,
					"token": ",",
					"target": "b",
					"jsd": .002019,
					"power": 4e-6,
					"ema": .007728,
					"lmsPrediction": .011689,
					"innovation": -.011685,
					"mu": .004491,
					"sigma": .005986,
					"threshold": .02245,
					"flagged": false,
					"entropyA": .058235,
					"entropyB": .004862,
					"normEntropyA": .004881,
					"normEntropyB": 407e-6,
					"perplexityA": 1.059964,
					"perplexityB": 1.004874,
					"top1A": "b",
					"top1B": "b",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 3
				},
				{
					"k": 4,
					"token": "b",
					"target": "):",
					"jsd": .042084,
					"power": .001771,
					"ema": .005643,
					"lmsPrediction": -.002118,
					"innovation": .003889,
					"mu": .004132,
					"sigma": .00588,
					"threshold": .021774,
					"flagged": false,
					"entropyA": .958147,
					"entropyB": .867739,
					"normEntropyA": .080306,
					"normEntropyB": .072729,
					"perplexityA": 2.606861,
					"perplexityB": 2.381521,
					"top1A": "):↵",
					"top1B": "):↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 4
				},
				{
					"k": 5,
					"token": "):",
					"target": "",
					"jsd": .373806,
					"power": .139731,
					"ema": .052574,
					"lmsPrediction": .003746,
					"innovation": .135985,
					"mu": .003943,
					"sigma": .00568,
					"threshold": .020983,
					"flagged": true,
					"entropyA": .774396,
					"entropyB": 1.992128,
					"normEntropyA": .064905,
					"normEntropyB": .166968,
					"perplexityA": 2.169281,
					"perplexityB": 7.331114,
					"top1A": "↵",
					"top1B": "␣",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 5
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:2",
			"file": "corpus/coder_prompts.txt",
			"line": 2,
			"text": "def factorial(n):",
			"role": "code",
			"tokens": [
				"def",
				"factorial",
				"(n",
				"):"
			],
			"series": [
				{
					"k": 0,
					"token": "def",
					"target": "factorial",
					"jsd": .065579,
					"power": .004301,
					"ema": .001505,
					"lmsPrediction": 0,
					"innovation": .004301,
					"mu": .003943,
					"sigma": .00568,
					"threshold": .020983,
					"flagged": false,
					"entropyA": 6.158568,
					"entropyB": 7.627021,
					"normEntropyA": .516173,
					"normEntropyB": .639249,
					"perplexityA": 472.750779,
					"perplexityB": 2052.925513,
					"top1A": "find",
					"top1B": "module",
					"agree": false,
					"bucket": "soft",
					"kind": null,
					"globalK": 6
				},
				{
					"k": 1,
					"token": "factorial",
					"target": "(n",
					"jsd": .119586,
					"power": .014301,
					"ema": .005984,
					"lmsPrediction": .008551,
					"innovation": .00575,
					"mu": .003972,
					"sigma": .005449,
					"threshold": .020318,
					"flagged": false,
					"entropyA": 2.149607,
					"entropyB": .61541,
					"normEntropyA": .180167,
					"normEntropyB": .05158,
					"perplexityA": 8.581487,
					"perplexityB": 1.850416,
					"top1A": "(n",
					"top1B": "(n",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 7
				},
				{
					"k": 2,
					"token": "(n",
					"target": "):",
					"jsd": .064621,
					"power": .004176,
					"ema": .005351,
					"lmsPrediction": .033913,
					"innovation": -.029737,
					"mu": .004798,
					"sigma": .005987,
					"threshold": .02276,
					"flagged": false,
					"entropyA": 1.2552,
					"entropyB": .58409,
					"normEntropyA": .105203,
					"normEntropyB": .048955,
					"perplexityA": 3.508541,
					"perplexityB": 1.793357,
					"top1A": "):↵",
					"top1B": "):↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 8
				},
				{
					"k": 3,
					"token": "):",
					"target": "",
					"jsd": .343565,
					"power": .118037,
					"ema": .044791,
					"lmsPrediction": .002861,
					"innovation": .115176,
					"mu": .004748,
					"sigma": .005746,
					"threshold": .021985,
					"flagged": true,
					"entropyA": 1.0142,
					"entropyB": 1.83449,
					"normEntropyA": .085004,
					"normEntropyB": .153755,
					"perplexityA": 2.757156,
					"perplexityB": 6.261938,
					"top1A": "↵",
					"top1B": "↵",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 9
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:3",
			"file": "corpus/coder_prompts.txt",
			"line": 3,
			"text": "for i in range(10):",
			"role": "code",
			"tokens": [
				"for",
				"i",
				"in",
				"range",
				"(",
				"1",
				"0",
				"):"
			],
			"series": [
				{
					"k": 0,
					"token": "for",
					"target": "i",
					"jsd": .491202,
					"power": .241279,
					"ema": .084448,
					"lmsPrediction": 0,
					"innovation": .241279,
					"mu": .004748,
					"sigma": .005746,
					"threshold": .021985,
					"flagged": true,
					"entropyA": 3.475857,
					"entropyB": 9.18596,
					"normEntropyA": .291325,
					"normEntropyB": .76991,
					"perplexityA": 32.325532,
					"perplexityB": 9759.14837,
					"top1A": "i",
					"top1B": "each",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 10
				},
				{
					"k": 1,
					"token": "i",
					"target": "in",
					"jsd": .004502,
					"power": 2e-5,
					"ema": .054898,
					"lmsPrediction": .594744,
					"innovation": -.594724,
					"mu": .004748,
					"sigma": .005746,
					"threshold": .021985,
					"flagged": false,
					"entropyA": .048031,
					"entropyB": .13429,
					"normEntropyA": .004026,
					"normEntropyB": .011255,
					"perplexityA": 1.049203,
					"perplexityB": 1.143725,
					"top1A": "in",
					"top1B": "in",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 11
				},
				{
					"k": 2,
					"token": "in",
					"target": "range",
					"jsd": .005466,
					"power": 3e-5,
					"ema": .035694,
					"lmsPrediction": .479116,
					"innovation": -.479086,
					"mu": .00437,
					"sigma": .005671,
					"threshold": .021383,
					"flagged": false,
					"entropyA": .390242,
					"entropyB": .221662,
					"normEntropyA": .032708,
					"normEntropyB": .018578,
					"perplexityA": 1.477339,
					"perplexityB": 1.248149,
					"top1A": "range",
					"top1B": "range",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 12
				},
				{
					"k": 3,
					"token": "range",
					"target": "(",
					"jsd": .077017,
					"power": .005932,
					"ema": .025277,
					"lmsPrediction": .242238,
					"innovation": -.236306,
					"mu": .004023,
					"sigma": .005576,
					"threshold": .020751,
					"flagged": false,
					"entropyA": .723812,
					"entropyB": .457266,
					"normEntropyA": .060665,
					"normEntropyB": .038325,
					"perplexityA": 2.062281,
					"perplexityB": 1.579749,
					"top1A": "(",
					"top1B": "(",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 13
				},
				{
					"k": 4,
					"token": "(",
					"target": "1",
					"jsd": .017028,
					"power": 29e-5,
					"ema": .016532,
					"lmsPrediction": .305133,
					"innovation": -.304843,
					"mu": .004176,
					"sigma": .005376,
					"threshold": .020303,
					"flagged": false,
					"entropyA": 1.513214,
					"entropyB": 1.240989,
					"normEntropyA": .126828,
					"normEntropyB": .104012,
					"perplexityA": 4.541303,
					"perplexityB": 3.459032,
					"top1A": "1",
					"top1B": "1",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 14
				},
				{
					"k": 5,
					"token": "1",
					"target": "0",
					"jsd": .020726,
					"power": 43e-5,
					"ema": .010896,
					"lmsPrediction": .008152,
					"innovation": -.007722,
					"mu": .003865,
					"sigma": .005272,
					"threshold": .019681,
					"flagged": false,
					"entropyA": .970729,
					"entropyB": .974724,
					"normEntropyA": .08136,
					"normEntropyB": .081695,
					"perplexityA": 2.639868,
					"perplexityB": 2.650436,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 15
				},
				{
					"k": 6,
					"token": "0",
					"target": "):",
					"jsd": .053322,
					"power": .002843,
					"ema": .008078,
					"lmsPrediction": .00485,
					"innovation": -.002007,
					"mu": .00359,
					"sigma": .005149,
					"threshold": .019038,
					"flagged": false,
					"entropyA": 1.717487,
					"entropyB": 1.29137,
					"normEntropyA": .143949,
					"normEntropyB": .108235,
					"perplexityA": 5.570511,
					"perplexityB": 3.637767,
					"top1A": "):↵",
					"top1B": "):↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 16
				},
				{
					"k": 7,
					"token": "):",
					"target": "",
					"jsd": .419637,
					"power": .176095,
					"ema": .066884,
					"lmsPrediction": .009592,
					"innovation": .166503,
					"mu": .00353,
					"sigma": .004943,
					"threshold": .018361,
					"flagged": true,
					"entropyA": 1.596054,
					"entropyB": 2.394063,
					"normEntropyA": .133771,
					"normEntropyB": .200655,
					"perplexityA": 4.933524,
					"perplexityB": 10.95792,
					"top1A": "↵",
					"top1B": "␣",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 17
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:4",
			"file": "corpus/coder_prompts.txt",
			"line": 4,
			"text": "import json",
			"role": "code",
			"tokens": ["import", "json"],
			"series": [{
				"k": 0,
				"token": "import",
				"target": "json",
				"jsd": .137673,
				"power": .018954,
				"ema": .006634,
				"lmsPrediction": 0,
				"innovation": .018954,
				"mu": .00353,
				"sigma": .004943,
				"threshold": .018361,
				"flagged": true,
				"entropyA": 3.681757,
				"entropyB": 5.49342,
				"normEntropyA": .308582,
				"normEntropyB": .460424,
				"perplexityA": 39.716106,
				"perplexityB": 243.0871,
				"top1A": "{",
				"top1B": "{",
				"agree": true,
				"bucket": "identical",
				"kind": "drift",
				"globalK": 18
			}, {
				"k": 1,
				"token": "json",
				"target": "",
				"jsd": .135919,
				"power": .018474,
				"ema": .010778,
				"lmsPrediction": .100111,
				"innovation": -.081637,
				"mu": .00353,
				"sigma": .004943,
				"threshold": .018361,
				"flagged": true,
				"entropyA": 1.354421,
				"entropyB": 1.071613,
				"normEntropyA": .113519,
				"normEntropyB": .089816,
				"perplexityA": 3.874516,
				"perplexityB": 2.920085,
				"top1A": "↵",
				"top1B": "↵↵",
				"agree": false,
				"bucket": "soft",
				"kind": "conflict",
				"globalK": 19
			}]
		},
		{
			"id": "corpus/coder_prompts.txt:5",
			"file": "corpus/coder_prompts.txt",
			"line": 5,
			"text": "class Stack:",
			"role": "code",
			"tokens": [
				"class",
				"Stack",
				":"
			],
			"series": [
				{
					"k": 0,
					"token": "class",
					"target": "Stack",
					"jsd": .222857,
					"power": .049665,
					"ema": .017383,
					"lmsPrediction": 0,
					"innovation": .049665,
					"mu": .00353,
					"sigma": .004943,
					"threshold": .018361,
					"flagged": true,
					"entropyA": 5.044807,
					"entropyB": 8.495155,
					"normEntropyA": .422824,
					"normEntropyB": .712011,
					"perplexityA": 155.21441,
					"perplexityB": 4891.014604,
					"top1A": "Solution",
					"top1B": "Employee",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 20
				},
				{
					"k": 1,
					"token": "Stack",
					"target": ":",
					"jsd": .070992,
					"power": .00504,
					"ema": .013063,
					"lmsPrediction": .187661,
					"innovation": -.182621,
					"mu": .00353,
					"sigma": .004943,
					"threshold": .018361,
					"flagged": false,
					"entropyA": 2.652093,
					"entropyB": 2.109301,
					"normEntropyA": .222282,
					"normEntropyB": .176788,
					"perplexityA": 14.1837,
					"perplexityB": 8.242475,
					"top1A": ":↵",
					"top1B": ":↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 21
				},
				{
					"k": 2,
					"token": ":",
					"target": "",
					"jsd": .08439,
					"power": .007122,
					"ema": .010983,
					"lmsPrediction": .082342,
					"innovation": -.075221,
					"mu": .003651,
					"sigma": .004761,
					"threshold": .017933,
					"flagged": false,
					"entropyA": .757418,
					"entropyB": 1.468128,
					"normEntropyA": .063482,
					"normEntropyB": .123049,
					"perplexityA": 2.132762,
					"perplexityB": 4.3411,
					"top1A": "↵",
					"top1B": "↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 22
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:6",
			"file": "corpus/coder_prompts.txt",
			"line": 6,
			"text": "SELECT name FROM users WHERE",
			"role": "code",
			"tokens": [
				"SELECT",
				"name",
				"FROM",
				"users",
				"WHERE"
			],
			"series": [
				{
					"k": 0,
					"token": "SELECT",
					"target": "name",
					"jsd": .233337,
					"power": .054446,
					"ema": .019056,
					"lmsPrediction": 0,
					"innovation": .054446,
					"mu": .003929,
					"sigma": .004671,
					"threshold": .017941,
					"flagged": true,
					"entropyA": 5.632731,
					"entropyB": 9.338718,
					"normEntropyA": .4721,
					"normEntropyB": .782713,
					"perplexityA": 279.424205,
					"perplexityB": 11369.828142,
					"top1A": "↵",
					"top1B": "nullptr",
					"agree": false,
					"bucket": "conflict",
					"kind": "drift",
					"globalK": 23
				},
				{
					"k": 1,
					"token": "name",
					"target": "FROM",
					"jsd": .147648,
					"power": .0218,
					"ema": .020016,
					"lmsPrediction": .132785,
					"innovation": -.110986,
					"mu": .003929,
					"sigma": .004671,
					"threshold": .017941,
					"flagged": true,
					"entropyA": 2.045855,
					"entropyB": 1.482028,
					"normEntropyA": .171471,
					"normEntropyB": .124214,
					"perplexityA": 7.73577,
					"perplexityB": 4.401865,
					"top1A": ",",
					"top1B": "FROM",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 24
				},
				{
					"k": 2,
					"token": "FROM",
					"target": "users",
					"jsd": .216482,
					"power": .046865,
					"ema": .029413,
					"lmsPrediction": .085562,
					"innovation": -.038698,
					"mu": .003929,
					"sigma": .004671,
					"threshold": .017941,
					"flagged": true,
					"entropyA": 6.111857,
					"entropyB": 3.634586,
					"normEntropyA": .512258,
					"normEntropyB": .304628,
					"perplexityA": 451.175886,
					"perplexityB": 37.88618,
					"top1A": "`",
					"top1B": "users",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 25
				},
				{
					"k": 3,
					"token": "users",
					"target": "WHERE",
					"jsd": .22819,
					"power": .052071,
					"ema": .037343,
					"lmsPrediction": .141666,
					"innovation": -.089595,
					"mu": .003929,
					"sigma": .004671,
					"threshold": .017941,
					"flagged": true,
					"entropyA": 2.829024,
					"entropyB": 1.440464,
					"normEntropyA": .237111,
					"normEntropyB": .120731,
					"perplexityA": 16.928922,
					"perplexityB": 4.222655,
					"top1A": "WHERE",
					"top1B": "WHERE",
					"agree": true,
					"bucket": "identical",
					"kind": "drift",
					"globalK": 26
				},
				{
					"k": 4,
					"token": "WHERE",
					"target": "",
					"jsd": .053339,
					"power": .002845,
					"ema": .025269,
					"lmsPrediction": .575997,
					"innovation": -.573152,
					"mu": .003929,
					"sigma": .004671,
					"threshold": .017941,
					"flagged": false,
					"entropyA": 3.344319,
					"entropyB": 3.095132,
					"normEntropyA": .2803,
					"normEntropyB": .259415,
					"perplexityA": 28.341257,
					"perplexityB": 22.09016,
					"top1A": "id",
					"top1B": "id",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 27
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:7",
			"file": "corpus/coder_prompts.txt",
			"line": 7,
			"text": "function sum(a, b) {",
			"role": "code",
			"tokens": [
				"function",
				"sum",
				"(a",
				",",
				"b",
				")",
				"{"
			],
			"series": [
				{
					"k": 0,
					"token": "function",
					"target": "sum",
					"jsd": .06318,
					"power": .003992,
					"ema": .001397,
					"lmsPrediction": 0,
					"innovation": .003992,
					"mu": .003842,
					"sigma": .00449,
					"threshold": .017313,
					"flagged": false,
					"entropyA": 7.281261,
					"entropyB": 9.242058,
					"normEntropyA": .61027,
					"normEntropyB": .774612,
					"perplexityA": 1452.819321,
					"perplexityB": 10322.262294,
					"top1A": "get",
					"top1B": "each",
					"agree": false,
					"bucket": "conflict",
					"kind": null,
					"globalK": 28
				},
				{
					"k": 1,
					"token": "sum",
					"target": "(a",
					"jsd": .194199,
					"power": .037713,
					"ema": .014108,
					"lmsPrediction": 51e-5,
					"innovation": .037203,
					"mu": .003854,
					"sigma": .004307,
					"threshold": .016776,
					"flagged": true,
					"entropyA": 4.187037,
					"entropyB": 3.46517,
					"normEntropyA": .350931,
					"normEntropyB": .290429,
					"perplexityA": 65.827444,
					"perplexityB": 31.981906,
					"top1A": "(a",
					"top1B": "Of",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 29
				},
				{
					"k": 2,
					"token": "(a",
					"target": ",",
					"jsd": .06996,
					"power": .004894,
					"ema": .010883,
					"lmsPrediction": .118261,
					"innovation": -.113366,
					"mu": .003854,
					"sigma": .004307,
					"threshold": .016776,
					"flagged": false,
					"entropyA": 1.598052,
					"entropyB": .912882,
					"normEntropyA": .133939,
					"normEntropyB": .076512,
					"perplexityA": 4.943395,
					"perplexityB": 2.491492,
					"top1A": ",",
					"top1B": ",",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 30
				},
				{
					"k": 3,
					"token": ",",
					"target": "b",
					"jsd": .01502,
					"power": 226e-6,
					"ema": .007153,
					"lmsPrediction": -.01512,
					"innovation": .015346,
					"mu": .003937,
					"sigma": .004142,
					"threshold": .016363,
					"flagged": false,
					"entropyA": .223307,
					"entropyB": .009406,
					"normEntropyA": .018716,
					"normEntropyB": 788e-6,
					"perplexityA": 1.250204,
					"perplexityB": 1.00945,
					"top1A": "b",
					"top1B": "b",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 31
				},
				{
					"k": 4,
					"token": "b",
					"target": ")",
					"jsd": .066087,
					"power": .004367,
					"ema": .006178,
					"lmsPrediction": .030873,
					"innovation": -.026506,
					"mu": .00364,
					"sigma": .004109,
					"threshold": .015968,
					"flagged": false,
					"entropyA": .986868,
					"entropyB": .372071,
					"normEntropyA": .082713,
					"normEntropyB": .031185,
					"perplexityA": 2.682817,
					"perplexityB": 1.450736,
					"top1A": ")",
					"top1B": ")",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 32
				},
				{
					"k": 5,
					"token": ")",
					"target": "{",
					"jsd": .0349,
					"power": .001218,
					"ema": .004442,
					"lmsPrediction": .280616,
					"innovation": -.279398,
					"mu": .003698,
					"sigma": .003947,
					"threshold": .015538,
					"flagged": false,
					"entropyA": .759812,
					"entropyB": .421719,
					"normEntropyA": .063683,
					"normEntropyB": .035346,
					"perplexityA": 2.137875,
					"perplexityB": 1.52458,
					"top1A": "{↵",
					"top1B": "{↵",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 33
				},
				{
					"k": 6,
					"token": "{",
					"target": "",
					"jsd": .336481,
					"power": .11322,
					"ema": .042514,
					"lmsPrediction": .02255,
					"innovation": .09067,
					"mu": .0035,
					"sigma": .00385,
					"threshold": .01505,
					"flagged": true,
					"entropyA": .538739,
					"entropyB": 1.723909,
					"normEntropyA": .045154,
					"normEntropyB": .144487,
					"perplexityA": 1.713844,
					"perplexityB": 5.606403,
					"top1A": "↵",
					"top1B": "return",
					"agree": false,
					"bucket": "soft",
					"kind": "conflict",
					"globalK": 34
				}
			]
		},
		{
			"id": "corpus/coder_prompts.txt:8",
			"file": "corpus/coder_prompts.txt",
			"line": 8,
			"text": "# reverse a string",
			"role": "code",
			"tokens": [
				"#",
				"reverse",
				"a",
				"string"
			],
			"series": [
				{
					"k": 0,
					"token": "#",
					"target": "reverse",
					"jsd": .071239,
					"power": .005075,
					"ema": .001776,
					"lmsPrediction": 0,
					"innovation": .005075,
					"mu": .0035,
					"sigma": .00385,
					"threshold": .01505,
					"flagged": false,
					"entropyA": 7.194417,
					"entropyB": 9.134619,
					"normEntropyA": .602991,
					"normEntropyB": .765607,
					"perplexityA": 1331.973636,
					"perplexityB": 9270.741522,
					"top1A": "How",
					"top1B": "How",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 35
				},
				{
					"k": 1,
					"token": "reverse",
					"target": "a",
					"jsd": .073289,
					"power": .005371,
					"ema": .003035,
					"lmsPrediction": .01386,
					"innovation": -.008489,
					"mu": .003626,
					"sigma": .00372,
					"threshold": .014785,
					"flagged": false,
					"entropyA": 5.497529,
					"entropyB": 4.061313,
					"normEntropyA": .460769,
					"normEntropyB": .340394,
					"perplexityA": 244.08811,
					"perplexityB": 58.050478,
					"top1A": "a",
					"top1B": "a",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 36
				},
				{
					"k": 2,
					"token": "a",
					"target": "string",
					"jsd": .054024,
					"power": .002919,
					"ema": .002994,
					"lmsPrediction": .024041,
					"innovation": -.021122,
					"mu": .003766,
					"sigma": .003602,
					"threshold": .014571,
					"flagged": false,
					"entropyA": 2.493209,
					"entropyB": 1.941045,
					"normEntropyA": .208965,
					"normEntropyB": .162686,
					"perplexityA": 12.100049,
					"perplexityB": 6.96603,
					"top1A": "string",
					"top1B": "string",
					"agree": true,
					"bucket": "identical",
					"kind": null,
					"globalK": 37
				},
				{
					"k": 3,
					"token": "string",
					"target": "",
					"jsd": .138399,
					"power": .019154,
					"ema": .00865,
					"lmsPrediction": .012234,
					"innovation": .00692,
					"mu": .003698,
					"sigma": .003463,
					"threshold": .014087,
					"flagged": true,
					"entropyA": 3.133881,
					"entropyB": 2.541427,
					"normEntropyA": .262662,
					"normEntropyB": .213007,
					"perplexityA": 22.962925,
					"perplexityB": 12.697782,
					"top1A": "↵",
					"top1B": "in",
					"agree": false,
					"bucket": "soft",
					"kind": "drift",
					"globalK": 38
				}
			]
		}
	],
	"stream": [
		{
			"global_k": 0,
			"jsd": .065579,
			"threshold": .023376,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 1,
			"jsd": .192725,
			"threshold": .022602,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 2,
			"jsd": .089462,
			"threshold": .022602,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 3,
			"jsd": .002019,
			"threshold": .02245,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 4,
			"jsd": .042084,
			"threshold": .021774,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 5,
			"jsd": .373806,
			"threshold": .020983,
			"promptId": "corpus/coder_prompts.txt:1",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 6,
			"jsd": .065579,
			"threshold": .020983,
			"promptId": "corpus/coder_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 7,
			"jsd": .119586,
			"threshold": .020318,
			"promptId": "corpus/coder_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 8,
			"jsd": .064621,
			"threshold": .02276,
			"promptId": "corpus/coder_prompts.txt:2",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 9,
			"jsd": .343565,
			"threshold": .021985,
			"promptId": "corpus/coder_prompts.txt:2",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 10,
			"jsd": .491202,
			"threshold": .021985,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 11,
			"jsd": .004502,
			"threshold": .021985,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 12,
			"jsd": .005466,
			"threshold": .021383,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 13,
			"jsd": .077017,
			"threshold": .020751,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 14,
			"jsd": .017028,
			"threshold": .020303,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 15,
			"jsd": .020726,
			"threshold": .019681,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 16,
			"jsd": .053322,
			"threshold": .019038,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 17,
			"jsd": .419637,
			"threshold": .018361,
			"promptId": "corpus/coder_prompts.txt:3",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 18,
			"jsd": .137673,
			"threshold": .018361,
			"promptId": "corpus/coder_prompts.txt:4",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 19,
			"jsd": .135919,
			"threshold": .018361,
			"promptId": "corpus/coder_prompts.txt:4",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 20,
			"jsd": .222857,
			"threshold": .018361,
			"promptId": "corpus/coder_prompts.txt:5",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 21,
			"jsd": .070992,
			"threshold": .018361,
			"promptId": "corpus/coder_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 22,
			"jsd": .08439,
			"threshold": .017933,
			"promptId": "corpus/coder_prompts.txt:5",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 23,
			"jsd": .233337,
			"threshold": .017941,
			"promptId": "corpus/coder_prompts.txt:6",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 24,
			"jsd": .147648,
			"threshold": .017941,
			"promptId": "corpus/coder_prompts.txt:6",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 25,
			"jsd": .216482,
			"threshold": .017941,
			"promptId": "corpus/coder_prompts.txt:6",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 26,
			"jsd": .22819,
			"threshold": .017941,
			"promptId": "corpus/coder_prompts.txt:6",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 27,
			"jsd": .053339,
			"threshold": .017941,
			"promptId": "corpus/coder_prompts.txt:6",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 28,
			"jsd": .06318,
			"threshold": .017313,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 29,
			"jsd": .194199,
			"threshold": .016776,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": true,
			"kind": "drift"
		},
		{
			"global_k": 30,
			"jsd": .06996,
			"threshold": .016776,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 31,
			"jsd": .01502,
			"threshold": .016363,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 32,
			"jsd": .066087,
			"threshold": .015968,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 33,
			"jsd": .0349,
			"threshold": .015538,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 34,
			"jsd": .336481,
			"threshold": .01505,
			"promptId": "corpus/coder_prompts.txt:7",
			"flagged": true,
			"kind": "conflict"
		},
		{
			"global_k": 35,
			"jsd": .071239,
			"threshold": .01505,
			"promptId": "corpus/coder_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 36,
			"jsd": .073289,
			"threshold": .014785,
			"promptId": "corpus/coder_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 37,
			"jsd": .054024,
			"threshold": .014571,
			"promptId": "corpus/coder_prompts.txt:8",
			"flagged": false,
			"kind": null
		},
		{
			"global_k": 38,
			"jsd": .138399,
			"threshold": .014087,
			"promptId": "corpus/coder_prompts.txt:8",
			"flagged": true,
			"kind": "drift"
		}
	],
	"spans": [
		{
			"promptId": "corpus/coder_prompts.txt:3",
			"file": "corpus/coder_prompts.txt",
			"line": 3,
			"start": 0,
			"end": 0,
			"global_start": 10,
			"global_end": 10,
			"kind": "drift",
			"peak_jsd": .491202,
			"mean_jsd": .491202,
			"snippet": "for",
			"predictionA": "i",
			"predictionB": "each",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:3",
			"file": "corpus/coder_prompts.txt",
			"line": 3,
			"start": 7,
			"end": 7,
			"global_start": 17,
			"global_end": 17,
			"kind": "conflict",
			"peak_jsd": .419637,
			"mean_jsd": .419637,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "␣",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:1",
			"file": "corpus/coder_prompts.txt",
			"line": 1,
			"start": 5,
			"end": 5,
			"global_start": 5,
			"global_end": 5,
			"kind": "conflict",
			"peak_jsd": .373806,
			"mean_jsd": .373806,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "␣",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:2",
			"file": "corpus/coder_prompts.txt",
			"line": 2,
			"start": 3,
			"end": 3,
			"global_start": 9,
			"global_end": 9,
			"kind": "conflict",
			"peak_jsd": .343565,
			"mean_jsd": .343565,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "↵",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:7",
			"file": "corpus/coder_prompts.txt",
			"line": 7,
			"start": 6,
			"end": 6,
			"global_start": 34,
			"global_end": 34,
			"kind": "conflict",
			"peak_jsd": .336481,
			"mean_jsd": .336481,
			"snippet": "{",
			"predictionA": "↵",
			"predictionB": "return",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:6",
			"file": "corpus/coder_prompts.txt",
			"line": 6,
			"start": 0,
			"end": 3,
			"global_start": 23,
			"global_end": 26,
			"kind": "drift",
			"peak_jsd": .233337,
			"mean_jsd": .206414,
			"snippet": "SELECT name FROM users",
			"predictionA": "↵",
			"predictionB": "nullptr",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:5",
			"file": "corpus/coder_prompts.txt",
			"line": 5,
			"start": 0,
			"end": 0,
			"global_start": 20,
			"global_end": 20,
			"kind": "drift",
			"peak_jsd": .222857,
			"mean_jsd": .222857,
			"snippet": "class",
			"predictionA": "Solution",
			"predictionB": "Employee",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:7",
			"file": "corpus/coder_prompts.txt",
			"line": 7,
			"start": 1,
			"end": 1,
			"global_start": 29,
			"global_end": 29,
			"kind": "drift",
			"peak_jsd": .194199,
			"mean_jsd": .194199,
			"snippet": "sum",
			"predictionA": "(a",
			"predictionB": "Of",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:1",
			"file": "corpus/coder_prompts.txt",
			"line": 1,
			"start": 1,
			"end": 1,
			"global_start": 1,
			"global_end": 1,
			"kind": "drift",
			"peak_jsd": .192725,
			"mean_jsd": .192725,
			"snippet": "add",
			"predictionA": "(a",
			"predictionB": "_numbers",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:8",
			"file": "corpus/coder_prompts.txt",
			"line": 8,
			"start": 3,
			"end": 3,
			"global_start": 38,
			"global_end": 38,
			"kind": "drift",
			"peak_jsd": .138399,
			"mean_jsd": .138399,
			"snippet": "string",
			"predictionA": "↵",
			"predictionB": "in",
			"highlight": false,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:4",
			"file": "corpus/coder_prompts.txt",
			"line": 4,
			"start": 0,
			"end": 1,
			"global_start": 18,
			"global_end": 19,
			"kind": "drift",
			"peak_jsd": .137673,
			"mean_jsd": .136796,
			"snippet": "import json",
			"predictionA": "{",
			"predictionB": "{",
			"highlight": false,
			"annotate": false
		}
	],
	"top_spans": [
		{
			"promptId": "corpus/coder_prompts.txt:3",
			"file": "corpus/coder_prompts.txt",
			"line": 3,
			"start": 0,
			"end": 0,
			"global_start": 10,
			"global_end": 10,
			"kind": "drift",
			"peak_jsd": .491202,
			"mean_jsd": .491202,
			"snippet": "for",
			"predictionA": "i",
			"predictionB": "each",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:3",
			"file": "corpus/coder_prompts.txt",
			"line": 3,
			"start": 7,
			"end": 7,
			"global_start": 17,
			"global_end": 17,
			"kind": "conflict",
			"peak_jsd": .419637,
			"mean_jsd": .419637,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "␣",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:1",
			"file": "corpus/coder_prompts.txt",
			"line": 1,
			"start": 5,
			"end": 5,
			"global_start": 5,
			"global_end": 5,
			"kind": "conflict",
			"peak_jsd": .373806,
			"mean_jsd": .373806,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "␣",
			"highlight": true,
			"annotate": true
		},
		{
			"promptId": "corpus/coder_prompts.txt:2",
			"file": "corpus/coder_prompts.txt",
			"line": 2,
			"start": 3,
			"end": 3,
			"global_start": 9,
			"global_end": 9,
			"kind": "conflict",
			"peak_jsd": .343565,
			"mean_jsd": .343565,
			"snippet": "):",
			"predictionA": "↵",
			"predictionB": "↵",
			"highlight": true,
			"annotate": false
		},
		{
			"promptId": "corpus/coder_prompts.txt:7",
			"file": "corpus/coder_prompts.txt",
			"line": 7,
			"start": 6,
			"end": 6,
			"global_start": 34,
			"global_end": 34,
			"kind": "conflict",
			"peak_jsd": .336481,
			"mean_jsd": .336481,
			"snippet": "{",
			"predictionA": "↵",
			"predictionB": "return",
			"highlight": true,
			"annotate": false
		}
	],
	"hook_log": [
		"hook A:embed -> Embedding",
		"hook A:block.0 -> Qwen2DecoderLayer",
		"hook A:block.1 -> Qwen2DecoderLayer",
		"hook A:block.2 -> Qwen2DecoderLayer",
		"hook A:block.3 -> Qwen2DecoderLayer",
		"hook A:block.4 -> Qwen2DecoderLayer",
		"hook A:block.5 -> Qwen2DecoderLayer",
		"hook A:block.6 -> Qwen2DecoderLayer",
		"hook A:block.7 -> Qwen2DecoderLayer",
		"hook A:block.8 -> Qwen2DecoderLayer",
		"hook A:block.9 -> Qwen2DecoderLayer",
		"hook A:block.10 -> Qwen2DecoderLayer",
		"hook A:block.11 -> Qwen2DecoderLayer",
		"hook A:block.12 -> Qwen2DecoderLayer",
		"hook A:block.13 -> Qwen2DecoderLayer",
		"hook A:block.14 -> Qwen2DecoderLayer",
		"hook A:block.15 -> Qwen2DecoderLayer",
		"hook A:block.16 -> Qwen2DecoderLayer",
		"hook A:block.17 -> Qwen2DecoderLayer",
		"hook A:block.18 -> Qwen2DecoderLayer",
		"hook A:block.19 -> Qwen2DecoderLayer",
		"hook A:block.20 -> Qwen2DecoderLayer",
		"hook A:block.21 -> Qwen2DecoderLayer",
		"hook A:block.22 -> Qwen2DecoderLayer",
		"hook A:block.23 -> Qwen2DecoderLayer",
		"hook B:embed -> Embedding",
		"hook B:block.0 -> Qwen2DecoderLayer",
		"hook B:block.1 -> Qwen2DecoderLayer",
		"hook B:block.2 -> Qwen2DecoderLayer",
		"hook B:block.3 -> Qwen2DecoderLayer",
		"hook B:block.4 -> Qwen2DecoderLayer",
		"hook B:block.5 -> Qwen2DecoderLayer",
		"hook B:block.6 -> Qwen2DecoderLayer",
		"hook B:block.7 -> Qwen2DecoderLayer",
		"hook B:block.8 -> Qwen2DecoderLayer",
		"hook B:block.9 -> Qwen2DecoderLayer",
		"hook B:block.10 -> Qwen2DecoderLayer",
		"hook B:block.11 -> Qwen2DecoderLayer",
		"hook B:block.12 -> Qwen2DecoderLayer",
		"hook B:block.13 -> Qwen2DecoderLayer",
		"hook B:block.14 -> Qwen2DecoderLayer",
		"hook B:block.15 -> Qwen2DecoderLayer",
		"hook B:block.16 -> Qwen2DecoderLayer",
		"hook B:block.17 -> Qwen2DecoderLayer",
		"hook B:block.18 -> Qwen2DecoderLayer",
		"hook B:block.19 -> Qwen2DecoderLayer",
		"hook B:block.20 -> Qwen2DecoderLayer",
		"hook B:block.21 -> Qwen2DecoderLayer",
		"hook B:block.22 -> Qwen2DecoderLayer",
		"hook B:block.23 -> Qwen2DecoderLayer",
		"attached 50 forward hooks",
		"hook A:embed -> Embedding",
		"hook A:block.0 -> Qwen2DecoderLayer",
		"hook A:block.1 -> Qwen2DecoderLayer",
		"hook A:block.2 -> Qwen2DecoderLayer",
		"hook A:block.3 -> Qwen2DecoderLayer",
		"hook A:block.4 -> Qwen2DecoderLayer",
		"hook A:block.5 -> Qwen2DecoderLayer",
		"hook A:block.6 -> Qwen2DecoderLayer",
		"hook A:block.7 -> Qwen2DecoderLayer",
		"hook A:block.8 -> Qwen2DecoderLayer",
		"hook A:block.9 -> Qwen2DecoderLayer",
		"hook A:block.10 -> Qwen2DecoderLayer",
		"hook A:block.11 -> Qwen2DecoderLayer",
		"hook A:block.12 -> Qwen2DecoderLayer",
		"hook A:block.13 -> Qwen2DecoderLayer",
		"hook A:block.14 -> Qwen2DecoderLayer",
		"hook A:block.15 -> Qwen2DecoderLayer",
		"hook A:block.16 -> Qwen2DecoderLayer",
		"hook A:block.17 -> Qwen2DecoderLayer",
		"hook A:block.18 -> Qwen2DecoderLayer",
		"hook A:block.19 -> Qwen2DecoderLayer",
		"hook A:block.20 -> Qwen2DecoderLayer",
		"hook A:block.21 -> Qwen2DecoderLayer",
		"hook A:block.22 -> Qwen2DecoderLayer",
		"hook A:block.23 -> Qwen2DecoderLayer",
		"hook B:embed -> Embedding",
		"hook B:block.0 -> Qwen2DecoderLayer",
		"hook B:block.1 -> Qwen2DecoderLayer",
		"hook B:block.2 -> Qwen2DecoderLayer",
		"hook B:block.3 -> Qwen2DecoderLayer",
		"hook B:block.4 -> Qwen2DecoderLayer",
		"hook B:block.5 -> Qwen2DecoderLayer",
		"hook B:block.6 -> Qwen2DecoderLayer",
		"hook B:block.7 -> Qwen2DecoderLayer",
		"hook B:block.8 -> Qwen2DecoderLayer",
		"hook B:block.9 -> Qwen2DecoderLayer",
		"hook B:block.10 -> Qwen2DecoderLayer",
		"hook B:block.11 -> Qwen2DecoderLayer",
		"hook B:block.12 -> Qwen2DecoderLayer",
		"hook B:block.13 -> Qwen2DecoderLayer",
		"hook B:block.14 -> Qwen2DecoderLayer",
		"hook B:block.15 -> Qwen2DecoderLayer",
		"hook B:block.16 -> Qwen2DecoderLayer",
		"hook B:block.17 -> Qwen2DecoderLayer",
		"hook B:block.18 -> Qwen2DecoderLayer",
		"hook B:block.19 -> Qwen2DecoderLayer",
		"hook B:block.20 -> Qwen2DecoderLayer",
		"hook B:block.21 -> Qwen2DecoderLayer",
		"hook B:block.22 -> Qwen2DecoderLayer",
		"hook B:block.23 -> Qwen2DecoderLayer",
		"attached 50 forward hooks",
		"detached 50 forward hooks"
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
		"live_hooks_attached": 50,
		"live_hooks_released": true,
		"dtype_a": "float16",
		"dtype_b": "float16",
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
	const [view, setView] = (0, import_react.useState)("local");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex w-full max-w-6xl justify-end px-4 pt-6 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex rounded-2xl bg-surface p-1 shadow-border",
			role: "group",
			"aria-label": "Brief",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": view === "published",
				onClick: () => setView("published"),
				className: `rounded-xl px-3 py-1.5 text-sm ${view === "published" ? "bg-bone text-bg" : "text-muted"}`,
				children: "Qwen 3.8"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": view === "local",
				onClick: () => setView("local"),
				className: `rounded-xl px-3 py-1.5 text-sm ${view === "local" ? "bg-bone text-bg" : "text-muted"}`,
				children: "Local audit"
			})]
		})
	}), view === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishedBrief, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingView, { briefing })] });
}
//#endregion
export { Home as component };
