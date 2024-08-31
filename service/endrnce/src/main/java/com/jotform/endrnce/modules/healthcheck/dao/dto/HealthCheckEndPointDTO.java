package com.jotform.endrnce.modules.healthcheck.dao.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HealthCheckEndPointDTO {

    private Long id;
    private Long healthCheckVendorId;
    private String name;
    private Integer period;
    private String path;
    private String requestType;
    private String requestPayload;
    private String requestHeader;
    private Date nextRunTime;
    private boolean status;
}
