package com.jotform.endrnce.modules.healthcheck.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "health_check_environment")
public class HealthCheckEnvironment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "health_check_vendor_id")
    private Long healthCheckVendorId;

    @Column(name = "environment_key")
    private String environmentKey;

    @Column(name = "environment_value")
    private String environmentValue;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private HealthCheckVendor healthCheckVendor;
}
