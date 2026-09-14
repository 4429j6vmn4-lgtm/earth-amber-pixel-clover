import { o as __toESM } from "../_runtime.mjs";
import { a as relative, o as serviceHost } from "./format-DQ6r26t1.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ServiceChip } from "./service-chip-YbKVt54M.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as listEvents } from "./api-3txm1eeY.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stack-BmWa4tR3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var files = [
	{
		id: "php",
		file: "CatalogService.php",
		source: "<?php\ndeclare(strict_types=1);\n\nnamespace Northline\\Php;\n\nuse PDO;\n\n/**\n * PHP catalog service — lots, origins, and price book.\n * Talks to MariaDB over PDO. The Java fulfillment service never writes lots.\n */\nfinal class CatalogService\n{\n    public function __construct(private readonly PDO $db)\n    {\n        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    }\n\n    /** @return list<array<string, mixed>> */\n    public function listLots(): array\n    {\n        $sql = <<<SQL\n            SELECT id, sku, name, origin, process, roast,\n                   bag_grams, price_cents, stock_bags, notes\n            FROM products\n            ORDER BY name\n        SQL;\n        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);\n    }\n\n    /** @param array<string, mixed> $lot */\n    public function registerLot(array $lot): int\n    {\n        $stmt = $this->db->prepare(<<<SQL\n            INSERT INTO products\n              (sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)\n            VALUES\n              (:sku, :name, :origin, :process, :roast, :grams, :price, :stock, :notes)\n        SQL);\n        $stmt->execute([\n            ':sku'     => strtoupper(trim((string) $lot['sku'])),\n            ':name'    => trim((string) $lot['name']),\n            ':origin'  => trim((string) $lot['origin']),\n            ':process' => trim((string) $lot['process']),\n            ':roast'   => trim((string) $lot['roast']),\n            ':grams'   => (int) $lot['bag_grams'],\n            ':price'   => (int) $lot['price_cents'],\n            ':stock'   => (int) $lot['stock_bags'],\n            ':notes'   => trim((string) ($lot['notes'] ?? '')),\n        ]);\n        return (int) $this->db->lastInsertId();\n    }\n}\n",
		blurb: "Lot book and price writes. PDO against MariaDB."
	},
	{
		id: "java",
		file: "FulfillmentService.java",
		source: "package com.northline.fulfillment;\n\nimport java.sql.Connection;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.SQLException;\nimport java.util.List;\n\n/**\n * Java fulfillment service — wholesale tickets, allocation, roast pipeline.\n * Reads the PHP catalog; writes orders and stock through MariaDB.\n */\npublic final class FulfillmentService {\n\n    public enum Status { queued, roasting, packed, shipped, cancelled }\n\n    public record Line(int productId, int bags) {}\n\n    private final Connection db;\n\n    public FulfillmentService(Connection db) {\n        this.db = db;\n    }\n\n    public String openTicket(int accountId, List<Line> lines) throws SQLException {\n        db.setAutoCommit(false);\n        try {\n            String orderNo = nextOrderNo();\n            try (PreparedStatement insert = db.prepareStatement(\n                    \"INSERT INTO orders (order_no, account_id, status) VALUES (?, ?, 'queued')\",\n                    PreparedStatement.RETURN_GENERATED_KEYS)) {\n                insert.setString(1, orderNo);\n                insert.setInt(2, accountId);\n                insert.executeUpdate();\n                ResultSet keys = insert.getGeneratedKeys();\n                keys.next();\n                int orderId = keys.getInt(1);\n                for (Line line : lines) {\n                    allocate(orderId, orderNo, line);\n                }\n            }\n            db.commit();\n            return orderNo;\n        } catch (SQLException e) {\n            db.rollback();\n            throw e;\n        } finally {\n            db.setAutoCommit(true);\n        }\n    }\n\n    public Status advance(String orderNo) throws SQLException {\n        Status current = statusOf(orderNo);\n        Status next = switch (current) {\n            case queued -> Status.roasting;\n            case roasting -> Status.packed;\n            case packed -> Status.shipped;\n            default -> throw new IllegalStateException(orderNo + \" is closed\");\n        };\n        try (PreparedStatement ps = db.prepareStatement(\n                \"UPDATE orders SET status = ?, updated_at = NOW() WHERE order_no = ?\")) {\n            ps.setString(1, next.name());\n            ps.setString(2, orderNo);\n            ps.executeUpdate();\n        }\n        return next;\n    }\n\n    private void allocate(int orderId, String orderNo, Line line) throws SQLException {\n        try (PreparedStatement lock = db.prepareStatement(\n                \"SELECT stock_bags, price_cents FROM products WHERE id = ? FOR UPDATE\")) {\n            lock.setInt(1, line.productId());\n            ResultSet rs = lock.executeQuery();\n            if (!rs.next()) throw new SQLException(\"Unknown lot \" + line.productId());\n            int onHand = rs.getInt(\"stock_bags\");\n            int price = rs.getInt(\"price_cents\");\n            if (onHand < line.bags()) {\n                throw new SQLException(\"Insufficient stock for lot \" + line.productId());\n            }\n        }\n        try (PreparedStatement linePs = db.prepareStatement(\n                \"INSERT INTO order_lines (order_id, product_id, bags, unit_price_cents) VALUES (?, ?, ?, (SELECT price_cents FROM products WHERE id = ?))\")) {\n            linePs.setInt(1, orderId);\n            linePs.setInt(2, line.productId());\n            linePs.setInt(3, line.bags());\n            linePs.setInt(4, line.productId());\n            linePs.executeUpdate();\n        }\n        try (PreparedStatement stock = db.prepareStatement(\n                \"UPDATE products SET stock_bags = stock_bags - ? WHERE id = ?\")) {\n            stock.setInt(1, line.bags());\n            stock.setInt(2, line.productId());\n            stock.executeUpdate();\n        }\n        try (PreparedStatement move = db.prepareStatement(\n                \"INSERT INTO stock_moves (product_id, delta_bags, reason, ref) VALUES (?, ?, 'allocate', ?)\")) {\n            move.setInt(1, line.productId());\n            move.setInt(2, -line.bags());\n            move.setString(3, orderNo);\n            move.executeUpdate();\n        }\n    }\n\n    private String nextOrderNo() throws SQLException {\n        try (PreparedStatement ps = db.prepareStatement(\"SELECT NEXTVAL(order_no_seq) AS n\")) {\n            ResultSet rs = ps.executeQuery();\n            rs.next();\n            return \"NL-\" + rs.getInt(\"n\");\n        }\n    }\n\n    private Status statusOf(String orderNo) throws SQLException {\n        try (PreparedStatement ps = db.prepareStatement(\n                \"SELECT status FROM orders WHERE order_no = ?\")) {\n            ps.setString(1, orderNo);\n            ResultSet rs = ps.executeQuery();\n            if (!rs.next()) throw new SQLException(\"Unknown ticket \" + orderNo);\n            return Status.valueOf(rs.getString(\"status\"));\n        }\n    }\n}\n",
		blurb: "Ticket pipeline, stock allocation, roast states."
	},
	{
		id: "mariadb",
		file: "schema.mariadb.sql",
		source: "-- Northline core — MariaDB 10.11\n-- PHP catalog and Java fulfillment share this schema.\n\nCREATE TABLE accounts (\n  id          INT AUTO_INCREMENT PRIMARY KEY,\n  trade_name  VARCHAR(120) NOT NULL UNIQUE,\n  city        VARCHAR(80)  NOT NULL,\n  region      VARCHAR(80)  NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE products (\n  id          INT AUTO_INCREMENT PRIMARY KEY,\n  sku         VARCHAR(24)  NOT NULL UNIQUE,\n  name        VARCHAR(120) NOT NULL,\n  origin      VARCHAR(120) NOT NULL,\n  process     VARCHAR(32)  NOT NULL,\n  roast       VARCHAR(24)  NOT NULL,\n  bag_grams   INT          NOT NULL,\n  price_cents INT          NOT NULL,\n  stock_bags  INT          NOT NULL DEFAULT 0,\n  notes       VARCHAR(240) NOT NULL DEFAULT ''\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE orders (\n  id          INT AUTO_INCREMENT PRIMARY KEY,\n  order_no    VARCHAR(16) NOT NULL UNIQUE,\n  account_id  INT         NOT NULL,\n  status      ENUM('queued','roasting','packed','shipped','cancelled') NOT NULL,\n  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  CONSTRAINT fk_orders_account FOREIGN KEY (account_id) REFERENCES accounts(id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE order_lines (\n  id               INT AUTO_INCREMENT PRIMARY KEY,\n  order_id         INT NOT NULL,\n  product_id       INT NOT NULL,\n  bags             INT NOT NULL,\n  unit_price_cents INT NOT NULL,\n  CONSTRAINT fk_lines_order   FOREIGN KEY (order_id)   REFERENCES orders(id),\n  CONSTRAINT fk_lines_product FOREIGN KEY (product_id) REFERENCES products(id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE stock_moves (\n  id          INT AUTO_INCREMENT PRIMARY KEY,\n  product_id  INT         NOT NULL,\n  delta_bags  INT         NOT NULL,\n  reason      VARCHAR(40) NOT NULL,\n  ref         VARCHAR(32) NOT NULL DEFAULT '',\n  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  CONSTRAINT fk_moves_product FOREIGN KEY (product_id) REFERENCES products(id)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\nCREATE TABLE service_events (\n  id          INT AUTO_INCREMENT PRIMARY KEY,\n  service     ENUM('php','java','mariadb') NOT NULL,\n  verb        VARCHAR(40)  NOT NULL,\n  detail      VARCHAR(240) NOT NULL,\n  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n",
		blurb: "InnoDB core: lots, tickets, cellar ledger."
	}
];
function StackPage() {
	const [active, setActive] = (0, import_react.useState)("php");
	const events = useQuery({
		queryKey: ["events"],
		queryFn: () => listEvents()
	});
	const file = files.find((f) => f.id === active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-micro tracking-brand text-muted uppercase",
					children: "Polyglot topology"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl leading-tight",
					children: "The stack"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Three services, one cellar. The console in this preview is the operator desk; catalog traffic is PHP, fulfillment is Java, and every durable row lives in MariaDB."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
						service: "php",
						title: "Catalog",
						port: ":8081",
						lines: [
							"GET /lots",
							"POST /lots",
							"PDO → MariaDB"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
						service: "java",
						title: "Fulfillment",
						port: ":8082",
						lines: [
							"POST /tickets",
							"POST /advance",
							"JDBC → MariaDB"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
						service: "mariadb",
						title: "Core",
						port: ":3306",
						lines: [
							"products",
							"orders + lines",
							"stock_moves"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 rounded-xl bg-surface p-4 font-mono text-xs text-muted shadow-[var(--shadow-border)] sm:text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "01"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "operator"
						}),
						" → php://catalog · list lots"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "02"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "operator"
						}),
						" → java://fulfillment · open ticket"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "03"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "java"
						}),
						" SELECT … FOR UPDATE · allocate"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "04"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "mariadb"
						}),
						" COMMIT orders, lines, stock_moves"
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 overflow-x-auto border-b border-border px-2 pt-2",
						children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActive(f.id),
							className: cn("h-11 shrink-0 rounded-t-md px-3 text-sm transition-colors duration-150", active === f.id ? "bg-raised text-fg" : "text-muted hover:text-fg"),
							children: f.file
						}, f.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b border-border bg-raised px-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: file.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-subtle",
							children: file.blurb
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-96 overflow-auto p-4 font-mono text-micro leading-relaxed text-fg/90",
						children: file.source
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-display text-xl",
				children: "Recent calls"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: events.data?.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service: event.service }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-micro text-subtle",
								children: [
									serviceHost(event.service),
									"/",
									event.verb
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: event.detail
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-micro text-subtle",
						children: relative(event.created_at)
					})]
				}, event.id))
			})] })
		]
	});
}
function Node({ service, title, port, lines }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceChip, { service }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-micro text-subtle",
					children: port
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-2xl leading-none",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 font-mono text-micro text-muted",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
			})
		]
	});
}
//#endregion
export { StackPage as component };
