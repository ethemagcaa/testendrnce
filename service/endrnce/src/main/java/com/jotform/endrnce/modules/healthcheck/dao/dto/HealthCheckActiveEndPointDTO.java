package com.jotform.endrnce.modules.healthcheck.dao.dto;

import lombok.Data;

import java.util.Date;


@Data
public class HealthCheckActiveEndPointDTO {

    private Long id;
    private String name;
    private int period;
    private String vendorUrl;
    private String path;
    private String requestType;
    private String requestHeader;
    private String requestPayload;
    private Date nextRunTime;

    private long vendorId;
}
