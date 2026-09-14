-- Northline core — MariaDB 10.11
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
