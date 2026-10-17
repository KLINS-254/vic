create extension if not exists pgcrypto;
create table if not exists public.bookings(
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
 ticket_number text not null unique, passenger_name text not null, mobile_number text not null,
 email text, from_county text not null, to_county text not null, departure_stage text not null, arrival_stage text not null,
 travel_date date not null, return_date date, trip_type text not null check(trip_type in('one_way','round_trip')),
 vehicle_type text not null check(vehicle_type in('Shuttle','Luxo','Luxury')), seat_count integer not null,
 status text not null default 'requested' check(status in('requested','confirmed','cancelled')), created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings(user_id);
create index if not exists bookings_ticket_mobile_idx on public.bookings(ticket_number,mobile_number);
alter table public.bookings enable row level security;
drop policy if exists "read own bookings" on public.bookings;
create policy "read own bookings" on public.bookings for select to authenticated using(auth.uid()=user_id);
drop policy if exists "insert own bookings" on public.bookings;
create policy "insert own bookings" on public.bookings for insert to authenticated with check(auth.uid()=user_id);
create or replace function public.lookup_ticket(p_ticket_number text,p_mobile_number text)
returns table(ticket_number text,passenger_name text,from_county text,to_county text,departure_stage text,arrival_stage text,travel_date date,return_date date,trip_type text,vehicle_type text,status text)
language sql security definer set search_path=public as $$
 select b.ticket_number,b.passenger_name,b.from_county,b.to_county,b.departure_stage,b.arrival_stage,b.travel_date,b.return_date,b.trip_type,b.vehicle_type,b.status from public.bookings b
 where upper(b.ticket_number)=upper(trim(p_ticket_number)) and regexp_replace(b.mobile_number,'\s+','','g')=regexp_replace(trim(p_mobile_number),'\s+','','g') limit 1;
$$;
revoke all on function public.lookup_ticket(text,text) from public;
grant execute on function public.lookup_ticket(text,text) to anon,authenticated;
