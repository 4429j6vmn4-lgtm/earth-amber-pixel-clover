import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { t as ServiceChip } from "./_ssr/service-chip-YbKVt54M.mjs";
import { _ as Link, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Layers, i as LayoutDashboard, l as Boxes, o as Coffee, r as ScrollText } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-CsjWSpug.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/",
		label: "Desk",
		icon: LayoutDashboard
	},
	{
		to: "/catalog",
		label: "Catalog",
		icon: Coffee
	},
	{
		to: "/orders",
		label: "Orders",
		icon: ScrollText
	},
	{
		to: "/cellar",
		label: "Cellar",
		icon: Boxes
	},
	{
		to: "/stack",
		label: "Stack",
		icon: Layers
	}
];
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5 pb-0 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-micro tracking-brand text-muted uppercase",
						children: "Wholesale coffee"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl leading-none tracking-tight sm:text-5xl",
						children: "Northline"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-4 pt-2 sm:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: "php" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: "java" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: "mariadb" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "-mb-px flex gap-1 overflow-x-auto",
					children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-muted transition-colors duration-150", "hover:text-fg"),
						activeProps: { className: "border-primary text-fg" },
						activeOptions: item.to === "/" ? { exact: true } : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
					}, item.to))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
			children
		})]
	});
}
function AppLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };
