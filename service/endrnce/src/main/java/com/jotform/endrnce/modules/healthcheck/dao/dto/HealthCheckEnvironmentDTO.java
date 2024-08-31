package com.jotform.endrnce.modules.healthcheck.dao.dto;

import lombok.Data;

@Data
public class HealthCheckEnvironmentDTO {
    private Long id;
    private Long healthCheckVendorId;
    private String environmentKey;
    private String environmentValue;
}
