package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberExample;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberExampleRepository extends JpaRepository<CucumberExample, Long> {
    @NonNull
    List<CucumberExample> findAll();
}
