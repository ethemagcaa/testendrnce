package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseStepStatusDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseStepStatusDetailRepository extends JpaRepository<AllureTestCaseStepStatusDetail, Long> {
    List<AllureTestCaseStepStatusDetail> findAll();
}
