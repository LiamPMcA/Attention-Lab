-- Run in Supabase SQL Editor if game_sessions already exists without difficulty

alter table public.game_sessions
  add column if not exists difficulty smallint check (difficulty between 1 and 5);
