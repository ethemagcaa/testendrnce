package com.jotform.endrnce.modules.healthcheck.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "health_check_endpoint")
public class HealthCheckEndPoint implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "health_check_vendor_id")
    private Long healthCheckVendorId;

    private String name;

    private Integer period;

    private String path;

    @Column(name = "request_type", columnDefinition = "ENUM('GET', 'POST', 'DELETE', 'PATCH')")
    private String requestType;

    @Column(name = "request_payload")
    private String requestPayload;

    @Column(name = "request_header")
    private String requestHeader;

    @Column(name = "next_run_time")
    private Date nextRunTime;

    private boolean status;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "health_check_vendor_id", referencedColumnName = "id", insertable = false, updatable = false)
    private HealthCheckVendor healthCheckVendor;
}
