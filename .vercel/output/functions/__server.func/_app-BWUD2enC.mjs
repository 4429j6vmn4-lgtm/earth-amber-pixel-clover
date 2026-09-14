import { r as format, t as parseISO } from "./_libs/date-fns.mjs";
import { a as relative, n as money, o as serviceHost, t as bagsLabel } from "./_ssr/format-DQ6r26t1.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { t as ServiceChip } from "./_ssr/service-chip-YbKVt54M.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as getDesk } from "./_ssr/api-3txm1eeY.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-MLqpEUPk.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BWUD2enC.js
var import_jsx_runtime = require_jsx_runtime();
function DeskPage() {
	const desk = useQuery({
		queryKey: ["desk"],
		queryFn: () => getDesk()
	});
	if (desk.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskSkeleton, {});
	if (desk.error || !desk.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: "Could not read the desk from MariaDB."
	});
	const data = desk.data;
	const low = data.products.filter((p) => p.stock_bags < 12).slice(0, 4);
	const chart = data.series.map((row) => ({
		...row,
		label: format(parseISO(row.day), "EEE")
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-micro tracking-brand text-muted uppercase",
					children: format(/* @__PURE__ */ new Date(), "EEEE d MMMM")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl leading-tight sm:text-4xl",
					children: "Morning roast"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-muted",
					children: "PHP serves the lot book. Java runs the ticket pipeline. MariaDB holds the cellar."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						className: "rise",
						label: "Open tickets",
						value: String(data.open_orders),
						hint: "Java fulfillment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						className: "rise rise-2",
						label: "Bags on hand",
						value: String(data.bags_on_hand),
						hint: "MariaDB cellar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						className: "rise rise-3",
						label: "Low lots",
						value: String(data.low_stock),
						hint: "Below 12 bags"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						className: "rise rise-4",
						label: "Shipped (7d)",
						value: String(data.shipped_week),
						hint: "Bags out the door"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl",
							children: "Bags allocated"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-micro tracking-wider text-muted uppercase",
							children: "Last seven days"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: chart.length ? chart : [{
									label: "—",
									bags: 0
								}],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "bags",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--color-primary)",
											stopOpacity: .35
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--color-primary)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false,
										width: 28,
										allowDecimals: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "var(--color-raised)",
											border: "1px solid var(--color-border)",
											borderRadius: 8,
											color: "var(--color-fg)",
											fontSize: 12
										},
										formatter: (value) => [String(value ?? 0), "bags"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "bags",
										stroke: "var(--color-primary)",
										strokeWidth: 1.5,
										fill: "url(#bags)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl",
							children: "Low cellar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cellar",
							className: "text-sm text-muted hover:text-fg",
							children: "Open cellar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: low.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "All lots are healthy."
						}) : low.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-fg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-micro text-subtle",
									children: p.sku
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg tabular-nums text-warning",
								children: p.stock_bags
							})]
						}, p.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl",
							children: "Live tickets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders",
							className: "text-sm text-muted hover:text-fg",
							children: "All orders"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: data.orders.slice(0, 5).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-sm text-fg",
									children: order.order_no
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm text-muted",
									children: [
										order.trade_name,
										" · ",
										bagsLabel(order.bag_count)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-micro tabular-nums text-subtle",
									children: money(order.total_cents)
								})]
							})]
						}, order.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 font-display text-xl",
						children: "Service log"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: data.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: event.service }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-micro text-subtle",
										children: serviceHost(event.service)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: event.detail
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-mono text-micro text-subtle",
								children: relative(event.created_at)
							})]
						}, event.id))
					})]
				})]
			})
		]
	});
}
function Kpi({ label, value, hint, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-micro tracking-wider text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-4xl leading-none tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-subtle",
				children: hint
			})
		]
	});
}
function DeskSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-xl bg-surface shadow-[var(--shadow-border)]" }, i))
	});
}
//#endregion
export { DeskPage as component };
