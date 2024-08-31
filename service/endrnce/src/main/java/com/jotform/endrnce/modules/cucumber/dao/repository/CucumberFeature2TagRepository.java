package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberFeature2Tag;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberFeature2TagRepository extends JpaRepository<CucumberFeature2Tag, Long> {
    @NonNull
    List<CucumberFeature2Tag> findAll();
}
