package com.jotform.endrnce.modules.healthcheck.dao.repository;

import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthCheckEnvironmentRepository extends JpaRepository<HealthCheckEnvironment, Long> {
    List<HealthCheckEnvironment> findByHealthCheckVendorId(Long healthCheckVendorId);
}
