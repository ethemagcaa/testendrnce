package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseLabelRepository extends JpaRepository<AllureTestCaseLabel, Long> {
    List<AllureTestCaseLabel> findAll();
}
