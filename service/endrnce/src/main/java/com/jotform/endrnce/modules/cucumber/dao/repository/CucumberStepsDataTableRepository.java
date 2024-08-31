package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberStepsDataTable;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberStepsDataTableRepository extends JpaRepository<CucumberStepsDataTable, Long> {
    @NonNull
    List<CucumberStepsDataTable> findAll();
}
