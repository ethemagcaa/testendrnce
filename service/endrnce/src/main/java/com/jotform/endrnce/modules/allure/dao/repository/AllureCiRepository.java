package com.jotform.endrnce.modules.allure.dao.repository;

import com.jotform.endrnce.modules.allure.dao.entity.AllureCi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AllureCiRepository extends JpaRepository<AllureCi, Long> {
    List<AllureCi> findAll();

    AllureCi findByJobNameEqualsIgnoreCase(String name);
}
