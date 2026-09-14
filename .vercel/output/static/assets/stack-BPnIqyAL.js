import{t as e,v as t,x as n}from"./jsx-runtime-D9MuGByy.js";import{f as r,s as i}from"./api-0m1wQ5IC.js";import{a,i as o,v as s}from"./format-BYOYPdws.js";import{t as c}from"./service-chip-CDhf1doB.js";var l=n(t()),u=`<?php
declare(strict_types=1);

namespace Northline\\Php;

use PDO;

/**
 * PHP catalog service — lots, origins, and price book.
 * Talks to MariaDB over PDO. The Java fulfillment service never writes lots.
 */
final class CatalogService
{
    public function __construct(private readonly PDO $db)
    {
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /** @return list<array<string, mixed>> */
    public function listLots(): array
    {
        $sql = <<<SQL
            SELECT id, sku, name, origin, process, roast,
                   bag_grams, price_cents, stock_bags, notes
            FROM products
            ORDER BY name
        SQL;
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /** @param array<string, mixed> $lot */
    public function registerLot(array $lot): int
    {
        $stmt = $this->db->prepare(<<<SQL
            INSERT INTO products
              (sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)
            VALUES
              (:sku, :name, :origin, :process, :roast, :grams, :price, :stock, :notes)
        SQL);
        $stmt->execute([
            ':sku'     => strtoupper(trim((string) $lot['sku'])),
            ':name'    => trim((string) $lot['name']),
            ':origin'  => trim((string) $lot['origin']),
            ':process' => trim((string) $lot['process']),
            ':roast'   => trim((string) $lot['roast']),
            ':grams'   => (int) $lot['bag_grams'],
            ':price'   => (int) $lot['price_cents'],
            ':stock'   => (int) $lot['stock_bags'],
            ':notes'   => trim((string) ($lot['notes'] ?? '')),
        ]);
        return (int) $this->db->lastInsertId();
    }
}
`,d=`package com.northline.fulfillment;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Java fulfillment service — wholesale tickets, allocation, roast pipeline.
 * Reads the PHP catalog; writes orders and stock through MariaDB.
 */
public final class FulfillmentService {

    public enum Status { queued, roasting, packed, shipped, cancelled }

    public record Line(int productId, int bags) {}

    private final Connection db;

    public FulfillmentService(Connection db) {
        this.db = db;
    }

    public String openTicket(int accountId, List<Line> lines) throws SQLException {
        db.setAutoCommit(false);
        try {
            String orderNo = nextOrderNo();
            try (PreparedStatement insert = db.prepareStatement(
                    "INSERT INTO orders (order_no, account_id, status) VALUES (?, ?, 'queued')",
                    PreparedStatement.RETURN_GENERATED_KEYS)) {
                insert.setString(1, orderNo);
                insert.setInt(2, accountId);
                insert.executeUpdate();
                ResultSet keys = insert.getGeneratedKeys();
                keys.next();
                int orderId = keys.getInt(1);
                for (Line line : lines) {
                    allocate(orderId, orderNo, line);
                }
            }
            db.commit();
            return orderNo;
        } catch (SQLException e) {
            db.rollback();
            throw e;
        } finally {
            db.setAutoCommit(true);
        }
    }

    public Status advance(String orderNo) throws SQLException {
        Status current = statusOf(orderNo);
        Status next = switch (current) {
            case queued -> Status.roasting;
            case roasting -> Status.packed;
            case packed -> Status.shipped;
            default -> throw new IllegalStateException(orderNo + " is closed");
        };
        try (PreparedStatement ps = db.prepareStatement(
                "UPDATE orders SET status = ?, updated_at = NOW() WHERE order_no = ?")) {
            ps.setString(1, next.name());
            ps.setString(2, orderNo);
            ps.executeUpdate();
        }
        return next;
    }

    private void allocate(int orderId, String orderNo, Line line) throws SQLException {
        try (PreparedStatement lock = db.prepareStatement(
                "SELECT stock_bags, price_cents FROM products WHERE id = ? FOR UPDATE")) {
            lock.setInt(1, line.productId());
            ResultSet rs = lock.executeQuery();
            if (!rs.next()) throw new SQLException("Unknown lot " + line.productId());
            int onHand = rs.getInt("stock_bags");
            int price = rs.getInt("price_cents");
            if (onHand < line.bags()) {
                throw new SQLException("Insufficient stock for lot " + line.productId());
            }
        }
        try (PreparedStatement linePs = db.prepareStatement(
                "INSERT INTO order_lines (order_id, product_id, bags, unit_price_cents) VALUES (?, ?, ?, (SELECT price_cents FROM products WHERE id = ?))")) {
            linePs.setInt(1, orderId);
            linePs.setInt(2, line.productId());
            linePs.setInt(3, line.bags());
            linePs.setInt(4, line.productId());
            linePs.executeUpdate();
        }
        try (PreparedStatement stock = db.prepareStatement(
                "UPDATE products SET stock_bags = stock_bags - ? WHERE id = ?")) {
            stock.setInt(1, line.bags());
            stock.setInt(2, line.productId());
            stock.executeUpdate();
        }
        try (PreparedStatement move = db.prepareStatement(
                "INSERT INTO stock_moves (product_id, delta_bags, reason, ref) VALUES (?, ?, 'allocate', ?)")) {
            move.setInt(1, line.productId());
            move.setInt(2, -line.bags());
            move.setString(3, orderNo);
            move.executeUpdate();
        }
    }

    private String nextOrderNo() throws SQLException {
        try (PreparedStatement ps = db.prepareStatement("SELECT NEXTVAL(order_no_seq) AS n")) {
            ResultSet rs = ps.executeQuery();
            rs.next();
            return "NL-" + rs.getInt("n");
        }
    }

    private Status statusOf(String orderNo) throws SQLException {
        try (PreparedStatement ps = db.prepareStatement(
                "SELECT status FROM orders WHERE order_no = ?")) {
            ps.setString(1, orderNo);
            ResultSet rs = ps.executeQuery();
            if (!rs.next()) throw new SQLException("Unknown ticket " + orderNo);
            return Status.valueOf(rs.getString("status"));
        }
    }
}
`,f=`-- Northline core — MariaDB 10.11
-- PHP catalog and Java fulfillment share this schema.

CREATE TABLE accounts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  trade_name  VARCHAR(120) NOT NULL UNIQUE,
  city        VARCHAR(80)  NOT NULL,
  region      VARCHAR(80)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sku         VARCHAR(24)  NOT NULL UNIQUE,
  name        VARCHAR(120) NOT NULL,
  origin      VARCHAR(120) NOT NULL,
  process     VARCHAR(32)  NOT NULL,
  roast       VARCHAR(24)  NOT NULL,
  bag_grams   INT          NOT NULL,
  price_cents INT          NOT NULL,
  stock_bags  INT          NOT NULL DEFAULT 0,
  notes       VARCHAR(240) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_no    VARCHAR(16) NOT NULL UNIQUE,
  account_id  INT         NOT NULL,
  status      ENUM('queued','roasting','packed','shipped','cancelled') NOT NULL,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_account FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_lines (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  order_id         INT NOT NULL,
  product_id       INT NOT NULL,
  bags             INT NOT NULL,
  unit_price_cents INT NOT NULL,
  CONSTRAINT fk_lines_order   FOREIGN KEY (order_id)   REFERENCES orders(id),
  CONSTRAINT fk_lines_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stock_moves (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT         NOT NULL,
  delta_bags  INT         NOT NULL,
  reason      VARCHAR(40) NOT NULL,
  ref         VARCHAR(32) NOT NULL DEFAULT '',
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_moves_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE service_events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  service     ENUM('php','java','mariadb') NOT NULL,
  verb        VARCHAR(40)  NOT NULL,
  detail      VARCHAR(240) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`,p=e(),m=[{id:`php`,file:`CatalogService.php`,source:u,blurb:`Lot book and price writes. PDO against MariaDB.`},{id:`java`,file:`FulfillmentService.java`,source:d,blurb:`Ticket pipeline, stock allocation, roast states.`},{id:`mariadb`,file:`schema.mariadb.sql`,source:f,blurb:`InnoDB core: lots, tickets, cellar ledger.`}];function h(){let[e,t]=(0,l.useState)(`php`),n=r({queryKey:[`events`],queryFn:()=>i()}),u=m.find(t=>t.id===e);return(0,p.jsxs)(`div`,{className:`space-y-8`,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`p`,{className:`font-mono text-micro tracking-brand text-muted uppercase`,children:`Polyglot topology`}),(0,p.jsx)(`h2`,{className:`font-display text-3xl leading-tight`,children:`The stack`}),(0,p.jsx)(`p`,{className:`mt-1 max-w-2xl text-sm text-muted`,children:`Three services, one cellar. The console in this preview is the operator desk; catalog traffic is PHP, fulfillment is Java, and every durable row lives in MariaDB.`})]}),(0,p.jsxs)(`div`,{className:`grid gap-3 md:grid-cols-3`,children:[(0,p.jsx)(g,{service:`php`,title:`Catalog`,port:`:8081`,lines:[`GET /lots`,`POST /lots`,`PDO → MariaDB`]}),(0,p.jsx)(g,{service:`java`,title:`Fulfillment`,port:`:8082`,lines:[`POST /tickets`,`POST /advance`,`JDBC → MariaDB`]}),(0,p.jsx)(g,{service:`mariadb`,title:`Core`,port:`:3306`,lines:[`products`,`orders + lines`,`stock_moves`]})]}),(0,p.jsxs)(`div`,{className:`flex flex-col gap-1 rounded-xl bg-surface p-4 font-mono text-xs text-muted shadow-[var(--shadow-border)] sm:text-sm`,children:[(0,p.jsxs)(`p`,{children:[(0,p.jsx)(`span`,{className:`text-subtle`,children:`01`}),` `,(0,p.jsx)(`span`,{className:`text-fg`,children:`operator`}),` → php://catalog · list lots`]}),(0,p.jsxs)(`p`,{children:[(0,p.jsx)(`span`,{className:`text-subtle`,children:`02`}),` `,(0,p.jsx)(`span`,{className:`text-fg`,children:`operator`}),` → java://fulfillment · open ticket`]}),(0,p.jsxs)(`p`,{children:[(0,p.jsx)(`span`,{className:`text-subtle`,children:`03`}),` `,(0,p.jsx)(`span`,{className:`text-fg`,children:`java`}),` SELECT … FOR UPDATE · allocate`]}),(0,p.jsxs)(`p`,{children:[(0,p.jsx)(`span`,{className:`text-subtle`,children:`04`}),` `,(0,p.jsx)(`span`,{className:`text-fg`,children:`mariadb`}),` COMMIT orders, lines, stock_moves`]})]}),(0,p.jsxs)(`section`,{className:`overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]`,children:[(0,p.jsx)(`div`,{className:`flex gap-1 overflow-x-auto border-b border-border px-2 pt-2`,children:m.map(n=>(0,p.jsx)(`button`,{type:`button`,onClick:()=>t(n.id),className:s(`h-11 shrink-0 rounded-t-md px-3 text-sm transition-colors duration-150`,e===n.id?`bg-raised text-fg`:`text-muted hover:text-fg`),children:n.file},n.id))}),(0,p.jsxs)(`div`,{className:`flex items-center justify-between gap-3 border-b border-border bg-raised px-4 py-2`,children:[(0,p.jsx)(c,{service:u.id}),(0,p.jsx)(`p`,{className:`truncate text-xs text-subtle`,children:u.blurb})]}),(0,p.jsx)(`pre`,{className:`max-h-96 overflow-auto p-4 font-mono text-micro leading-relaxed text-fg/90`,children:u.source})]}),(0,p.jsxs)(`section`,{children:[(0,p.jsx)(`h3`,{className:`mb-3 font-display text-xl`,children:`Recent calls`}),(0,p.jsx)(`ul`,{className:`divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]`,children:n.data?.map(e=>(0,p.jsxs)(`li`,{className:`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between`,children:[(0,p.jsxs)(`div`,{className:`min-w-0`,children:[(0,p.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,p.jsx)(c,{service:e.service}),(0,p.jsxs)(`span`,{className:`font-mono text-micro text-subtle`,children:[a(e.service),`/`,e.verb]})]}),(0,p.jsx)(`p`,{className:`text-sm text-fg`,children:e.detail})]}),(0,p.jsx)(`span`,{className:`font-mono text-micro text-subtle`,children:o(e.created_at)})]},e.id))})]})]})}function g({service:e,title:t,port:n,lines:r}){return(0,p.jsxs)(`article`,{className:`rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]`,children:[(0,p.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,p.jsx)(c,{service:e}),(0,p.jsx)(`span`,{className:`font-mono text-micro text-subtle`,children:n})]}),(0,p.jsx)(`h3`,{className:`mt-3 font-display text-2xl leading-none`,children:t}),(0,p.jsx)(`ul`,{className:`mt-3 space-y-1 font-mono text-micro text-muted`,children:r.map(e=>(0,p.jsx)(`li`,{children:e},e))})]})}export{h as component};