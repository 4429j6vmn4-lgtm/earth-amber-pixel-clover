import { s as serviceLabel } from "./format-DQ6r26t1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-chip-YbKVt54M.js
var import_jsx_runtime = require_jsx_runtime();
function ServiceChip({ service, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 font-mono text-micro tracking-wider text-muted uppercase", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", service === "php" && "bg-success", service === "java" && "bg-warning", service === "mariadb" && "bg-primary") }), serviceLabel(service)]
	});
}
//#endregion
export { ServiceChip as t };
