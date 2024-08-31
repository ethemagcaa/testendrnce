package com.jotform.endrnce.modules.healthcheck.dao.repository;

import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCheckVendorRepository extends JpaRepository<HealthCheckVendor, Long> {
    List<HealthCheckVendor> findAll();
    Optional<HealthCheckVendor> findById(Long id);
}
