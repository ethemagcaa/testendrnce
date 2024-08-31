create table health_check_environment
(
    id                     bigint auto_increment,
    health_check_vendor_id bigint not null,
    environment_key        varchar(250) not null,
    environment_value      varchar(250) not null,
    constraint health_check_environment_pk
        primary key (id),
    constraint health_check_environment_health_check_vendor_id_fk
        foreign key (health_check_vendor_id) references health_check_vendor (id)
);
