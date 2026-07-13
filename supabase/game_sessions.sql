-- Attention Lab — Phase 2: game session scores
-- Run once in Supabase → SQL Editor → New query → Run

create table if not exists public.game_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  game_id text not null check (game_id in ('capture', 'recover', 'switch')),
  played_at bigint not null,
  reaction_time integer not null default 0,
  accuracy double precision not null default 0,
  trials integer not null default 0,
  baseline_rt integer,
  recovery_rt integer,
  repeat_rt integer,
  switch_rt integer,
  difficulty smallint check (difficulty between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_user_game_played_idx
  on public.game_sessions (user_id, game_id, played_at desc);

alter table public.game_sessions enable row level security;

create policy "Users read own sessions"
  on public.game_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.game_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);
