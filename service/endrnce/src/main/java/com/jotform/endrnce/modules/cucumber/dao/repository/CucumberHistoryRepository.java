package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberHistory;
import lombok.NonNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberHistoryRepository extends JpaRepository<CucumberHistory, Long> {
    @NonNull
    List<CucumberHistory> findAll();

    CucumberHistory findFirstBy(Sort sort);
}
