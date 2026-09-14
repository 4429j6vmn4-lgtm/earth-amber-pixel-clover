import { n as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-DQ6r26t1.js
function money(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function bagsLabel(n) {
	return `${n} ${n === 1 ? "bag" : "bags"}`;
}
function relative(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return formatDistanceToNow(d, { addSuffix: true });
}
function statusLabel(status) {
	switch (status) {
		case "queued": return "Queued";
		case "roasting": return "Roasting";
		case "packed": return "Packed";
		case "shipped": return "Shipped";
		case "cancelled": return "Cancelled";
	}
}
function nextStatus(status) {
	switch (status) {
		case "queued": return "roasting";
		case "roasting": return "packed";
		case "packed": return "shipped";
		default: return null;
	}
}
function nextStatusLabel(status) {
	const next = nextStatus(status);
	if (!next) return null;
	switch (next) {
		case "roasting": return "Start roast";
		case "packed": return "Mark packed";
		case "shipped": return "Ship";
		default: return null;
	}
}
function serviceLabel(service) {
	switch (service) {
		case "php": return "PHP";
		case "java": return "Java";
		case "mariadb": return "MariaDB";
	}
}
function serviceHost(service) {
	switch (service) {
		case "php": return "php://catalog";
		case "java": return "java://fulfillment";
		case "mariadb": return "mariadb://core";
	}
}
//#endregion
export { relative as a, statusLabel as c, nextStatusLabel as i, money as n, serviceHost as o, nextStatus as r, serviceLabel as s, bagsLabel as t };
