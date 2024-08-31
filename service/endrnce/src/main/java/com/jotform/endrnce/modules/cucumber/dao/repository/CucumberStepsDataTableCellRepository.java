package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberStepsDataTableCell;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberStepsDataTableCellRepository extends JpaRepository<CucumberStepsDataTableCell, Long> {
    @NonNull
    List<CucumberStepsDataTableCell> findAll();
}
