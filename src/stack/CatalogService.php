<?php
declare(strict_types=1);

namespace Northline\Php;

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
