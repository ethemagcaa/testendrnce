CREATE TABLE health_check_vendor
(
    id     bigint           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name   varchar(100)     NOT NULL,
    url    varchar(250)     NOT NULL,
    period int              NULL,
    status tinyint(1)       NOT NULL
);

CREATE TABLE health_check_endpoint
(
    id                      bigint                                      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    health_check_vendor_id  bigint                                      NOT NULL,
    name                    varchar(250)                                NOT NULL,
    period                  int                                         NULL,
    path                    varchar(250)                                NOT NULL,
    request_type            ENUM ('GET', 'POST', 'DELETE', 'PATCH')     NOT NULL,
    request_payload         text                                        NULL,
    request_header          text                                        NULL,
    next_run_time           datetime                                    NULL,
    status                  tinyint(1)                                  NOT NULL,
    CONSTRAINT health_check_endpoint_health_check_vendor_null_fk
    FOREIGN KEY (health_check_vendor_id) REFERENCES health_check_vendor (id)
);

CREATE TABLE health_check_endpoint_status_history
(
    id                        bigint            NOT NULL AUTO_INCREMENT PRIMARY KEY,
    health_check_endpoint_id bigint            NOT NULL,
    check_date                datetime          NOT NULL,
    status                    tinyint(1)        NOT NULL,
    CONSTRAINT health_check_endpoint_status_history_endpoint_null_fk
    FOREIGN KEY (health_check_endpoint_id) REFERENCES health_check_endpoint (id)
);

