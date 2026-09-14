import { o as __toESM } from "../_runtime.mjs";
import { n as money, t as bagsLabel } from "./format-DQ6r26t1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as createProduct, l as listProducts } from "./api-3txm1eeY.mjs";
import { t as Badge } from "./badge-BEZpl09i.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as DialogHeader, c as Input, i as DialogDescription, l as Label, n as Dialog, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Button } from "./dialog-C3QRezfV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DsBarcUY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	sku: "",
	name: "",
	origin: "",
	process: "Washed",
	roast: "Medium",
	bag_grams: 340,
	price_cents: 2200,
	stock_bags: 12,
	notes: ""
};
function CatalogPage() {
	const qc = useQueryClient();
	const products = useQuery({
		queryKey: ["products"],
		queryFn: () => listProducts()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(empty);
	const create = useMutation({
		mutationFn: (input) => createProduct({ data: input }),
		onSuccess: (lot) => {
			toast.success(`PHP catalog registered ${lot.sku}`);
			setOpen(false);
			setForm(empty);
			qc.invalidateQueries();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-micro tracking-brand text-muted uppercase",
					children: "php://catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl leading-tight",
					children: "Lot book"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: "Origins, process, and the price book. New lots land in MariaDB through the PHP catalog service."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Register lot" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New lot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "PHP writes the row; MariaDB is the system of record." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3 sm:grid-cols-2",
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate({
							...form,
							sku: form.sku.trim(),
							name: form.name.trim(),
							origin: form.origin.trim(),
							price_cents: Number(form.price_cents),
							bag_grams: Number(form.bag_grams),
							stock_bags: Number(form.stock_bags)
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "SKU",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.sku,
								placeholder: "NL-XXX-09",
								onChange: (e) => setForm({
									...form,
									sku: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.name,
								placeholder: "Yirgacheffe Washed",
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Origin",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.origin,
								placeholder: "Yirgacheffe, Ethiopia",
								onChange: (e) => setForm({
									...form,
									origin: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Process",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.process,
								onChange: (e) => setForm({
									...form,
									process: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Roast",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.roast,
								onChange: (e) => setForm({
									...form,
									roast: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bag grams",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "number",
								min: 100,
								value: form.bag_grams,
								onChange: (e) => setForm({
									...form,
									bag_grams: Number(e.target.value)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Price (USD)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "number",
								step: "0.01",
								min: 1,
								value: (form.price_cents / 100).toFixed(2),
								onChange: (e) => setForm({
									...form,
									price_cents: Math.round(Number(e.target.value) * 100)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opening bags",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "number",
								min: 0,
								value: form.stock_bags,
								onChange: (e) => setForm({
									...form,
									stock_bags: Number(e.target.value)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cupping notes",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.notes,
								placeholder: "Jasmine, bergamot…",
								onChange: (e) => setForm({
									...form,
									notes: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2 mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: create.isPending,
								className: "w-full",
								children: create.isPending ? "Writing…" : "Commit to MariaDB"
							})
						})
					]
				})] })]
			})]
		}), products.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 animate-pulse rounded-xl bg-surface" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: products.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)] sm:px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl leading-none",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-micro text-subtle",
									children: p.sku
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: p.origin
							}),
							p.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm italic text-subtle",
								children: p.notes
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 sm:justify-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.process }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.roast }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: p.stock_bags < 12 ? "warning" : "paper",
								children: bagsLabel(p.stock_bags)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pl-1 font-display text-xl tabular-nums",
								children: money(p.price_cents)
							})
						]
					})]
				})
			}, p.id))
		})]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("grid gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { CatalogPage as component };
