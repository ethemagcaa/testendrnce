package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberSteps;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberStepsRepository extends JpaRepository<CucumberSteps, Long> {
    @NonNull
    List<CucumberSteps> findAll();

    List<CucumberSteps> findByCucumberChildrenId(Long scenarioId);
}
