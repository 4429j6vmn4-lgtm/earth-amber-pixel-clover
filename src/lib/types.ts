export type ServiceName = "php" | "java" | "mariadb";

export type OrderStatus =
  | "queued"
  | "roasting"
  | "packed"
  | "shipped"
  | "cancelled";

export type Product = {
  id: number;
  sku: string;
  name: string;
  origin: string;
  process: string;
  roast: string;
  bag_grams: number;
  price_cents: number;
  stock_bags: number;
  notes: string;
};

export type Account = {
  id: number;
  trade_name: string;
  city: string;
  region: string;
};

export type OrderLine = {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  bags: number;
  unit_price_cents: number;
};

export type Order = {
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
  lines: OrderLine[];
};

export type StockMove = {
  id: number;
  product_id: number;
  sku: string;
  product_name: string;
  delta_bags: number;
  reason: string;
  ref: string;
  created_at: string;
};

export type ServiceEvent = {
  id: number;
  service: ServiceName;
  verb: string;
  detail: string;
  created_at: string;
};

export type DeskSnapshot = {
  open_orders: number;
  bags_on_hand: number;
  low_stock: number;
  shipped_week: number;
  products: Product[];
  orders: Order[];
  events: ServiceEvent[];
  series: { day: string; bags: number }[];
};

export type NewProductInput = {
  sku: string;
  name: string;
  origin: string;
  process: string;
  roast: string;
  bag_grams: number;
  price_cents: number;
  stock_bags: number;
  notes: string;
};

export type NewOrderInput = {
  account_id: number;
  lines: { product_id: number; bags: number }[];
};

export type ReceiveInput = {
  product_id: number;
  bags: number;
  reason: string;
};
