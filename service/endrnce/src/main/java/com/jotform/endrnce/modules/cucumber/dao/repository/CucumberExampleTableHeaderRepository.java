package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberExampleTableHeader;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberExampleTableHeaderRepository extends JpaRepository<CucumberExampleTableHeader, Long> {
    @NonNull
    List<CucumberExampleTableHeader> findAll();
}
