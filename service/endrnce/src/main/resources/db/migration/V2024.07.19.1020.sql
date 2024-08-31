CREATE TABLE feature_map
(
    id        bigint                NOT NULL AUTO_INCREMENT PRIMARY KEY,
    parent_id bigint                NULL,
    name      varchar(250)          NOT NULL,
    tag       varchar(50)           NOT NULL,
    status    tinyint(1)            NOT NULL,
    CONSTRAINT feature_map_feature_map_id_fk
    FOREIGN KEY (parent_id) references feature_map (id)
);
