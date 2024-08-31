CREATE TABLE IF NOT EXISTS allure_ci
(
    id       bigint auto_increment,
    job_name varchar(250) not null,
    job_url  text         null,
    constraint allure_ci_pk
        primary key (id)
);

create unique index allure_ci_job_name_uindex
    on allure_ci (job_name);


alter table allure_suite
    add allure_ci_id bigint null after allure_environment_id;

alter table allure_suite
    add job_build_number bigint null;

alter table allure_suite
    add job_build_url text null;

create index allure_suite_allure_ci_id_index
    on allure_suite (allure_ci_id);

alter table allure_suite
    add constraint allure_suite_allure_ci_null_fk
        foreign key (allure_ci_id) references allure_ci (id);

