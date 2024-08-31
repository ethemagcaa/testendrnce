package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberExampleTableBody;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberExampleTableBodyRepository extends JpaRepository<CucumberExampleTableBody, Long> {
    @NonNull
    List<CucumberExampleTableBody> findAll();
}
