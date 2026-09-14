import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import type {
  Account,
  DeskSnapshot,
  Order,
  OrderLine,
  OrderStatus,
  Product,
  ServiceEvent,
  ServiceName,
  StockMove,
} from "@/lib/types";
import { nextStatus } from "@/lib/format";

type LineRow = {
  order_id: number;
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  bags: number;
  unit_price_cents: number;
};

type OrderRow = {
  id: number;
  order_no: string;
  account_id: number;
  trade_name: string;
  city: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  bag_count: number;
  total_cents: number;
};

async function logEvent(
  service: ServiceName,
  verb: string,
  detail: string,
): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into service_events (service, verb, detail)
    values (${service}, ${verb}, ${detail})
  `;
}

async function attachLines(orders: OrderRow[]): Promise<Order[]> {
  if (orders.length === 0) return [];
  const sql = await getSql();
  const ids = orders.map((o) => o.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const lines = await sql.query<LineRow>(
    `select ol.order_id, ol.id, ol.product_id, p.sku, p.name as product_name,
            ol.bags, ol.unit_price_cents
     from order_lines ol
     join products p on p.id = ol.product_id
     where ol.order_id in (${placeholders})
     order by ol.id`,
    ids,
  );
  const byOrder = new Map<number, OrderLine[]>();
  for (const line of lines) {
    const list = byOrder.get(line.order_id) ?? [];
    list.push({
      id: line.id,
      product_id: line.product_id,
      sku: line.sku,
      product_name: line.product_name,
      bags: line.bags,
      unit_price_cents: line.unit_price_cents,
    });
    byOrder.set(line.order_id, list);
  }
  return orders.map((o) => ({
    ...o,
    bag_count: Number(o.bag_count),
    total_cents: Number(o.total_cents),
    lines: byOrder.get(o.id) ?? [],
  }));
}

async function fetchOrders(limit?: number): Promise<Order[]> {
  const sql = await getSql();
  const rows = limit
    ? await sql<OrderRow>`
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
      `
    : await sql<OrderRow>`
        select o.id, o.order_no, o.account_id, a.trade_name, a.city, o.status,
               o.created_at, o.updated_at,
               coalesce(sum(ol.bags), 0)::int as bag_count,
               coalesce(sum(ol.bags * ol.unit_price_cents), 0)::int as total_cents
        from orders o
        join accounts a on a.id = o.account_id
        left join order_lines ol on ol.order_id = o.id
        group by o.id, a.trade_name, a.city
        order by o.created_at desc
      `;
  return attachLines(rows);
}

export const getDesk = createServerFn({ method: "GET" }).handler(
  async (): Promise<DeskSnapshot> => {
    const sql = await getSql();
    const [open] = await sql<{ n: number }>`
      select count(*)::int as n from orders
      where status in ('queued', 'roasting', 'packed')
    `;
    const [stock] = await sql<{ n: number }>`
      select coalesce(sum(stock_bags), 0)::int as n from products
    `;
    const [low] = await sql<{ n: number }>`
      select count(*)::int as n from products where stock_bags < 12
    `;
    const [shipped] = await sql<{ n: number }>`
      select coalesce(sum(ol.bags), 0)::int as n
      from orders o
      join order_lines ol on ol.order_id = o.id
      where o.status = 'shipped'
        and o.updated_at >= now() - interval '7 days'
    `;
    const products = await sql<Product>`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by stock_bags asc, name
    `;
    const events = await sql<ServiceEvent>`
      select id, service, verb, detail, created_at
      from service_events
      order by created_at desc
      limit 8
    `;
    const series = await sql<{ day: string; bags: number }>`
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
      series,
    };
  },
);

export const listProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const sql = await getSql();
    return sql<Product>`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by name
    `;
  },
);

export const listAccounts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Account[]> => {
    const sql = await getSql();
    return sql<Account>`
      select id, trade_name, city, region from accounts order by trade_name
    `;
  },
);

export const listOrders = createServerFn({ method: "GET" }).handler(
  async (): Promise<Order[]> => fetchOrders(),
);

export const listStockMoves = createServerFn({ method: "GET" }).handler(
  async (): Promise<StockMove[]> => {
    const sql = await getSql();
    return sql<StockMove>`
      select m.id, m.product_id, p.sku, p.name as product_name,
             m.delta_bags, m.reason, m.ref, m.created_at
      from stock_moves m
      join products p on p.id = m.product_id
      order by m.created_at desc
      limit 40
    `;
  },
);

export const listEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<ServiceEvent[]> => {
    const sql = await getSql();
    return sql<ServiceEvent>`
      select id, service, verb, detail, created_at
      from service_events
      order by created_at desc
      limit 24
    `;
  },
);

const productInput = z.object({
  sku: z.string().min(2).max(24),
  name: z.string().min(2).max(80),
  origin: z.string().min(2).max(80),
  process: z.string().min(2).max(32),
  roast: z.string().min(2).max(24),
  bag_grams: z.number().int().min(100).max(5000),
  price_cents: z.number().int().min(100).max(20000),
  stock_bags: z.number().int().min(0).max(500),
  notes: z.string().max(240).default(""),
});

export const createProduct = createServerFn({ method: "POST" })
  .validator(productInput)
  .handler(async ({ data }): Promise<Product> => {
    const sql = await getSql();
    const rows = await sql<Product>`
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
    `;
    const product = rows[0];
    if (!product) throw new Error("Catalog write failed");
    if (data.stock_bags > 0) {
      await sql`
        insert into stock_moves (product_id, delta_bags, reason, ref)
        values (${product.id}, ${data.stock_bags}, 'receive', ${product.sku})
      `;
    }
    await logEvent("php", "lots.create", `Lot ${product.sku} registered`);
    await logEvent("mariadb", "write", `Inserted product ${product.sku}`);
    return product;
  });

const orderInput = z.object({
  account_id: z.number().int().positive(),
  lines: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        bags: z.number().int().min(1).max(200),
      }),
    )
    .min(1)
    .max(8),
});

export const createOrder = createServerFn({ method: "POST" })
  .validator(orderInput)
  .handler(async ({ data }): Promise<Order> => {
    const sql = await getSql();
    const accounts = await sql<Account>`
      select id, trade_name, city, region from accounts where id = ${data.account_id}
    `;
    const account = accounts[0];
    if (!account) throw new Error("Unknown café");

    const merged = new Map<number, number>();
    for (const line of data.lines) {
      merged.set(line.product_id, (merged.get(line.product_id) ?? 0) + line.bags);
    }

    const products = await sql<Product>`
      select id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
      from products
      order by id
    `;
    const byId = new Map(products.map((p) => [p.id, p]));
    const resolved: { product: Product; bags: number }[] = [];
    for (const [productId, bags] of merged) {
      const product = byId.get(productId);
      if (!product) throw new Error("Unknown lot");
      if (product.stock_bags < bags) {
        throw new Error(
          `${product.sku} has only ${product.stock_bags} bags on hand`,
        );
      }
      resolved.push({ product, bags });
    }

    const nos = await sql<{ n: number }>`select nextval('order_no_seq')::int as n`;
    const orderNo = `NL-${nos[0]?.n ?? Date.now() % 10000}`;

    const inserted = await sql<{ id: number }>`
      insert into orders (order_no, account_id, status)
      values (${orderNo}, ${account.id}, 'queued')
      returning id
    `;
    const orderId = inserted[0]?.id;
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

    await logEvent(
      "java",
      "orders.open",
      `Opened ${orderNo} for ${account.trade_name}`,
    );
    await logEvent("mariadb", "write", `Allocated stock for ${orderNo}`);

    const all = await fetchOrders();
    const match = all.find((o) => o.id === orderId);
    if (!match) throw new Error("Ticket missing after open");
    return match;
  });

export const advanceOrder = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }): Promise<Order> => {
    const sql = await getSql();
    const rows = await sql<{ id: number; order_no: string; status: OrderStatus }>`
      select id, order_no, status from orders where id = ${data.id}
    `;
    const current = rows[0];
    if (!current) throw new Error("Ticket not found");
    const next = nextStatus(current.status);
    if (!next) throw new Error("Ticket cannot advance");
    await sql`
      update orders set status = ${next}, updated_at = now() where id = ${current.id}
    `;
    await logEvent("java", "orders.advance", `${current.order_no} → ${next}`);
    const all = await fetchOrders();
    const match = all.find((o) => o.id === current.id);
    if (!match) throw new Error("Ticket missing after advance");
    return match;
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }): Promise<Order> => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      order_no: string;
      status: OrderStatus;
    }>`
      select id, order_no, status from orders where id = ${data.id}
    `;
    const current = rows[0];
    if (!current) throw new Error("Ticket not found");
    if (current.status === "shipped" || current.status === "cancelled") {
      throw new Error("Ticket is closed");
    }
    const lines = await sql<{ product_id: number; bags: number }>`
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
    const all = await fetchOrders();
    const match = all.find((o) => o.id === current.id);
    if (!match) throw new Error("Ticket missing after cancel");
    return match;
  });

const receiveInput = z.object({
  product_id: z.number().int().positive(),
  bags: z.number().int().min(1).max(500),
  reason: z.string().min(2).max(40).default("receive"),
});

export const receiveStock = createServerFn({ method: "POST" })
  .validator(receiveInput)
  .handler(async ({ data }): Promise<Product> => {
    const sql = await getSql();
    const rows = await sql<Product>`
      update products
      set stock_bags = stock_bags + ${data.bags}
      where id = ${data.product_id}
      returning id, sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes
    `;
    const product = rows[0];
    if (!product) throw new Error("Unknown lot");
    const reason = data.reason.trim() || "receive";
    await sql`
      insert into stock_moves (product_id, delta_bags, reason, ref)
      values (${product.id}, ${data.bags}, ${reason}, ${product.sku})
    `;
    await logEvent(
      "mariadb",
      "write",
      `Received ${data.bags} bags of ${product.sku}`,
    );
    return product;
  });
