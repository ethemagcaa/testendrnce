package com.jotform.endrnce.modules.featuremap.dao.repository;

import com.jotform.endrnce.modules.featuremap.dao.entity.FeatureMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeatureMapRepository extends JpaRepository<FeatureMap, Long> {
    List<FeatureMap> findAll();

    @Query("SELECT fm.tag FROM FeatureMap fm WHERE fm.id IN :ids")
    List<String> findTagsByIds(@Param("ids") List<Long> ids);
}
