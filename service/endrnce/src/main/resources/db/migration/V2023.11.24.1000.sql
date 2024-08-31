create table allure_suite_environment
(
    id              bigint auto_increment,
    allure_suite_id bigint       not null,
    name            varchar(250) not null,
    value           varchar(250) not null,
    constraint allure_suite_environment_pk
        primary key (id),
    constraint allure_suite_environment_allure_suite_null_fk
        foreign key (allure_suite_id) references allure_suite (id)
);

create index allure_suite_environment_allure_suite_id_index
    on allure_suite_environment (allure_suite_id);