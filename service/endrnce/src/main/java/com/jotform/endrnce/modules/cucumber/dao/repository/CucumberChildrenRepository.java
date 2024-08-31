package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberChildren;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberChildrenRepository extends JpaRepository<CucumberChildren, Long> {
    @NonNull
    List<CucumberChildren> findAll();

    List<CucumberChildren> findByKeyword(String keyword);

    Page<CucumberChildren> findByKeyword(String keyword, Pageable pageable);
}
