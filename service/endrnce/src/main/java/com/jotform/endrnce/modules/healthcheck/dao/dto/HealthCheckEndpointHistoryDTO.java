package com.jotform.endrnce.modules.healthcheck.dao.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HealthCheckEndpointHistoryDTO {

    private Long id;
    private Long healthCheckpointId;
    private String vendorName;
    private String endpointName;
    private Date checkDate;
    private boolean status;
    private Long healthCheckEndpointId;
}
