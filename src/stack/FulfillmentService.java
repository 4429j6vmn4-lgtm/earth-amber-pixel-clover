package com.northline.fulfillment;

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
