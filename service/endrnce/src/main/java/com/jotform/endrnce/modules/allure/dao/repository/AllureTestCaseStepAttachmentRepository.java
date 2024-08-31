package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseStepAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseStepAttachmentRepository extends JpaRepository<AllureTestCaseStepAttachment, Long> {
    List<AllureTestCaseStepAttachment> findAll();
}
