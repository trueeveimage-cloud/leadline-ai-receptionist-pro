alter table public.leads
  add column if not exists booking_id uuid,
  add column if not exists is_vvs_company boolean,
  add column if not exists is_decision_maker boolean,
  add column if not exists has_missed_call_need boolean,
  add column if not exists calendar_starts_at timestamptz,
  add column if not exists calendar_event_id text,
  add column if not exists meet_url text,
  add column if not exists booking_status text;

create table if not exists public.demo_bookings (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null,
  company text not null,
  email text not null,
  phone text,
  is_vvs_company boolean not null,
  is_decision_maker boolean not null,
  has_missed_call_need boolean not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Europe/Stockholm',
  status text not null default 'reserved' check (
    status in ('reserved', 'confirmed', 'failed', 'cancelled')
  ),
  calendar_event_id text,
  meet_url text,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_demo_bookings_active_slot
  on public.demo_bookings (starts_at)
  where status in ('reserved', 'confirmed');

create index if not exists idx_demo_bookings_day
  on public.demo_bookings (starts_at, status);

alter table public.demo_bookings enable row level security;
revoke all on table public.demo_bookings from public, anon, authenticated;
grant select, insert, update, delete on table public.demo_bookings to service_role;

create or replace function public.reserve_demo_booking(
  p_submission_id uuid,
  p_name text,
  p_company text,
  p_email text,
  p_phone text,
  p_is_vvs_company boolean,
  p_is_decision_maker boolean,
  p_has_missed_call_need boolean,
  p_starts_at timestamptz,
  p_ends_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_day date := (p_starts_at at time zone 'Europe/Stockholm')::date;
  existing_booking public.demo_bookings%rowtype;
  active_count integer;
  booking_id uuid;
begin
  if not (p_is_vvs_company and p_is_decision_maker and p_has_missed_call_need) then
    raise exception 'lead_not_qualified' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(hashtext('leadmap-demo-' || booking_day::text));

  update public.demo_bookings set
    status = 'failed',
    error_code = 'reservation_expired',
    updated_at = now()
  where status = 'reserved'
    and updated_at < now() - interval '10 minutes';

  select * into existing_booking
  from public.demo_bookings
  where submission_id = p_submission_id
  for update;

  if found then
    if existing_booking.status = 'confirmed' then
      return existing_booking.id;
    end if;
    if existing_booking.status = 'reserved' then
      raise exception 'booking_in_progress' using errcode = 'P0001';
    end if;
  end if;

  select count(*) into active_count
  from public.demo_bookings
  where (starts_at at time zone 'Europe/Stockholm')::date = booking_day
    and status in ('reserved', 'confirmed');

  if active_count >= 2 then
    raise exception 'booking_day_full' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.demo_bookings
    where starts_at = p_starts_at
      and status in ('reserved', 'confirmed')
  ) then
    raise exception 'booking_slot_taken' using errcode = 'P0001';
  end if;

  if existing_booking.id is not null then
    update public.demo_bookings set
      name = p_name,
      company = p_company,
      email = lower(p_email),
      phone = nullif(p_phone, ''),
      is_vvs_company = p_is_vvs_company,
      is_decision_maker = p_is_decision_maker,
      has_missed_call_need = p_has_missed_call_need,
      starts_at = p_starts_at,
      ends_at = p_ends_at,
      status = 'reserved',
      error_code = null,
      updated_at = now()
    where id = existing_booking.id
    returning id into booking_id;
  else
    insert into public.demo_bookings (
      submission_id,
      name,
      company,
      email,
      phone,
      is_vvs_company,
      is_decision_maker,
      has_missed_call_need,
      starts_at,
      ends_at
    ) values (
      p_submission_id,
      p_name,
      p_company,
      lower(p_email),
      nullif(p_phone, ''),
      p_is_vvs_company,
      p_is_decision_maker,
      p_has_missed_call_need,
      p_starts_at,
      p_ends_at
    ) returning id into booking_id;
  end if;

  return booking_id;
end;
$$;

revoke all on function public.reserve_demo_booking(
  uuid, text, text, text, text, boolean, boolean, boolean, timestamptz, timestamptz
) from public, anon, authenticated;
grant execute on function public.reserve_demo_booking(
  uuid, text, text, text, text, boolean, boolean, boolean, timestamptz, timestamptz
) to service_role;

create table if not exists public.voice_demo_sessions (
  id uuid primary key default gen_random_uuid(),
  client_hash text not null,
  language text not null default 'sv' check (language in ('sv', 'en', 'es')),
  status text not null default 'reserved' check (
    status in ('reserved', 'issued', 'ended', 'failed')
  ),
  retell_call_id text,
  error_code text,
  expires_at timestamptz not null default (now() + interval '2 minutes'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_voice_demo_client_window
  on public.voice_demo_sessions (client_hash, created_at desc);
create index if not exists idx_voice_demo_monthly_usage
  on public.voice_demo_sessions (created_at desc, status);

alter table public.voice_demo_sessions enable row level security;
revoke all on table public.voice_demo_sessions from public, anon, authenticated;
grant select, insert, update, delete on table public.voice_demo_sessions to service_role;

create or replace function public.reserve_voice_demo_session(
  p_client_hash text,
  p_language text default 'sv'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  client_count integer;
  monthly_count integer;
  session_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext('leadmap-voice-demo-quota'));

  select count(*) into client_count
  from public.voice_demo_sessions
  where client_hash = p_client_hash
    and created_at >= now() - interval '24 hours'
    and status in ('reserved', 'issued', 'ended');

  if client_count >= 3 then
    raise exception 'voice_demo_daily_limit' using errcode = 'P0001';
  end if;

  select count(*) into monthly_count
  from public.voice_demo_sessions
  where created_at >= date_trunc('month', now())
    and status in ('reserved', 'issued', 'ended');

  if monthly_count >= 50 then
    raise exception 'voice_demo_monthly_limit' using errcode = 'P0001';
  end if;

  insert into public.voice_demo_sessions (client_hash, language)
  values (p_client_hash, p_language)
  returning id into session_id;

  return session_id;
end;
$$;

revoke all on function public.reserve_voice_demo_session(text, text)
  from public, anon, authenticated;
grant execute on function public.reserve_voice_demo_session(text, text) to service_role;

create table if not exists public.conversion_outbox (
  id uuid primary key default gen_random_uuid(),
  marketing_event_id uuid not null unique references public.marketing_events(id) on delete cascade,
  lead_id uuid,
  event_name text not null check (event_name in ('qualified_lead', 'pilot_won')),
  conversion_time timestamptz not null,
  conversion_value_sek numeric(12, 2),
  currency text not null default 'SEK',
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'sent', 'failed', 'dead_letter')
  ),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  sent_at timestamptz,
  google_resource_name text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_conversion_outbox_pending
  on public.conversion_outbox (status, next_attempt_at)
  where status in ('pending', 'failed');

alter table public.conversion_outbox enable row level security;
revoke all on table public.conversion_outbox from public, anon, authenticated;
grant select, insert, update, delete on table public.conversion_outbox to service_role;

create or replace function public.queue_google_ads_conversion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  event_value numeric(12, 2);
  has_advertising_consent boolean;
begin
  if new.event_name not in ('qualified_lead', 'pilot_won') then
    return new;
  end if;

  if new.lead_id is null then
    return new;
  end if;

  select advertising_consent into has_advertising_consent
  from public.leads
  where id = new.lead_id;

  if has_advertising_consent is not true then
    return new;
  end if;

  if coalesce(new.metadata->>'conversion_value_sek', '') ~ '^\d+(\.\d{1,2})?$' then
    event_value := (new.metadata->>'conversion_value_sek')::numeric(12, 2);
  end if;

  if new.event_name = 'pilot_won' and coalesce(event_value, 0) <= 0 then
    raise exception 'pilot_won conversion requires an actual positive invoice value'
      using errcode = '22023';
  end if;

  insert into public.conversion_outbox (
    marketing_event_id,
    lead_id,
    event_name,
    conversion_time,
    conversion_value_sek
  ) values (
    new.id,
    new.lead_id,
    new.event_name,
    new.created_at,
    event_value
  ) on conflict (marketing_event_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_queue_google_ads_conversion on public.marketing_events;
create trigger trg_queue_google_ads_conversion
after insert on public.marketing_events
for each row execute function public.queue_google_ads_conversion();

revoke all on function public.queue_google_ads_conversion() from public, anon, authenticated;
grant execute on function public.queue_google_ads_conversion() to service_role;
