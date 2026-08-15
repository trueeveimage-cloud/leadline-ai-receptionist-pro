alter table public.leads
  add column if not exists owner_name text,
  add column if not exists email text,
  add column if not exists city text,
  add column if not exists category text,
  add column if not exists niche_label text,
  add column if not exists website text,
  add column if not exists status text,
  add column if not exists section text,
  add column if not exists product text,
  add column if not exists lead_source text,
  add column if not exists source_page text,
  add column if not exists source_campaign text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists fbclid text,
  add column if not exists preferred_contact_method text,
  add column if not exists audit_data jsonb not null default '{}'::jsonb,
  add column if not exists website_demo_requested boolean not null default false,
  add column if not exists seo_landing_page text,
  add column if not exists case_study_page text,
  add column if not exists notes text,
  add column if not exists marketing_submission_id uuid,
  add column if not exists first_invoice_value_sek numeric(12, 2);

alter table public.leads
  drop constraint if exists leads_first_invoice_value_sek_positive;
alter table public.leads
  add constraint leads_first_invoice_value_sek_positive
  check (first_invoice_value_sek is null or first_invoice_value_sek > 0);

alter table public.leads
  add column if not exists advertising_consent boolean not null default false;

alter table public.leads alter column phone drop not null;

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
grant select, insert, update, delete on table public.leads to service_role;

create unique index if not exists idx_leads_marketing_submission_id
  on public.leads (marketing_submission_id)
  where marketing_submission_id is not null;

create table if not exists public.marketing_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  product text not null default 'leadmap',
  event_name text not null check (
    event_name in (
      'landing_view',
      'audit_start',
      'audit_submit',
      'demo_open',
      'demo_booked',
      'qualified_lead',
      'pilot_won'
    )
  ),
  source_page text,
  landing_path text,
  page_type text,
  cta_variant text,
  niche text,
  city text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  gbraid text,
  wbraid text,
  fbclid text,
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Keep the migration compatible with an older marketing_events table.
alter table public.marketing_events
  add column if not exists event_id uuid,
  add column if not exists lead_id uuid,
  add column if not exists product text default 'leadmap',
  add column if not exists event_name text,
  add column if not exists source_page text,
  add column if not exists landing_path text,
  add column if not exists page_type text,
  add column if not exists cta_variant text,
  add column if not exists niche text,
  add column if not exists city text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists fbclid text,
  add column if not exists referrer text,
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now();

create unique index if not exists idx_marketing_events_event_id
  on public.marketing_events (event_id);

create unique index if not exists idx_marketing_events_lead_stage
  on public.marketing_events (lead_id, event_name)
  where lead_id is not null;

create index if not exists idx_marketing_events_funnel
  on public.marketing_events (product, event_name, created_at desc);

create index if not exists idx_marketing_events_campaign
  on public.marketing_events (product, utm_campaign, event_name, created_at desc);

create or replace function public.capture_lead_funnel_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  funnel_event text;
begin
  if new.marketing_submission_id is null then
    return new;
  end if;

  if tg_op = 'UPDATE' and new.status is not distinct from old.status then
    return new;
  end if;

  funnel_event := case lower(coalesce(new.status, ''))
    when 'qualified' then 'qualified_lead'
    when 'qualified_lead' then 'qualified_lead'
    when 'pilot_won' then 'pilot_won'
    when 'won' then 'pilot_won'
    when 'closed_won' then 'pilot_won'
    when 'customer' then 'pilot_won'
    else null
  end;

  if funnel_event is null then
    return new;
  end if;

  if funnel_event = 'pilot_won'
    and coalesce(new.first_invoice_value_sek, 0) <= 0 then
    raise exception 'pilot_won requires a positive first_invoice_value_sek'
      using errcode = '22023';
  end if;

  insert into public.marketing_events (
    event_id,
    lead_id,
    product,
    event_name,
    source_page,
    landing_path,
    page_type,
    niche,
    city,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    gbraid,
    wbraid,
    fbclid,
    metadata
  ) values (
    gen_random_uuid(),
    new.id,
    coalesce(new.product, 'leadmap'),
    funnel_event,
    new.source_page,
    new.seo_landing_page,
    'crm_status',
    new.niche_label,
    new.city,
    new.utm_source,
    new.utm_medium,
    new.utm_campaign,
    new.utm_term,
    new.utm_content,
    new.gclid,
    new.gbraid,
    new.wbraid,
    new.fbclid,
    jsonb_strip_nulls(jsonb_build_object(
      'lead_id', new.id,
      'status', new.status,
      'submission_id', new.marketing_submission_id,
      'conversion_value_sek', case
        when funnel_event = 'pilot_won' then new.first_invoice_value_sek
        else null
      end
    ))
  )
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists trg_capture_lead_funnel_insert on public.leads;
create trigger trg_capture_lead_funnel_insert
after insert on public.leads
for each row execute function public.capture_lead_funnel_event();

drop trigger if exists trg_capture_lead_funnel_update on public.leads;
create trigger trg_capture_lead_funnel_update
after update of status on public.leads
for each row execute function public.capture_lead_funnel_event();

revoke all on function public.capture_lead_funnel_event() from public, anon, authenticated;
grant execute on function public.capture_lead_funnel_event() to service_role;

alter table public.marketing_events enable row level security;

drop policy if exists "Anon CRM access" on public.marketing_events;
drop policy if exists "Authenticated CRM access" on public.marketing_events;
revoke all on table public.marketing_events from anon, authenticated;
grant select, insert, update, delete on table public.marketing_events to service_role;
