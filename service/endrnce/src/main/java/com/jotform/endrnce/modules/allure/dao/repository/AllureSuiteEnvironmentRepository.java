package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureSuiteEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureSuiteEnvironmentRepository extends JpaRepository<AllureSuiteEnvironment, Long> {
    List<AllureSuiteEnvironment> findAll();

    List<AllureSuiteEnvironment> findByAllureSuiteId(Long allureSuiteId);
}
