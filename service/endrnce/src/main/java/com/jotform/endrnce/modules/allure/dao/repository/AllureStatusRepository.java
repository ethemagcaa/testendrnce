package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureStatusRepository extends JpaRepository<AllureStatus, Long> {
    List<AllureStatus> findAll();

    AllureStatus findByNameEqualsIgnoreCase(String name);
}
