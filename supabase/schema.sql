-- Headless e-commerce schema for Supabase
-- Run this complete file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- Tables
-- --------------------------------------------------------------------------

-- One application profile per Supabase Auth user.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer'
    check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Public product categories.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Products remain when a category is removed; category_id becomes NULL.
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'USD',
  category_id uuid references public.categories(id) on delete set null,
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A product can occur only once per user's cart; update quantity on conflict.
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- A product can occur only once per user's favorites.
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Orders are retained if a user is removed, so this foreign key does not
-- cascade. Delete/anonymize users according to your eventual retention policy.
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'completed', 'cancelled')),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null default 'USD',
  shipping_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- price_at_purchase is an immutable snapshot of the checkout-time unit price.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(12, 2) not null check (price_at_purchase >= 0)
);

-- Simulated payment records; these are never exposed directly to customers.
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed')),
  payment_method text,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- Indexes
-- --------------------------------------------------------------------------
-- Primary keys and UNIQUE constraints already create indexes. That includes
-- products.slug and the two (user_id, product_id) composite constraints.

create index products_category_id_idx on public.products(category_id);
create index cart_items_user_id_idx on public.cart_items(user_id);
create index cart_items_product_id_idx on public.cart_items(product_id);
create index favorites_user_id_idx on public.favorites(user_id);
create index favorites_product_id_idx on public.favorites(product_id);
create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);
create index transactions_order_id_idx on public.transactions(order_id);

-- --------------------------------------------------------------------------
-- Security helper
-- --------------------------------------------------------------------------
-- SECURITY DEFINER avoids recursive RLS evaluation while profiles policies
-- themselves check whether the caller is an admin.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- --------------------------------------------------------------------------
-- Maintenance triggers
-- --------------------------------------------------------------------------

-- Keep updated_at accurate without relying on frontend code.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- Create a customer profile after every successful Auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS lets users update their own profile, so this trigger separately blocks
-- privilege escalation through changes to the role column.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change profile roles.';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
before update on public.profiles
for each row execute function public.protect_profile_role();

-- --------------------------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.transactions enable row level security;

-- Profiles: users manage their own non-role data; admins see/update all rows.
create policy "profiles_select_own" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "profiles_select_admin" on public.profiles
for select to authenticated using (public.is_admin());

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_update_admin" on public.profiles
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Categories: public reads; admin-only writes.
create policy "categories_public_read" on public.categories
for select to anon, authenticated using (true);

create policy "categories_admin_insert" on public.categories
for insert to authenticated with check (public.is_admin());

create policy "categories_admin_update" on public.categories
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "categories_admin_delete" on public.categories
for delete to authenticated using (public.is_admin());

-- Products: public reads; admin-only writes.
create policy "products_public_read" on public.products
for select to anon, authenticated using (true);

create policy "products_admin_insert" on public.products
for insert to authenticated with check (public.is_admin());

create policy "products_admin_update" on public.products
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "products_admin_delete" on public.products
for delete to authenticated using (public.is_admin());

-- Cart items: authenticated users can access only their own rows.
create policy "cart_select_own" on public.cart_items
for select to authenticated using (user_id = auth.uid());

create policy "cart_insert_own" on public.cart_items
for insert to authenticated with check (user_id = auth.uid());

create policy "cart_update_own" on public.cart_items
for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "cart_delete_own" on public.cart_items
for delete to authenticated using (user_id = auth.uid());

-- Favorites: authenticated users can access only their own rows.
create policy "favorites_select_own" on public.favorites
for select to authenticated using (user_id = auth.uid());

create policy "favorites_insert_own" on public.favorites
for insert to authenticated with check (user_id = auth.uid());

create policy "favorites_update_own" on public.favorites
for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "favorites_delete_own" on public.favorites
for delete to authenticated using (user_id = auth.uid());

-- Orders: customers read their own; admins read all and perform updates.
create policy "orders_select_own" on public.orders
for select to authenticated using (user_id = auth.uid());

create policy "orders_select_admin" on public.orders
for select to authenticated using (public.is_admin());

create policy "orders_update_admin" on public.orders
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Order items inherit ownership from their parent order.
create policy "order_items_select_own" on public.order_items
for select to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "order_items_select_admin" on public.order_items
for select to authenticated using (public.is_admin());

-- Transactions: no customer policies; admins alone can read or write them.
create policy "transactions_select_admin" on public.transactions
for select to authenticated using (public.is_admin());

create policy "transactions_insert_admin" on public.transactions
for insert to authenticated with check (public.is_admin());

create policy "transactions_update_admin" on public.transactions
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------------------
-- API privileges
-- --------------------------------------------------------------------------
-- Grants allow an operation to reach RLS; policies still decide row access.

revoke all on table public.profiles from anon;
revoke all on table public.cart_items from anon;
revoke all on table public.favorites from anon;
revoke all on table public.orders from anon;
revoke all on table public.order_items from anon;
revoke all on table public.transactions from anon;

grant select on table public.categories, public.products to anon;
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete
  on table public.categories, public.products,
  public.cart_items, public.favorites to authenticated;
grant select, update on table public.orders to authenticated;
grant select on table public.order_items to authenticated;
grant select, insert, update on table public.transactions to authenticated;

-- Orders and order_items intentionally have no client-side INSERT policy.
-- Create them atomically in trusted server code, an Edge Function, or a secure
-- database function so clients cannot forge prices or totals. Never expose the
-- Supabase service-role key in a Next.js Client Component.

-- Bootstrap the first admin from the SQL Editor after that user signs up:
-- update public.profiles set role = 'admin'
-- where id = 'YOUR-AUTH-USER-UUID';
