import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-3txm1eeY.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getDesk = createServerFn({ method: "GET" }).handler(createSsrRpc("e3f4e2a24cfb0190ed12c17a6a809feb55d7d67820acf3920b56321cdc2b7046"));
var listProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("dcdb5e0f35f0b9d5551ac12a395f83eca45f13734974c6fe2bcd7bd2ce9920e2"));
var listAccounts = createServerFn({ method: "GET" }).handler(createSsrRpc("4dc9e68c67fad1c5721face4ff3122b6ae2a8f6acafe074e58b6c6bd3f2342a0"));
var listOrders = createServerFn({ method: "GET" }).handler(createSsrRpc("eebe64c1062596ae3c8be8859b2ff945ee1efeae9ed276f6b9ef7f7021064790"));
var listStockMoves = createServerFn({ method: "GET" }).handler(createSsrRpc("b56fdfa903bfd15d08d9b450ef837e25126f3ad3a32ba17c610810e8bd51490d"));
var listEvents = createServerFn({ method: "GET" }).handler(createSsrRpc("4f183cc101c8fa2ad4ef5c671bd4c0f89a47907e4aabbaf318638584192ad23d"));
var productInput = object({
	sku: string().min(2).max(24),
	name: string().min(2).max(80),
	origin: string().min(2).max(80),
	process: string().min(2).max(32),
	roast: string().min(2).max(24),
	bag_grams: number().int().min(100).max(5e3),
	price_cents: number().int().min(100).max(2e4),
	stock_bags: number().int().min(0).max(500),
	notes: string().max(240).default("")
});
var createProduct = createServerFn({ method: "POST" }).validator(productInput).handler(createSsrRpc("31ae685c0bb7c459f223fd7895ffd3f7dd6677beed9cf80f57b955bc207f0545"));
var orderInput = object({
	account_id: number().int().positive(),
	lines: array(object({
		product_id: number().int().positive(),
		bags: number().int().min(1).max(200)
	})).min(1).max(8)
});
var createOrder = createServerFn({ method: "POST" }).validator(orderInput).handler(createSsrRpc("63e62798d256aad3bd79d8cff046450457bb798a7dbbacd5893c51a17295e595"));
var advanceOrder = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(createSsrRpc("b5a04bd4cdde78ef5f2018683f304f74b5481d2917f47686e97188dddda8a906"));
var cancelOrder = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(createSsrRpc("f617390f4b0cbdae8a7b294842a1b2daf592cd1dacb6acdccc0ec841648cb246"));
var receiveInput = object({
	product_id: number().int().positive(),
	bags: number().int().min(1).max(500),
	reason: string().min(2).max(40).default("receive")
});
var receiveStock = createServerFn({ method: "POST" }).validator(receiveInput).handler(createSsrRpc("f41657e366e4e6a078706e8ebf7aa48ccbe2621877686890f5e31e52d274fb91"));
//#endregion
export { getDesk as a, listOrders as c, receiveStock as d, createProduct as i, listProducts as l, cancelOrder as n, listAccounts as o, createOrder as r, listEvents as s, advanceOrder as t, listStockMoves as u };
