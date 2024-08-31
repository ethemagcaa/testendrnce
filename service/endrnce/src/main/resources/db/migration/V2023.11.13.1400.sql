alter table cucumber_steps drop column data_table;

create table cucumber_steps_data_table
(
    id               bigint auto_increment PRIMARY KEY,
    cucumber_steps_id bigint       not null,
    location          varchar(250) null,
    constraint cucumber_steps_data_table_cucumber_steps_null_fk
        foreign key (cucumber_steps_id) references cucumber_steps (id)
);

create table cucumber_steps_data_table_row
(
    id               bigint auto_increment PRIMARY KEY,
    cucumber_steps_data_table_id bigint       not null,
    location                     varchar(250) null,
    constraint cucumber_steps_data_table_row_cucumber_steps_data_table__fk
        foreign key (cucumber_steps_data_table_id) references cucumber_steps_data_table (id)
);

create table cucumber_steps_data_table_cell
(
    id               bigint auto_increment PRIMARY KEY,
    cucumber_steps_data_table_row_id bigint       not null,
    location                         varchar(250) null,
    value                            text         not null,
    constraint cucumber_steps_data_table_cell_cucumber_steps_data_table_row__fk
        foreign key (cucumber_steps_data_table_row_id) references cucumber_steps_data_table_row (id)
);

