/* database_setup.sql */

-- Create the interviews table
create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  role text not null,
  difficulty text not null,
  type text not null,
  question_count int not null,
  overall_score int,
  avg_wpm int,
  total_fillers int,
  total_pauses int,
  primary_hesitation text,
  avg_relevance int,
  recorded_answers jsonb
);

-- Enable Row Level Security
alter table public.interviews enable row level security;

-- Policy: Users can insert their own interviews
create policy "Users can insert their own interviews"
  on public.interviews
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can select their own interviews
create policy "Users can view their own interviews"
  on public.interviews
  for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own interviews (if needed)
create policy "Users can update their own interviews"
  on public.interviews
  for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own interviews
create policy "Users can delete their own interviews"
  on public.interviews
  for delete
  using (auth.uid() = user_id);
