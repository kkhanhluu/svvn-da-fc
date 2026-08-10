-- Lineup rows read the player's name, shirt number and position from
-- public.users instead of holding their own copy.
--
-- The copies were snapshots taken when the match was saved, so editing a player
-- on /squad/<id> left every past lineup showing the old number and position.
-- A lineup entry is now always a club member (user_id), which is what the app
-- has written all along; opponents keep their free text on match_events and
-- motm_votes, where the scorer really can be somebody with no user record.
--
-- Apply after 20260810000002_users_admin_write.sql, then run
-- `npm run type:generate` to refresh database.types.ts.

-- Opponent lineups can no longer be represented. The app never wrote them, so
-- stop rather than delete rows nobody expected to lose.
do $$
declare
  opponent_rows bigint;
begin
  select count(*) into opponent_rows
  from public.match_lineups
  where user_id is null;

  if opponent_rows > 0 then
    raise exception
      'match_lineups still has % row(s) without user_id; move or delete them before running this migration',
      opponent_rows;
  end if;
end $$;

alter table public.match_lineups
  drop column if exists player_name,
  drop column if exists shirt_number,
  drop column if exists position;

alter table public.match_lineups
  alter column user_id set not null;

-- `on delete set null` cannot hold once user_id is mandatory: a lineup entry
-- only means something alongside the member it belongs to.
alter table public.match_lineups
  drop constraint if exists match_lineups_user_id_fkey;

alter table public.match_lineups
  add constraint match_lineups_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;
