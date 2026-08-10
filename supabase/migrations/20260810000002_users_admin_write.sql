-- Let admins write other members' rows.
--
-- Symptom this fixes: saving a player on /squad/<id> reports success but
-- nothing changes. PostgREST reports no error when row level security filters
-- an update down to zero rows, so a blocked write looks like a successful one.
--
-- Safe to run either way: adding a policy to a table with RLS turned off has no
-- effect, and policies are OR'd, so this can only widen access, never narrow it.
--
-- Check which situation this project is in:
--   select relrowsecurity from pg_class where relname = 'users';
--   select policyname, cmd, qual from pg_policies where tablename = 'users';

drop policy if exists users_admin_write on public.users;
create policy users_admin_write on public.users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Members keep managing their own row (name on /profile, their own avatar).
drop policy if exists users_self_write on public.users;
create policy users_self_write on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
