import { r as nextStatus } from "./format-DQ6r26t1.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DwID38Ub.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_northline_default = "create table if not exists accounts (\n  id          serial primary key,\n  trade_name  text not null unique,\n  city        text not null,\n  region      text not null\n);\n\ncreate table if not exists products (\n  id          serial primary key,\n  sku         text not null unique,\n  name        text not null,\n  origin      text not null,\n  process     text not null,\n  roast       text not null,\n  bag_grams   integer not null,\n  price_cents integer not null,\n  stock_bags  integer not null default 0,\n  notes       text not null default ''\n);\n\ncreate table if not exists orders (\n  id          serial primary key,\n  order_no    text not null unique,\n  account_id  integer not null references accounts(id),\n  status      text not null,\n  created_at  timestamptz not null default now(),\n  updated_at  timestamptz not null default now()\n);\n\ncreate table if not exists order_lines (\n  id               serial primary key,\n  order_id         integer not null references orders(id),\n  product_id       integer not null references products(id),\n  bags             integer not null,\n  unit_price_cents integer not null\n);\n\ncreate table if not exists stock_moves (\n  id          serial primary key,\n  product_id  integer not null references products(id),\n  delta_bags  integer not null,\n  reason      text not null,\n  ref         text not null default '',\n  created_at  timestamptz not null default now()\n);\n\ncreate table if not exists service_events (\n  id          serial primary key,\n  service     text not null,\n  verb        text not null,\n  detail      text not null,\n  created_at  timestamptz not null default now()\n);\n\ncreate sequence if not exists order_no_seq start with 1048;\n\ncreate index if not exists orders_status_idx on orders (status);\ncreate index if not exists stock_moves_created_idx on stock_moves (created_at desc);\ncreate index if not exists service_events_created_idx on service_events (created_at desc);\n\ninsert into accounts (trade_name, city, region)\nselect * from (values\n  ('Harbor Light', 'Portland', 'Pacific Northwest'),\n  ('Glasshouse', 'Seattle', 'Pacific Northwest'),\n  ('Millwork', 'Minneapolis', 'Upper Midwest'),\n  ('Copper Still', 'Denver', 'Mountain'),\n  ('Tide & Bean', 'Boston', 'New England'),\n  ('Lowland Roast', 'Austin', 'South')\n) as v(trade_name, city, region)\nwhere not exists (select 1 from accounts);\n\ninsert into products (sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)\nselect * from (values\n  ('NL-YIR-01', 'Yirgacheffe Washed', 'Yirgacheffe, Ethiopia', 'Washed', 'Light', 340, 2450, 42, 'Jasmine, bergamot, lemon zest.'),\n  ('NL-GUI-02', 'Guji Natural', 'Guji, Ethiopia', 'Natural', 'Light', 340, 2380, 18, 'Blueberry, cocoa, floral honey.'),\n  ('NL-NYR-03', 'Nyeri AA', 'Nyeri, Kenya', 'Washed', 'Medium', 340, 2620, 9, 'Blackcurrant, grapefruit, cane sugar.'),\n  ('NL-HUI-04', 'Huila Supremo', 'Huila, Colombia', 'Washed', 'Medium', 340, 2140, 54, 'Caramel, red apple, walnut.'),\n  ('NL-HUE-05', 'Huehuetenango', 'Huehuetenango, Guatemala', 'Washed', 'Medium', 340, 2210, 31, 'Cocoa, orange, brown sugar.'),\n  ('NL-MOG-06', 'Mogiana', 'Mogiana, Brazil', 'Natural', 'Dark', 340, 1680, 76, 'Hazelnut, dark chocolate, low acid.'),\n  ('NL-SID-07', 'Sidama', 'Sidama, Ethiopia', 'Honey', 'Light', 340, 2290, 6, 'Stone fruit, tea rose, honey.'),\n  ('NL-KON-08', 'Kona Extra Fancy', 'Kona, Hawaii', 'Washed', 'Medium', 227, 4200, 4, 'Brown sugar, macadamia, citrus.')\n) as v(sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)\nwhere not exists (select 1 from products);\n\ninsert into orders (order_no, account_id, status, created_at, updated_at)\nselect * from (values\n  ('NL-1040', (select id from accounts where trade_name = 'Harbor Light'), 'shipped', now() - interval '6 days', now() - interval '5 days'),\n  ('NL-1041', (select id from accounts where trade_name = 'Glasshouse'), 'shipped', now() - interval '5 days', now() - interval '4 days'),\n  ('NL-1042', (select id from accounts where trade_name = 'Millwork'), 'shipped', now() - interval '4 days', now() - interval '3 days'),\n  ('NL-1043', (select id from accounts where trade_name = 'Copper Still'), 'packed', now() - interval '2 days', now() - interval '8 hours'),\n  ('NL-1044', (select id from accounts where trade_name = 'Tide & Bean'), 'roasting', now() - interval '1 day', now() - interval '3 hours'),\n  ('NL-1045', (select id from accounts where trade_name = 'Lowland Roast'), 'queued', now() - interval '6 hours', now() - interval '6 hours'),\n  ('NL-1046', (select id from accounts where trade_name = 'Harbor Light'), 'queued', now() - interval '2 hours', now() - interval '2 hours'),\n  ('NL-1047', (select id from accounts where trade_name = 'Glasshouse'), 'cancelled', now() - interval '3 days', now() - interval '3 days')\n) as v(order_no, account_id, status, created_at, updated_at)\nwhere not exists (select 1 from orders);\n\ninsert into order_lines (order_id, product_id, bags, unit_price_cents)\nselect o.id, p.id, v.bags, p.price_cents\nfrom (values\n  ('NL-1040', 'NL-YIR-01', 12),\n  ('NL-1040', 'NL-HUI-04', 8),\n  ('NL-1041', 'NL-NYR-03', 6),\n  ('NL-1041', 'NL-MOG-06', 20),\n  ('NL-1042', 'NL-HUE-05', 10),\n  ('NL-1042', 'NL-GUI-02', 4),\n  ('NL-1043', 'NL-SID-07', 8),\n  ('NL-1043', 'NL-YIR-01', 6),\n  ('NL-1044', 'NL-KON-08', 3),\n  ('NL-1044', 'NL-HUI-04', 12),\n  ('NL-1045', 'NL-MOG-06', 24),\n  ('NL-1046', 'NL-NYR-03', 5),\n  ('NL-1046', 'NL-GUI-02', 5),\n  ('NL-1047', 'NL-KON-08', 2)\n) as v(order_no, sku, bags)\njoin orders o on o.order_no = v.order_no\njoin products p on p.sku = v.sku\nwhere not exists (select 1 from order_lines);\n\ninsert into stock_moves (product_id, delta_bags, reason, ref, created_at)\nselect p.id, v.delta_bags, v.reason, v.ref, now() - v.ago\nfrom (values\n  ('NL-YIR-01', 60, 'receive', 'ROAST-331', interval '8 days'),\n  ('NL-GUI-02', 40, 'receive', 'ROAST-331', interval '8 days'),\n  ('NL-NYR-03', 24, 'receive', 'ROAST-332', interval '7 days'),\n  ('NL-HUI-04', 80, 'receive', 'ROAST-332', interval '7 days'),\n  ('NL-HUE-05', 48, 'receive', 'ROAST-333', interval '6 days'),\n  ('NL-MOG-06', 120, 'receive', 'ROAST-333', interval '6 days'),\n  ('NL-SID-07', 20, 'receive', 'ROAST-334', interval '5 days'),\n  ('NL-KON-08', 10, 'receive', 'ROAST-334', interval '5 days'),\n  ('NL-YIR-01', -12, 'fulfill', 'NL-1040', interval '5 days'),\n  ('NL-HUI-04', -8, 'fulfill', 'NL-1040', interval '5 days'),\n  ('NL-NYR-03', -6, 'fulfill', 'NL-1041', interval '4 days'),\n  ('NL-MOG-06', -20, 'fulfill', 'NL-1041', interval '4 days'),\n  ('NL-HUE-05', -10, 'fulfill', 'NL-1042', interval '3 days'),\n  ('NL-GUI-02', -4, 'fulfill', 'NL-1042', interval '3 days'),\n  ('NL-SID-07', -8, 'fulfill', 'NL-1043', interval '2 days'),\n  ('NL-YIR-01', -6, 'fulfill', 'NL-1043', interval '2 days'),\n  ('NL-KON-08', -3, 'fulfill', 'NL-1044', interval '1 day'),\n  ('NL-HUI-04', -12, 'fulfill', 'NL-1044', interval '1 day'),\n  ('NL-MOG-06', -24, 'allocate', 'NL-1045', interval '6 hours'),\n  ('NL-NYR-03', -5, 'allocate', 'NL-1046', interval '2 hours'),\n  ('NL-GUI-02', -5, 'allocate', 'NL-1046', interval '2 hours')\n) as v(sku, delta_bags, reason, ref, ago)\njoin products p on p.sku = v.sku\nwhere not exists (select 1 from stock_moves);\n\ninsert into service_events (service, verb, detail, created_at)\nselect * from (values\n  ('php', 'list.lots', 'Catalog served 8 active lots', now() - interval '10 minutes'),\n  ('java', 'orders.advance', 'NL-1044 roasting started', now() - interval '3 hours'),\n  ('mariadb', 'write', 'Committed stock move ROAST-334', now() - interval '5 days'),\n  ('java', 'orders.open', 'Opened NL-1046 for Harbor Light', now() - interval '2 hours'),\n  ('php', 'lots.create', 'Lot NL-KON-08 registered', now() - interval '12 days'),\n  ('mariadb', 'read', 'Desk snapshot assembled', now() - interval '4 minutes')\n) as v(service, verb, detail, created_at)\nwhere not exists (select 1 from service_events);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_northline.sql": _0002_northline_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
async function logEvent(service, verb, detail) {
	await (await getSql())`
    insert into service_events (service, verb, detail)
    values (${service}, ${verb}, ${detail})
  `;
}
async function attachLines(orders) {
	if (orders.length === 0) return [];
	const sql = await getSql();
	const ids = orders.map((o) => o.id);
	const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
	const lines = await sql.query(`select ol.order_id, ol.id, ol.product_id, p.sku, p.name as product_name,
            ol.bags, ol.unit_price_cents
     from order_lines ol
     join products p on p.id = ol.product_id
     where ol.order_id in (${placeholders})
     order by ol.id`, ids);
	const byOrder = /* @__PURE__ */ new Map();
	for (const line of lines) {
		const list = byOrder.get(line.order_id) ?? [];
		list.push({
			id: line.id,
			product_id: line.product_id,
			sku: line.sku,
			product_name: line.product_name,
			bags: line.bags,
			unit_price_cents: line.unit_price_cents
		});
		byOrder.set(line.order_id, list);
	}
	return orders.map((o) => ({
		...o,
		bag_count: Number(o.bag_count),
		total_cents: Number(o.total_cents),
		lines: byOrder.get(o.id) ?? []
	}));
}
async function fetchOrders(limit) {
	const sql = await getSql();
	return attachLines(limit ? await sql`
        select o.id, o.order_no, o.account_id, a.trade_name, a.city, o.status,
               o.created_at, o.updated_at,
               coalesce(sum(ol.bags), 0)::int as bag_count,
               coalesce(sum(ol.bags * ol.unit_price_cents), 0)::int as total_cents
        from orders o
        join accounts a on a.id = o.account_id
        left join order_lines ol on ol.order_id = o.id
        group by o.id, a.trade_name, a.city
        order by o.created_at desc
        limit ${limit}
      ` : await sql`
        select o.id, o.order_no, o.account_id, a.trade_name, a.city, o.status,
               o.created_at, o.updated_at,
               coalesce(sum(ol.bags), 0)::int as bag_count,
               coalesce(sum(ol.bags * ol.unit_price_cents), 0)::int as total_cents
        from orders o
        join accounts a on a.id = o.account_id
        left join order_lines ol on ol.order_id = o.id
        group by o.id, a.trade_name, a.city
        order by o.created_at desc
      `);
}
var getDesk_createServerFn_handler = createServerRpc({
	id: "e3f4e2a24cfb0190ed12c17a6a809feb55d7d67820acf3920b56321cdc2b7046",
	name: "getDesk",
	filename: "src/lib/api.ts"
}, (opts) => getDesk.__executeServer(opts));
var getDesk = createServerFn({ method: "GET" }).handler(getDesk_createServerFn_handler, async () => {
	const sql = await getSql();
	const [open] = await sql`
      select count(*)::int as n from orders
      where status in ('queued', 'roasting', 'packed')
    `;
	const [stock] = await sql`
      select coalesce(sum(stock_bags), 0)::int as n from products
    `;
	const [low] = await sql`
      select count(*)::int as n from products where stock_bags < 12
    `;
	const [shipped] = await sql`
      select coalesce(sum(ol.bags), 0)::int as n
      from orders o
      join order_lines ol on ol.order_id = o.id
      where o.status = 'shipped'
        and o.updated_at >= now() - interval '7 days'
    `;
	const products = await sql`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by stock_bags asc, name
    `;
	const events = await sql`
      select id, service, verb, detail, created_at
      from service_events
      order by created_at desc
      limit 8
    `;
	const series = await sql`
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
             coalesce(sum(case when delta_bags < 0 then -delta_bags else 0 end), 0)::int as bags
      from stock_moves
      where created_at >= now() - interval '7 days'
      group by 1
      order by 1
    `;
	const orders = await fetchOrders(6);
	return {
		open_orders: open?.n ?? 0,
		bags_on_hand: stock?.n ?? 0,
		low_stock: low?.n ?? 0,
		shipped_week: shipped?.n ?? 0,
		products,
		orders,
		events,
		series
	};
});
var listProducts_createServerFn_handler = createServerRpc({
	id: "dcdb5e0f35f0b9d5551ac12a395f83eca45f13734974c6fe2bcd7bd2ce9920e2",
	name: "listProducts",
	filename: "src/lib/api.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).handler(listProducts_createServerFn_handler, async () => {
	return (await getSql())`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by name
    `;
});
var listAccounts_createServerFn_handler = createServerRpc({
	id: "4dc9e68c67fad1c5721face4ff3122b6ae2a8f6acafe074e58b6c6bd3f2342a0",
	name: "listAccounts",
	filename: "src/lib/api.ts"
}, (opts) => listAccounts.__executeServer(opts));
var listAccounts = createServerFn({ method: "GET" }).handler(listAccounts_createServerFn_handler, async () => {
	return (await getSql())`
      select id, trade_name, city, region from accounts order by trade_name
    `;
});
var listOrders_createServerFn_handler = createServerRpc({
	id: "eebe64c1062596ae3c8be8859b2ff945ee1efeae9ed276f6b9ef7f7021064790",
	name: "listOrders",
	filename: "src/lib/api.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "GET" }).handler(listOrders_createServerFn_handler, async () => fetchOrders());
var listStockMoves_createServerFn_handler = createServerRpc({
	id: "b56fdfa903bfd15d08d9b450ef837e25126f3ad3a32ba17c610810e8bd51490d",
	name: "listStockMoves",
	filename: "src/lib/api.ts"
}, (opts) => listStockMoves.__executeServer(opts));
var listStockMoves = createServerFn({ method: "GET" }).handler(listStockMoves_createServerFn_handler, async () => {
	return (await getSql())`
      select m.id, m.product_id, p.sku, p.name as product_name,
             m.delta_bags, m.reason, m.ref, m.created_at
      from stock_moves m
      join products p on p.id = m.product_id
      order by m.created_at desc
      limit 40
    `;
});
var listEvents_createServerFn_handler = createServerRpc({
	id: "4f183cc101c8fa2ad4ef5c671bd4c0f89a47907e4aabbaf318638584192ad23d",
	name: "listEvents",
	filename: "src/lib/api.ts"
}, (opts) => listEvents.__executeServer(opts));
var listEvents = createServerFn({ method: "GET" }).handler(listEvents_createServerFn_handler, async () => {
	return (await getSql())`
      select id, service, verb, detail, created_at
      from service_events
      order by created_at desc
      limit 24
    `;
});
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
var createProduct_createServerFn_handler = createServerRpc({
	id: "31ae685c0bb7c459f223fd7895ffd3f7dd6677beed9cf80f57b955bc207f0545",
	name: "createProduct",
	filename: "src/lib/api.ts"
}, (opts) => createProduct.__executeServer(opts));
var createProduct = createServerFn({ method: "POST" }).validator(productInput).handler(createProduct_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const product = (await sql`
      insert into products (sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)
      values (
        ${data.sku.trim().toUpperCase()},
        ${data.name.trim()},
        ${data.origin.trim()},
        ${data.process.trim()},
        ${data.roast.trim()},
        ${data.bag_grams},
        ${data.price_cents},
        ${data.stock_bags},
        ${data.notes.trim()}
      )
      returning id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
    `)[0];
	if (!product) throw new Error("Catalog write failed");
	if (data.stock_bags > 0) await sql`
        insert into stock_moves (product_id, delta_bags, reason, ref)
        values (${product.id}, ${data.stock_bags}, 'receive', ${product.sku})
      `;
	await logEvent("php", "lots.create", `Lot ${product.sku} registered`);
	await logEvent("mariadb", "write", `Inserted product ${product.sku}`);
	return product;
});
var orderInput = object({
	account_id: number().int().positive(),
	lines: array(object({
		product_id: number().int().positive(),
		bags: number().int().min(1).max(200)
	})).min(1).max(8)
});
var createOrder_createServerFn_handler = createServerRpc({
	id: "63e62798d256aad3bd79d8cff046450457bb798a7dbbacd5893c51a17295e595",
	name: "createOrder",
	filename: "src/lib/api.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).validator(orderInput).handler(createOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const account = (await sql`
      select id, trade_name, city, region from accounts where id = ${data.account_id}
    `)[0];
	if (!account) throw new Error("Unknown café");
	const merged = /* @__PURE__ */ new Map();
	for (const line of data.lines) merged.set(line.product_id, (merged.get(line.product_id) ?? 0) + line.bags);
	const products = await sql`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by id
    `;
	const byId = new Map(products.map((p) => [p.id, p]));
	const resolved = [];
	for (const [productId, bags] of merged) {
		const product = byId.get(productId);
		if (!product) throw new Error("Unknown lot");
		if (product.stock_bags < bags) throw new Error(`${product.sku} has only ${product.stock_bags} bags on hand`);
		resolved.push({
			product,
			bags
		});
	}
	const orderNo = `NL-${(await sql`select nextval('order_no_seq')::int as n`)[0]?.n ?? Date.now() % 1e4}`;
	const orderId = (await sql`
      insert into orders (order_no, account_id, status)
      values (${orderNo}, ${account.id}, 'queued')
      returning id
    `)[0]?.id;
	if (!orderId) throw new Error("Fulfillment write failed");
	for (const line of resolved) {
		await sql`
        insert into order_lines (order_id, product_id, bags, unit_price_cents)
        values (${orderId}, ${line.product.id}, ${line.bags}, ${line.product.price_cents})
      `;
		await sql`
        update products set stock_bags = stock_bags - ${line.bags}
        where id = ${line.product.id}
      `;
		await sql`
        insert into stock_moves (product_id, delta_bags, reason, ref)
        values (${line.product.id}, ${-line.bags}, 'allocate', ${orderNo})
      `;
	}
	await logEvent("java", "orders.open", `Opened ${orderNo} for ${account.trade_name}`);
	await logEvent("mariadb", "write", `Allocated stock for ${orderNo}`);
	const match = (await fetchOrders()).find((o) => o.id === orderId);
	if (!match) throw new Error("Ticket missing after open");
	return match;
});
var advanceOrder_createServerFn_handler = createServerRpc({
	id: "b5a04bd4cdde78ef5f2018683f304f74b5481d2917f47686e97188dddda8a906",
	name: "advanceOrder",
	filename: "src/lib/api.ts"
}, (opts) => advanceOrder.__executeServer(opts));
var advanceOrder = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(advanceOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const current = (await sql`
      select id, order_no, status from orders where id = ${data.id}
    `)[0];
	if (!current) throw new Error("Ticket not found");
	const next = nextStatus(current.status);
	if (!next) throw new Error("Ticket cannot advance");
	await sql`
      update orders set status = ${next}, updated_at = now() where id = ${current.id}
    `;
	await logEvent("java", "orders.advance", `${current.order_no} → ${next}`);
	const match = (await fetchOrders()).find((o) => o.id === current.id);
	if (!match) throw new Error("Ticket missing after advance");
	return match;
});
var cancelOrder_createServerFn_handler = createServerRpc({
	id: "f617390f4b0cbdae8a7b294842a1b2daf592cd1dacb6acdccc0ec841648cb246",
	name: "cancelOrder",
	filename: "src/lib/api.ts"
}, (opts) => cancelOrder.__executeServer(opts));
var cancelOrder = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(cancelOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const current = (await sql`
      select id, order_no, status from orders where id = ${data.id}
    `)[0];
	if (!current) throw new Error("Ticket not found");
	if (current.status === "shipped" || current.status === "cancelled") throw new Error("Ticket is closed");
	const lines = await sql`
      select product_id, bags from order_lines where order_id = ${current.id}
    `;
	for (const line of lines) {
		await sql`
        update products set stock_bags = stock_bags + ${line.bags}
        where id = ${line.product_id}
      `;
		await sql`
        insert into stock_moves (product_id, delta_bags, reason, ref)
        values (${line.product_id}, ${line.bags}, 'release', ${current.order_no})
      `;
	}
	await sql`
      update orders set status = 'cancelled', updated_at = now() where id = ${current.id}
    `;
	await logEvent("java", "orders.cancel", `Released ${current.order_no}`);
	await logEvent("mariadb", "write", `Restored stock for ${current.order_no}`);
	const match = (await fetchOrders()).find((o) => o.id === current.id);
	if (!match) throw new Error("Ticket missing after cancel");
	return match;
});
var receiveInput = object({
	product_id: number().int().positive(),
	bags: number().int().min(1).max(500),
	reason: string().min(2).max(40).default("receive")
});
var receiveStock_createServerFn_handler = createServerRpc({
	id: "f41657e366e4e6a078706e8ebf7aa48ccbe2621877686890f5e31e52d274fb91",
	name: "receiveStock",
	filename: "src/lib/api.ts"
}, (opts) => receiveStock.__executeServer(opts));
var receiveStock = createServerFn({ method: "POST" }).validator(receiveInput).handler(receiveStock_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const product = (await sql`
      update products
      set stock_bags = stock_bags + ${data.bags}
      where id = ${data.product_id}
      returning id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
    `)[0];
	if (!product) throw new Error("Unknown lot");
	const reason = data.reason.trim() || "receive";
	await sql`
      insert into stock_moves (product_id, delta_bags, reason, ref)
      values (${product.id}, ${data.bags}, ${reason}, ${product.sku})
    `;
	await logEvent("mariadb", "write", `Received ${data.bags} bags of ${product.sku}`);
	return product;
});
//#endregion
export { advanceOrder_createServerFn_handler, cancelOrder_createServerFn_handler, createOrder_createServerFn_handler, createProduct_createServerFn_handler, getDesk_createServerFn_handler, listAccounts_createServerFn_handler, listEvents_createServerFn_handler, listOrders_createServerFn_handler, listProducts_createServerFn_handler, listStockMoves_createServerFn_handler, receiveStock_createServerFn_handler };
