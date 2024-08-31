package com.jotform.endrnce.modules.healthcheck.dao.repository;

import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckEndPointRepository extends JpaRepository<HealthCheckEndPoint, Long> {
    List<HealthCheckEndPoint> findByHealthCheckVendorId(Long healthCheckVendorId);
}
