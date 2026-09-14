import { c as statusLabel } from "./format-DQ6r26t1.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Badge } from "./badge-BEZpl09i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-MLqpEUPk.js
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	queued: "paper",
	roasting: "warning",
	packed: "neutral",
	shipped: "success",
	cancelled: "danger"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: tone[status],
		children: statusLabel(status)
	});
}
//#endregion
export { StatusBadge as t };
