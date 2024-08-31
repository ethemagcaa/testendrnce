package com.jotform.endrnce.modules.healthcheck.dao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "health_check_vendor")
public class HealthCheckVendor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String url;

    private int period;

    private boolean status;
}
