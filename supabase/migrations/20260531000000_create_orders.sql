create table orders (
  id uuid default gen_random_uuid() primary key,
  table_number integer not null,
  items jsonb not null default '[]'::jsonb,
  status text default 'pending' check (status in ('pending', 'done')),
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Allow all" on orders
  for all using (true) with check (true);

alter publication supabase_realtime add table orders;
