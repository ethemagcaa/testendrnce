package com.jotform.endrnce.modules.featuremap.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.cucumber.dao.dto.ScenarioWithFeatureTagsDTO;
import com.jotform.endrnce.modules.cucumber.service.CucumberService;
import com.jotform.endrnce.modules.featuremap.dao.dto.FeatureMapDTO;
import com.jotform.endrnce.modules.featuremap.dao.dto.FeatureMapHierarchyDTO;
import com.jotform.endrnce.modules.featuremap.dao.entity.FeatureMap;
import com.jotform.endrnce.modules.featuremap.dao.repository.FeatureMapRepository;
import com.jotform.endrnce.modules.featuremap.dao.rowmapper.FeatureMapHierarchyRowMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class FeatureMapService {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final FeatureMapRepository featureMapRepository;
    private final CucumberService cucumberService;

    public List<FeatureMapHierarchyDTO> getFeatureMapHierarchyList() throws JsonProcessingException {
        String sql = DaoUtil.getQuery("selectParentHierarchyOfFeatureMap");
        List<FeatureMapHierarchyDTO> hierarchyDTOList = namedParameterJdbcTemplate.query(
                sql,
                new MapSqlParameterSource(),
                new FeatureMapHierarchyRowMapper.FeatureMapHierarchyDTOMapper()
        );

        for (FeatureMapHierarchyDTO hierarchyDTO : hierarchyDTOList) {
            if(ObjectUtils.isEmpty(hierarchyDTO.getParentPath()))
                hierarchyDTO.setParentPath(hierarchyDTO.getId().toString());
            else
                hierarchyDTO.setParentPath(String.format("%s,%s", hierarchyDTO.getParentPath(), hierarchyDTO.getId()));

            List<Long> idList = Arrays.stream(hierarchyDTO.getParentPath().split(","))
                        .map(String::trim)
                        .map(Long::parseLong).toList();

            List<String> tags = featureMapRepository.findTagsByIds(idList);
            String where = tags.stream()
                    .map(name -> "tags LIKE '%" + name + "%'")
                    .collect(Collectors.joining(" AND "));
            where = where.equals("") ? "1=1" : where;
            List<ScenarioWithFeatureTagsDTO> scenarioList = cucumberService.getScenariosIncludeFeatureTags(where);
            hierarchyDTO.setScenarioList(scenarioList);
        }

        return  hierarchyDTOList;
    }

    public List<FeatureMap> getFeatureMapList() {
        return featureMapRepository.findAll();
    }

    @Transactional
    public FeatureMap createFeatureMap(FeatureMapDTO featureMapDTO) {
        ModelMapper modelMapper = new ModelMapper();
        FeatureMap featureMap = modelMapper.map(featureMapDTO, FeatureMap.class);
        
        return featureMapRepository.save(featureMap);
    }

    @Transactional
    public FeatureMap updateFeatureMap(FeatureMapDTO featureMapDTO) {
        if(ObjectUtils.isEmpty(featureMapDTO.getId()) || featureMapRepository.findById(featureMapDTO.getId()).isEmpty()) {
            throw new NotFoundRequestException("Feature Map is not found!");
        }

        ModelMapper modelMapper = new ModelMapper();
        FeatureMap featureMap = modelMapper.map(featureMapDTO, FeatureMap.class);

        return featureMapRepository.save(featureMap);
    }

    @Transactional
    public void deleteFeatureMap(Long featureMapId) {
        FeatureMap featureMap = featureMapRepository.findById(featureMapId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Feature Map with id %d is not found", featureMapId)));

        featureMapRepository.delete(featureMap);
    }
}