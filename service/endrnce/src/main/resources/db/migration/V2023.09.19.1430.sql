CREATE TABLE provider_type (
    id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) NOT NULL UNIQUE KEY,
    is_active tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO provider_type (name, is_active)
VALUES ('ON_SITE', true);
INSERT INTO provider_type (name, is_active)
VALUES ('GOOGLE', true);
INSERT INTO provider_type (name, is_active)
VALUES ('GITHUB', true);


CREATE TABLE role
(
    id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role
    (id, name)
VALUES
    (1, 'ROLE_USER'),
    (2, 'ROLE_ADMIN');


CREATE TABLE user
(
    id               BIGINT(11) PRIMARY KEY AUTO_INCREMENT,
    provider_type_id BIGINT(11) REFERENCES provider_type (ID),
    provider_id      VARCHAR(150),
    first_name       VARCHAR(150),
    last_name        VARCHAR(150),
    email            VARCHAR(150) NOT NULL,
    password         VARCHAR(180),
    last_login_date  TIMESTAMP,
    last_logout_date TIMESTAMP,
    created_date     TIMESTAMP NOT NULL,
    UNIQUE (provider_type_id, email)
);

ALTER TABLE user
    ADD FOREIGN KEY (provider_type_id) REFERENCES provider_type(id) ON DELETE RESTRICT ON UPDATE RESTRICT;

INSERT INTO user (id, provider_type_id, first_name, last_name, email, password, last_login_date,
                  last_logout_date, created_date)
VALUES (1, 1, 'Enes', 'Pekkaya', 'enespekkaya@jotform.com',
        '$2a$10$n5cfwc.MLs8gSbitm/5J0.OY36xB6..Jd3sInJBpa6baDnn62tTae', null, null, now());

CREATE TABLE user_role
(
    id BIGINT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT(11) REFERENCES user (id),
    role_id BIGINT(11) REFERENCES role (id)
);


INSERT INTO user_role
    (user_id, role_id)
VALUES
    (1, 1),
    (1, 2);

--DROP TABLE IF EXISTS provider_type;
--DROP TABLE IF EXISTS role;
--DROP TABLE IF EXISTS user;
--DROP TABLE IF EXISTS user_role;

-- *** GENERATE DUMMY DATA ***
-- INSERT INTO USER
-- SELECT seq, 1, 'firstname' || seq, 'lastname' || seq, 'test@test.com' || seq, '$2a$10$n5cfwc.MLs8gSbitm/5J0.OY36xB6..Jd3sInJBpa6baDnn62tTae', null, null, now()::timestamp
-- FROM generate_Series(1,10) seq;
