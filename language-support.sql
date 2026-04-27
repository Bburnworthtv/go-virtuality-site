alter table patients
add column if not exists language text not null default 'en';

alter table patients
drop constraint if exists patients_language_check;

alter table patients
add constraint patients_language_check
check (language in ('en', 'zu', 'xh', 'af', 'st', 'tn'));
