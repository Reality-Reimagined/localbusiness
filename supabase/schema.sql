-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table (profiles for auth.users)
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
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
  user_id uuid not null references public.users(id) on delete cascade,
  business_name text not null,
  description text not null,
  category text not null,
  address text not null,
  website text,
  hours jsonb not null,
  images text[],
  verified boolean default false,
  rating numeric(3,2) default 0.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
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

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.business_profiles enable row level security;
alter table public.services enable row level security;
alter table public.reviews enable row level security;
alter table public.jobs enable row level security;
alter table public.job_bids enable row level security;
alter table public.messages enable row level security;

-- Policies for users table
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Enable insert for authenticated users only"
  on public.users for insert
  with check (auth.uid() = id);

-- Policies for business_profiles table
create policy "Anyone can view business profiles"
  on public.business_profiles for select
  to authenticated
  using (true);

create policy "Business owners can update their own profile"
  on public.business_profiles for update
  using (auth.uid() = user_id);

create policy "Business owners can insert their profile"
  on public.business_profiles for insert
  with check (auth.uid() = user_id);

-- Policies for services table
create policy "Anyone can view services"
  on public.services for select
  to authenticated
  using (true);

create policy "Business owners can manage their services"
  on public.services for all
  using (
    exists (
      select 1 from public.business_profiles
      where id = business_id and user_id = auth.uid()
    )
  );

-- Policies for reviews table
create policy "Anyone can view reviews"
  on public.reviews for select
  to authenticated
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Policies for jobs table
create policy "Anyone can view jobs"
  on public.jobs for select
  to authenticated
  using (true);

create policy "Users can manage their own jobs"
  on public.jobs for all
  using (auth.uid() = user_id);

-- Policies for job_bids table
create policy "Job owners and bidders can view bids"
  on public.job_bids for select
  using (
    exists (
      select 1 from public.jobs where id = job_id and user_id = auth.uid()
    ) or
    exists (
      select 1 from public.business_profiles where id = business_id and user_id = auth.uid()
    )
  );

create policy "Business owners can create bids"
  on public.job_bids for insert
  with check (
    exists (
      select 1 from public.business_profiles where id = business_id and user_id = auth.uid()
    )
  );

-- Policies for messages table
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

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

-- Create indexes for better query performance
create index users_email_idx on public.users(email);
create index business_profiles_category_idx on public.business_profiles(category);
create index jobs_status_idx on public.jobs(status);
create index jobs_category_idx on public.jobs(category);
create index messages_sender_receiver_idx on public.messages(sender_id, receiver_id);