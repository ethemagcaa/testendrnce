package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseStatusDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseStatusDetailRepository extends JpaRepository<AllureTestCaseStatusDetail, Long> {
    List<AllureTestCaseStatusDetail> findAll();
}
