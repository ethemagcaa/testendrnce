CREATE TABLE IF NOT EXISTS allure_test_case_step
(
    id                       bigint auto_increment,
    allure_test_case_id      bigint       not null,
    allure_test_case_step_id bigint       null,
    name                     varchar(250) not null,
    allure_status_id         bigint       not null,
    stage                    varchar(25)  not null,
    start                    timestamp    not null,
    stop                     timestamp    not null,
    constraint allure_test_case_step_pk
    primary key (id),
    constraint allure_test_case_step_allure_test_case_null_fk
    foreign key (allure_test_case_id) references allure_test_case (id),
    constraint allure_test_case_step_allure_status_null_fk
    foreign key (allure_status_id) references allure_status (id)
);

create index allure_test_case_step_allure_test_case_step_id_index
    on allure_test_case_step (allure_test_case_step_id);

CREATE TABLE IF NOT EXISTS allure_test_case_step_status_detail
(
    id                bigint auto_increment,
    allure_test_case_step_id bigint  not null,
    known             boolean null,
    muted             boolean null,
    flaky             boolean null,
    message           text    null,
    trace             text    null,
    constraint allure_test_case_step_status_detail_pk
        primary key (id),
    constraint allure_test_case_step_allure_test_case_step_null_fk
        foreign key (allure_test_case_step_id) references allure_test_case_step (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_step_attachment
(
    id                          bigint auto_increment,
    allure_test_case_step_id    bigint       not null,
    name                        varchar(250) not null,
    source                      varchar(250) not null,
    type                        varchar(100) not null,
    constraint allure_test_case_step_attachment_pk
        primary key (id),
    constraint allure_test_case_step_attachment_allure_test_case_step_null_fk
        foreign key (allure_test_case_step_id) references allure_test_case_step (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_step_parameter
(
    id                          bigint auto_increment,
    allure_test_case_step_id    bigint       not null,
    name                        varchar(250) not null,
    value                       varchar(250) not null,
    excluded                    boolean      null,
    mode                        varchar(25)  null,
    constraint allure_test_case_step_parameter_pk
        primary key (id),
    constraint allure_test_case_step_parameter_allure_test_case_step_null_fk
        foreign key (allure_test_case_step_id) references allure_test_case_step (id)
);