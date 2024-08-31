CREATE TABLE IF NOT EXISTS allure_environment
(
    id   bigint auto_increment PRIMARY KEY,
    name varchar(250) not null
);

CREATE TABLE IF NOT EXISTS allure_status
(
    id   bigint auto_increment PRIMARY KEY,
    name varchar(50) not null
);

CREATE TABLE IF NOT EXISTS allure_test_case
(
    id               bigint auto_increment PRIMARY KEY,
    allure_suite_id  bigint       not null,
    uuid             varchar(250) not null,
    history_id       varchar(250) not null,
    test_case_id     varchar(250) not null,
    name             varchar(250) not null,
    full_name        varchar(250) not null,
    description      text         null,
    descriptionHtml  text         null,
    allure_status_id bigint       not null,
    start            timestamp    not null,
    stop             timestamp    not null,
    constraint allure_test_case_allure_status_null_fk
    foreign key (allure_status_id) references allure_status (id)
);

CREATE TABLE IF NOT EXISTS allure_suite
(
    id                    bigint auto_increment PRIMARY KEY,
    allure_environment_id bigint       not null,
    name                  varchar(250) not null,
    failed                bigint       not null,
    broken                bigint       not null,
    skipped               bigint       not null,
    passed                bigint       not null,
    unknown               bigint       not null,
    total                 bigint       not null,
    start                 timestamp    not null,
    stop                  timestamp    not null,
    duration              bigint       not null,
    min_duration          bigint       not null,
    max_duration          bigint       not null,
    sum_duration          bigint       not null,
    constraint allure_suite_allure_environment_null_fk
    foreign key (allure_environment_id) references allure_environment (id)
);

create index allure_suite_allure_environment_id_index
    on allure_suite (allure_environment_id);

INSERT INTO allure_status (id, name)
VALUES  (1, 'failed'),
        (2, 'broken'),
        (3, 'passed'),
        (4, 'skipped'),
        (5, 'unknown');