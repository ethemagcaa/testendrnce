ALTER TABLE health_check_endpoint
    MODIFY request_type ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL;

