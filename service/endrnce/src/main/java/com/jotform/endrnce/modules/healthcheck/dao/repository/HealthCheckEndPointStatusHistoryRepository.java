package com.jotform.endrnce.modules.healthcheck.dao.repository;

import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPointStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckEndPointStatusHistoryRepository extends JpaRepository<HealthCheckEndPointStatusHistory, Long> {
    List<HealthCheckEndPointStatusHistory> findByHealthCheckEndPointId(Long healthCheckEndPointId);

    void deleteByHealthCheckEndPointId(Long healthCheckEndPointId);
}
