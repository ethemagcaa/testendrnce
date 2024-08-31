package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseStepRepository extends JpaRepository<AllureTestCaseStep, Long> {
    List<AllureTestCaseStep> findAll();
}
