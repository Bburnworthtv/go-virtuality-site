alter table guardians
add column if not exists full_name text;

alter table guardians
add column if not exists relationship text;
