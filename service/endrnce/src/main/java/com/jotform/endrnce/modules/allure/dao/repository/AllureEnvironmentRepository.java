package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureEnvironmentRepository extends JpaRepository<AllureEnvironment, Long> {
    List<AllureEnvironment> findAll();

    AllureEnvironment findByNameEqualsIgnoreCase(String name);
}
