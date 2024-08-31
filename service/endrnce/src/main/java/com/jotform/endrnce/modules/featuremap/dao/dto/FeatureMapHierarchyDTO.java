package com.jotform.endrnce.modules.featuremap.dao.dto;

import com.jotform.endrnce.modules.cucumber.dao.dto.ScenarioWithFeatureTagsDTO;
import lombok.Data;

import java.util.List;

@Data
public class FeatureMapHierarchyDTO {

    private Long id;
    private Long parentId;
    private String name;
    private String parentPath;
    private boolean status;
    private List<ScenarioWithFeatureTagsDTO> scenarioList;
}
