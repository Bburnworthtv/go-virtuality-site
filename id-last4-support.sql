alter table patients
add column if not exists id_last4 text;

alter table patients
drop constraint if exists patients_id_last4_check;

alter table patients
add constraint patients_id_last4_check
check (id_last4 is null or id_last4 ~ '^[0-9]{4}$');
