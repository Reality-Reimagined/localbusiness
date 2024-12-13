-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  name text not null,
  role text not null check (role in ('user', 'business')),
  phone text,
  location text,
  bio text,
  profile_image_url text,
  interests text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  profile_complete boolean default false
);

-- Business profiles table
create table public.business_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  business_name text not null,
  description text not null,
  category text not null,
  address text not null,
  website text,
  hours jsonb not null,
  images text[],
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Services table
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.business_profiles(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null,
  duration text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  business_id uuid references public.business_profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs table
create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  budget decimal(10,2),
  location text not null,
  status text not null default 'open' check (status in ('open', 'in-progress', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Job bids table
create table public.job_bids (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references public.jobs(id) on delete cascade,
  business_id uuid references public.business_profiles(id) on delete cascade,
  amount decimal(10,2) not null,
  proposal text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.users(id) on delete cascade,
  receiver_id uuid references public.users(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index users_email_idx on public.users(email);
create index business_profiles_category_idx on public.business_profiles(category);
create index jobs_status_idx on public.jobs(status);
create index jobs_category_idx on public.jobs(category);
create index messages_sender_receiver_idx on public.messages(sender_id, receiver_id);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_business_profiles_updated_at
  before update on public.business_profiles
  for each row execute function public.update_updated_at_column();

create trigger update_services_updated_at
  before update on public.services
  for each row execute function public.update_updated_at_column();

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row execute function public.update_updated_at_column();

create trigger update_jobs_updated_at
  before update on public.jobs
  for each row execute function public.update_updated_at_column();

create trigger update_job_bids_updated_at
  before update on public.job_bids
  for each row execute function public.update_updated_at_column();