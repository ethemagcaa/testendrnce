package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureTestCaseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureTestCaseAttachmentRepository extends JpaRepository<AllureTestCaseAttachment, Long> {
    List<AllureTestCaseAttachment> findAll();
}
