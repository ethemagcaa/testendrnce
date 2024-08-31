CREATE TABLE IF NOT EXISTS allure_test_case_label
(
    id                  bigint auto_increment,
    allure_test_case_id bigint       not null,
    name                varchar(250) not null,
    value               varchar(250) not null,
    constraint allure_test_case_label_pk
        primary key (id),
    constraint allure_test_case_label_allure_test_case_null_fk
        foreign key (allure_test_case_id) references allure_test_case (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_status_detail
(
    id                  bigint auto_increment,
    allure_test_case_id bigint  not null,
    known               boolean null,
    muted               boolean null,
    flaky               boolean null,
    message             text    null,
    trace               text    null,
    constraint allure_test_case_status_detail_pk
        primary key (id),
    constraint allure_test_case_status_detail_allure_test_case_null_fk
        foreign key (allure_test_case_id) references allure_test_case (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_attachment
(
    id                  bigint auto_increment,
    allure_test_case_id bigint       not null,
    name                varchar(250) not null,
    source              varchar(250) not null,
    type                varchar(100) not null,
    constraint allure_test_case_attachment_pk
        primary key (id),
    constraint allure_test_case_attachment_allure_test_case_null_fk
        foreign key (allure_test_case_id) references allure_test_case (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_parameter
(
    id                  bigint auto_increment,
    allure_test_case_id bigint       not null,
    name                varchar(250) not null,
    value               varchar(250) not null,
    excluded            boolean      null,
    mode                varchar(25)  null,
    constraint allure_test_case_parameter_pk
        primary key (id),
    constraint allure_test_case_parameter_allure_test_case_null_fk
        foreign key (allure_test_case_id) references allure_test_case (id)
);

CREATE TABLE IF NOT EXISTS allure_test_case_link
(
    id                  bigint auto_increment,
    allure_test_case_id bigint       not null,
    name                varchar(250) null,
    url                 varchar(250) null,
    type                varchar(25)  null,
    constraint allure_test_case_link_pk
        primary key (id),
    constraint allure_test_case_link_allure_test_case_null_fk
        foreign key (allure_test_case_id) references allure_test_case (id)
);