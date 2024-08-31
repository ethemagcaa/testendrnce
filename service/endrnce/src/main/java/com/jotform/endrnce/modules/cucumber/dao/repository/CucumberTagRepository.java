package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberTag;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberTagRepository extends JpaRepository<CucumberTag, Long> {
    @NonNull
    List<CucumberTag> findAll();

    @NonNull
    CucumberTag findByNameEqualsIgnoreCase(String name);
}
