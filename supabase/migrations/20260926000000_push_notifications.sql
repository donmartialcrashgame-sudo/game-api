create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  device_label text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
alter table public.push_subscriptions enable row level security;

create policy "Users can view their push subscriptions"
on public.push_subscriptions for select to authenticated
using (auth.uid() = user_id);

create policy "Users can register their push subscriptions"
on public.push_subscriptions for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their push subscriptions"
on public.push_subscriptions for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can remove their push subscriptions"
on public.push_subscriptions for delete to authenticated
using (auth.uid() = user_id);