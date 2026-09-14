import { o as __toESM } from "../_runtime.mjs";
import { a as relative, t as bagsLabel } from "./format-DQ6r26t1.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as receiveStock, l as listProducts, u as listStockMoves } from "./api-3txm1eeY.mjs";
import { t as Badge } from "./badge-BEZpl09i.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as DialogHeader, c as Input, i as DialogDescription, l as Label, n as Dialog, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Button } from "./dialog-C3QRezfV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B7goos8V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cellar-Cad5E8-X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CellarPage() {
	const qc = useQueryClient();
	const products = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const moves = useQuery({
		queryKey: ["moves"],
		queryFn: () => listStockMoves()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-micro tracking-brand text-muted uppercase",
						children: "mariadb://core"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl leading-tight",
						children: "Cellar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "On-hand bags and the movement ledger. Receives write through MariaDB; Java only allocates, never invents stock."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiveDialog, {
					products: products.data ?? [],
					onReceived: () => void qc.invalidateQueries()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border font-mono text-micro tracking-wider text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Lot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Origin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Roast"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "On hand"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-fg",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-micro text-subtle",
									children: p.sku
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: p.origin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.roast })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-display text-xl tabular-nums ${p.stock_bags < 12 ? "text-warning" : "text-fg"}`,
									children: p.stock_bags
								})
							})
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-display text-xl",
				children: "Movement ledger"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: moves.data?.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-fg",
							children: [
								m.product_name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-micro text-subtle",
									children: m.sku
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-micro text-subtle",
							children: [
								m.reason,
								m.ref ? ` · ${m.ref}` : "",
								" · ",
								relative(m.created_at)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `font-mono text-sm tabular-nums ${m.delta_bags < 0 ? "text-danger" : "text-success"}`,
						children: [m.delta_bags > 0 ? "+" : "", bagsLabel(m.delta_bags)]
					})]
				}, m.id))
			})] })
		]
	});
}
function ReceiveDialog({ products, onReceived }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [productId, setProductId] = (0, import_react.useState)("");
	const [bags, setBags] = (0, import_react.useState)(12);
	const [reason, setReason] = (0, import_react.useState)("receive");
	const receive = useMutation({
		mutationFn: () => receiveStock({ data: {
			product_id: Number(productId),
			bags,
			reason
		} }),
		onSuccess: (lot) => {
			toast.success(`MariaDB received ${bags} bags of ${lot.sku}`);
			setOpen(false);
			onReceived();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Receive roast" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Receive into cellar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A roast batch landing in MariaDB. Does not go through Java." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				if (!productId) {
					toast.error("Choose a lot");
					return;
				}
				receive.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Lot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: productId,
						onValueChange: setProductId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select lot" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: String(p.id),
							children: [
								p.name,
								" · ",
								p.sku
							]
						}, p.id)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bags" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: bags,
							onChange: (e) => setBags(Number(e.target.value))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: receive.isPending,
					children: receive.isPending ? "Writing…" : "Write to MariaDB"
				})
			]
		})] })]
	});
}
//#endregion
export { CellarPage as component };
