package com.jotform.endrnce.modules.cucumber.dao.repository;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberFeature;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CucumberFeatureRepository extends JpaRepository<CucumberFeature, Long> {
    @NonNull
    List<CucumberFeature> findAll();
}
