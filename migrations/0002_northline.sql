create table if not exists accounts (
  id          serial primary key,
  trade_name  text not null unique,
  city        text not null,
  region      text not null
);

create table if not exists products (
  id          serial primary key,
  sku         text not null unique,
  name        text not null,
  origin      text not null,
  process     text not null,
  roast       text not null,
  bag_grams   integer not null,
  price_cents integer not null,
  stock_bags  integer not null default 0,
  notes       text not null default ''
);

create table if not exists orders (
  id          serial primary key,
  order_no    text not null unique,
  account_id  integer not null references accounts(id),
  status      text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists order_lines (
  id               serial primary key,
  order_id         integer not null references orders(id),
  product_id       integer not null references products(id),
  bags             integer not null,
  unit_price_cents integer not null
);

create table if not exists stock_moves (
  id          serial primary key,
  product_id  integer not null references products(id),
  delta_bags  integer not null,
  reason      text not null,
  ref         text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists service_events (
  id          serial primary key,
  service     text not null,
  verb        text not null,
  detail      text not null,
  created_at  timestamptz not null default now()
);

create sequence if not exists order_no_seq start with 1048;

create index if not exists orders_status_idx on orders (status);
create index if not exists stock_moves_created_idx on stock_moves (created_at desc);
create index if not exists service_events_created_idx on service_events (created_at desc);

insert into accounts (trade_name, city, region)
select * from (values
  ('Harbor Light', 'Portland', 'Pacific Northwest'),
  ('Glasshouse', 'Seattle', 'Pacific Northwest'),
  ('Millwork', 'Minneapolis', 'Upper Midwest'),
  ('Copper Still', 'Denver', 'Mountain'),
  ('Tide & Bean', 'Boston', 'New England'),
  ('Lowland Roast', 'Austin', 'South')
) as v(trade_name, city, region)
where not exists (select 1 from accounts);

insert into products (sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)
select * from (values
  ('NL-YIR-01', 'Yirgacheffe Washed', 'Yirgacheffe, Ethiopia', 'Washed', 'Light', 340, 2450, 42, 'Jasmine, bergamot, lemon zest.'),
  ('NL-GUI-02', 'Guji Natural', 'Guji, Ethiopia', 'Natural', 'Light', 340, 2380, 18, 'Blueberry, cocoa, floral honey.'),
  ('NL-NYR-03', 'Nyeri AA', 'Nyeri, Kenya', 'Washed', 'Medium', 340, 2620, 9, 'Blackcurrant, grapefruit, cane sugar.'),
  ('NL-HUI-04', 'Huila Supremo', 'Huila, Colombia', 'Washed', 'Medium', 340, 2140, 54, 'Caramel, red apple, walnut.'),
  ('NL-HUE-05', 'Huehuetenango', 'Huehuetenango, Guatemala', 'Washed', 'Medium', 340, 2210, 31, 'Cocoa, orange, brown sugar.'),
  ('NL-MOG-06', 'Mogiana', 'Mogiana, Brazil', 'Natural', 'Dark', 340, 1680, 76, 'Hazelnut, dark chocolate, low acid.'),
  ('NL-SID-07', 'Sidama', 'Sidama, Ethiopia', 'Honey', 'Light', 340, 2290, 6, 'Stone fruit, tea rose, honey.'),
  ('NL-KON-08', 'Kona Extra Fancy', 'Kona, Hawaii', 'Washed', 'Medium', 227, 4200, 4, 'Brown sugar, macadamia, citrus.')
) as v(sku, name, origin, process, roast, bag_grams, price_cents, stock_bags, notes)
where not exists (select 1 from products);

insert into orders (order_no, account_id, status, created_at, updated_at)
select * from (values
  ('NL-1040', (select id from accounts where trade_name = 'Harbor Light'), 'shipped', now() - interval '6 days', now() - interval '5 days'),
  ('NL-1041', (select id from accounts where trade_name = 'Glasshouse'), 'shipped', now() - interval '5 days', now() - interval '4 days'),
  ('NL-1042', (select id from accounts where trade_name = 'Millwork'), 'shipped', now() - interval '4 days', now() - interval '3 days'),
  ('NL-1043', (select id from accounts where trade_name = 'Copper Still'), 'packed', now() - interval '2 days', now() - interval '8 hours'),
  ('NL-1044', (select id from accounts where trade_name = 'Tide & Bean'), 'roasting', now() - interval '1 day', now() - interval '3 hours'),
  ('NL-1045', (select id from accounts where trade_name = 'Lowland Roast'), 'queued', now() - interval '6 hours', now() - interval '6 hours'),
  ('NL-1046', (select id from accounts where trade_name = 'Harbor Light'), 'queued', now() - interval '2 hours', now() - interval '2 hours'),
  ('NL-1047', (select id from accounts where trade_name = 'Glasshouse'), 'cancelled', now() - interval '3 days', now() - interval '3 days')
) as v(order_no, account_id, status, created_at, updated_at)
where not exists (select 1 from orders);

insert into order_lines (order_id, product_id, bags, unit_price_cents)
select o.id, p.id, v.bags, p.price_cents
from (values
  ('NL-1040', 'NL-YIR-01', 12),
  ('NL-1040', 'NL-HUI-04', 8),
  ('NL-1041', 'NL-NYR-03', 6),
  ('NL-1041', 'NL-MOG-06', 20),
  ('NL-1042', 'NL-HUE-05', 10),
  ('NL-1042', 'NL-GUI-02', 4),
  ('NL-1043', 'NL-SID-07', 8),
  ('NL-1043', 'NL-YIR-01', 6),
  ('NL-1044', 'NL-KON-08', 3),
  ('NL-1044', 'NL-HUI-04', 12),
  ('NL-1045', 'NL-MOG-06', 24),
  ('NL-1046', 'NL-NYR-03', 5),
  ('NL-1046', 'NL-GUI-02', 5),
  ('NL-1047', 'NL-KON-08', 2)
) as v(order_no, sku, bags)
join orders o on o.order_no = v.order_no
join products p on p.sku = v.sku
where not exists (select 1 from order_lines);

insert into stock_moves (product_id, delta_bags, reason, ref, created_at)
select p.id, v.delta_bags, v.reason, v.ref, now() - v.ago
from (values
  ('NL-YIR-01', 60, 'receive', 'ROAST-331', interval '8 days'),
  ('NL-GUI-02', 40, 'receive', 'ROAST-331', interval '8 days'),
  ('NL-NYR-03', 24, 'receive', 'ROAST-332', interval '7 days'),
  ('NL-HUI-04', 80, 'receive', 'ROAST-332', interval '7 days'),
  ('NL-HUE-05', 48, 'receive', 'ROAST-333', interval '6 days'),
  ('NL-MOG-06', 120, 'receive', 'ROAST-333', interval '6 days'),
  ('NL-SID-07', 20, 'receive', 'ROAST-334', interval '5 days'),
  ('NL-KON-08', 10, 'receive', 'ROAST-334', interval '5 days'),
  ('NL-YIR-01', -12, 'fulfill', 'NL-1040', interval '5 days'),
  ('NL-HUI-04', -8, 'fulfill', 'NL-1040', interval '5 days'),
  ('NL-NYR-03', -6, 'fulfill', 'NL-1041', interval '4 days'),
  ('NL-MOG-06', -20, 'fulfill', 'NL-1041', interval '4 days'),
  ('NL-HUE-05', -10, 'fulfill', 'NL-1042', interval '3 days'),
  ('NL-GUI-02', -4, 'fulfill', 'NL-1042', interval '3 days'),
  ('NL-SID-07', -8, 'fulfill', 'NL-1043', interval '2 days'),
  ('NL-YIR-01', -6, 'fulfill', 'NL-1043', interval '2 days'),
  ('NL-KON-08', -3, 'fulfill', 'NL-1044', interval '1 day'),
  ('NL-HUI-04', -12, 'fulfill', 'NL-1044', interval '1 day'),
  ('NL-MOG-06', -24, 'allocate', 'NL-1045', interval '6 hours'),
  ('NL-NYR-03', -5, 'allocate', 'NL-1046', interval '2 hours'),
  ('NL-GUI-02', -5, 'allocate', 'NL-1046', interval '2 hours')
) as v(sku, delta_bags, reason, ref, ago)
join products p on p.sku = v.sku
where not exists (select 1 from stock_moves);

insert into service_events (service, verb, detail, created_at)
select * from (values
  ('php', 'list.lots', 'Catalog served 8 active lots', now() - interval '10 minutes'),
  ('java', 'orders.advance', 'NL-1044 roasting started', now() - interval '3 hours'),
  ('mariadb', 'write', 'Committed stock move ROAST-334', now() - interval '5 days'),
  ('java', 'orders.open', 'Opened NL-1046 for Harbor Light', now() - interval '2 hours'),
  ('php', 'lots.create', 'Lot NL-KON-08 registered', now() - interval '12 days'),
  ('mariadb', 'read', 'Desk snapshot assembled', now() - interval '4 minutes')
) as v(service, verb, detail, created_at)
where not exists (select 1 from service_events);
