-- Player avatars.
--
-- Photos live in a public `avatars` bucket at `<user_id>/avatar` — one object
-- per player, replaced in place, so the folder name is what the write policies
-- authorise against. Reads are public; the app appends a ?v=<timestamp> cache
-- buster to the stored URL whenever the object is replaced.
--
-- Apply after 20260810000000_competitions.sql, then run `npm run type:generate`.

alter table public.users
  add column if not exists avatar_url text;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Members manage their own folder; admins manage everybody's.
drop policy if exists avatars_read on storage.objects;
create policy avatars_read on storage.objects
  for select
  using (bucket_id = 'avatars');

drop policy if exists avatars_write on storage.objects;
create policy avatars_write on storage.objects
  for all to authenticated
  using (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  )
  with check (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ---------------------------------------------------------------------------
-- Reporting functions gain avatar_url.
--
-- A set returning function cannot change its result columns through
-- `create or replace`, so both are dropped first.
-- ---------------------------------------------------------------------------

drop function if exists public.get_squad_stats();

create function public.get_squad_stats()
returns table (
  user_id uuid,
  first_name text,
  last_name text,
  player_position text,
  shirt_number smallint,
  apps bigint,
  goals bigint,
  assists bigint,
  avatar_url text
)
language sql
stable
as $$
  select s.id, s.first, s.last, s.pos, s.shirt, s.apps, s.goals, s.assists, s.avatar
  from (
    select
      u.id as id,
      u.first_name as first,
      u.last_name as last,
      u.position as pos,
      u.shirt_number as shirt,
      u.avatar_url as avatar,
      (
        select count(distinct l.match_id)
        from public.match_lineups l
        where l.user_id = u.id
      )::bigint as apps,
      (
        select count(*)
        from public.match_events e
        where e.player_user_id = u.id and e.type = 'goal'
      )::bigint as goals,
      (
        select count(*)
        from public.match_events e
        where e.assist_user_id = u.id and e.type = 'goal'
      )::bigint as assists
    from public.users u
  ) s
  order by s.shirt nulls last, s.first, s.last;
$$;

drop function if exists public.get_competition_scorers(bigint);

create function public.get_competition_scorers(p_competition_id bigint)
returns table (
  player_key text,
  player_name text,
  user_id uuid,
  team_name text,
  goals bigint,
  assists bigint,
  avatar_url text
)
language sql
stable
as $$
  with contributions as (
    select e.competition_team_id as team, e.player_user_id as uid, e.player_name as label, 1 as g, 0 as a
    from public.match_events e
    join public.matches m on m.id = e.match_id
    where m.competition_id = p_competition_id and e.type = 'goal'
    union all
    select e.competition_team_id, e.assist_user_id, e.assist_name, 0, 1
    from public.match_events e
    join public.matches m on m.id = e.match_id
    where m.competition_id = p_competition_id
      and e.type = 'goal'
      and (e.assist_user_id is not null or e.assist_name is not null)
  ),
  totals as (
    select
      coalesce(c.uid::text, c.label) as key,
      coalesce(
        nullif(trim(concat_ws(' ', u.first_name, u.last_name)), ''),
        c.label
      ) as label,
      c.uid as uid,
      t.name as team,
      u.avatar_url as avatar,
      sum(c.g)::bigint as g,
      sum(c.a)::bigint as a
    from contributions c
    left join public.users u on u.id = c.uid
    left join public.competition_teams t on t.id = c.team
    group by 1, 2, 3, 4, 5
  )
  select s.key, s.label, s.uid, s.team, s.g, s.a, s.avatar
  from totals s
  where s.key is not null
  order by s.g desc, s.a desc, s.label;
$$;

-- Player fields on /squad/<id> are gated in the UI only, the same way
-- /accounts/<id> already is. To enforce it in the database, check whether row
-- level security is on for public.users first — turning it on without also
-- adding select policies would break every page that reads members:
--
--   select relrowsecurity from pg_class where relname = 'users';
