package com.jotform.endrnce.modules.healthcheck.dao.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "health_check_endpoint_status_history")
public class HealthCheckEndPointStatusHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "health_check_endpoint_id")
    private Long healthCheckEndPointId;

    @Column(name = "check_date")
    private Date checkDate;

    private boolean status;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "health_check_endpoint_id", insertable = false, updatable = false)
    private HealthCheckEndPoint healthCheckEndPoint;
}
