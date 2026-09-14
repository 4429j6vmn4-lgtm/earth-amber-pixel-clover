import { o as __toESM } from "../_runtime.mjs";
import { a as relative, i as nextStatusLabel, n as money, t as bagsLabel } from "./format-DQ6r26t1.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as listOrders, l as listProducts, n as cancelOrder, o as listAccounts, r as createOrder, t as advanceOrder } from "./api-3txm1eeY.mjs";
import { t as StatusBadge } from "./status-badge-MLqpEUPk.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as DialogHeader, c as Input, i as DialogDescription, l as Label, n as Dialog, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Button } from "./dialog-C3QRezfV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B7goos8V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CmhbIBpj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var filters = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "queued",
		label: "Queued"
	},
	{
		id: "roasting",
		label: "Roasting"
	},
	{
		id: "packed",
		label: "Packed"
	},
	{
		id: "shipped",
		label: "Shipped"
	}
];
function OrdersPage() {
	const qc = useQueryClient();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const orders = useQuery({
		queryKey: ["orders"],
		queryFn: () => listOrders()
	});
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	const products = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const visible = (0, import_react.useMemo)(() => (orders.data ?? []).filter((o) => filter === "all" ? o.status !== "cancelled" : o.status === filter), [orders.data, filter]);
	const advance = useMutation({
		mutationFn: (id) => advanceOrder({ data: { id } }),
		onSuccess: (order) => {
			toast.success(`Java advanced ${order.order_no}`);
			qc.invalidateQueries();
		},
		onError: (err) => toast.error(err.message)
	});
	const cancel = useMutation({
		mutationFn: (id) => cancelOrder({ data: { id } }),
		onSuccess: (order) => {
			toast.success(`Java released ${order.order_no}`);
			qc.invalidateQueries();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-micro tracking-brand text-muted uppercase",
						children: "java://fulfillment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl leading-tight",
						children: "Tickets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Queued, roasting, packed, shipped. Java allocates cellar stock and walks each ticket through the roast pipeline."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOrderDialog, {
					accounts: accounts.data ?? [],
					products: products.data ?? [],
					onCreated: () => void qc.invalidateQueries()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto",
				children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(f.id),
					className: `h-11 shrink-0 rounded-full px-4 text-sm transition-colors duration-150 ${filter === f.id ? "bg-primary text-primary-fg" : "bg-surface text-muted hover:text-fg"}`,
					children: f.label
				}, f.id))
			}),
			orders.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-xl bg-surface" }, i))
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No tickets in this lane."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: visible.map((order) => {
					const next = nextStatusLabel(order.status);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-sm text-fg",
												children: order.order_no
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-subtle",
												children: relative(order.created_at)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted",
										children: [
											order.trade_name,
											", ",
											order.city,
											" · ",
											bagsLabel(order.bag_count),
											" ·",
											" ",
											money(order.total_cents)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 flex flex-wrap gap-x-4 gap-y-1",
										children: order.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "font-mono text-micro text-subtle",
											children: [
												line.sku,
												" × ",
												line.bags
											]
										}, line.id))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: advance.isPending,
									onClick: () => advance.mutate(order.id),
									children: next
								}) : null, order.status !== "shipped" && order.status !== "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									disabled: cancel.isPending,
									onClick: () => cancel.mutate(order.id),
									children: "Release"
								}) : null]
							})]
						})
					}, order.id);
				})
			})
		]
	});
}
function NewOrderDialog({ accounts, products, onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [accountId, setAccountId] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([{
		product_id: "",
		bags: 4
	}]);
	const create = useMutation({
		mutationFn: () => createOrder({ data: {
			account_id: Number(accountId),
			lines: lines.filter((l) => l.product_id).map((l) => ({
				product_id: Number(l.product_id),
				bags: Number(l.bags)
			}))
		} }),
		onSuccess: (order) => {
			toast.success(`Java opened ${order.order_no}`);
			setOpen(false);
			setAccountId("");
			setLines([{
				product_id: "",
				bags: 4
			}]);
			onCreated();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Open ticket" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Wholesale ticket" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Java allocates bags immediately. Short lots will be refused." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					if (!accountId) {
						toast.error("Choose a café");
						return;
					}
					create.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Café" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: accountId,
							onValueChange: setAccountId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select account" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: String(a.id),
								children: [
									a.trade_name,
									" · ",
									a.city
								]
							}, a.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_5.5rem] gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: line.product_id,
								onValueChange: (v) => {
									const next = [...lines];
									next[i] = {
										...line,
										product_id: v
									};
									setLines(next);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Lot" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: String(p.id),
									children: [
										p.name,
										" · ",
										p.stock_bags,
										" left"
									]
								}, p.id)) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								value: line.bags,
								onChange: (e) => {
									const next = [...lines];
									next[i] = {
										...line,
										bags: Number(e.target.value)
									};
									setLines(next);
								}
							})]
						}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => setLines([...lines, {
								product_id: "",
								bags: 2
							}]),
							children: "Add line"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: create.isPending,
						children: create.isPending ? "Allocating…" : "Commit through Java"
					})
				]
			})]
		})]
	});
}
//#endregion
export { OrdersPage as component };
