package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberStepsDataTableRow;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberStepsDataTableRowRepository extends JpaRepository<CucumberStepsDataTableRow, Long> {
    @NonNull
    List<CucumberStepsDataTableRow> findAll();
}
