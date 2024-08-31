package com.jotform.endrnce.modules.healthcheck.dao.dto;

import lombok.Data;

@Data
public class HealthCheckVendorDTO {

    private Long id;
    private String name;
    private String url;
    private int period;
    private boolean status;
}
