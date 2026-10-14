-- One-time, idempotent migration: replace crn + nin_masked with a full 11-digit nin.
-- Keeps all existing rows and citizen_ids (other tables, e.g. payments, reference them).
-- Existing rows keep their last 4 digits; the first 7 are filled in randomly.

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'citizens' and column_name = 'nin_masked') then

    alter table public.citizens add column if not exists nin text;

    update public.citizens
    set nin = lpad(floor(random() * 10000000)::int::text, 7, '0')
              || case when nin_masked ~ '[0-9]{4}$' then right(nin_masked, 4)
                      else lpad(floor(random() * 10000)::int::text, 4, '0') end
    where nin is null;

    alter table public.citizens
      alter column nin set not null,
      add constraint citizens_nin_key unique (nin),
      add constraint citizens_nin_format check (nin ~ '^[0-9]{11}$'),
      drop column nin_masked,
      drop column if exists crn;
  end if;
end $$;
