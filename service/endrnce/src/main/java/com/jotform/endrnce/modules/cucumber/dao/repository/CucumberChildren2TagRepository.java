package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberChildren2Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberChildren2TagRepository extends JpaRepository<CucumberChildren2Tag, Long> {
    List<CucumberChildren2Tag> findAll();
}
