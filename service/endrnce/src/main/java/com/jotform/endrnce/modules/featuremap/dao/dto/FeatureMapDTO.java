package com.jotform.endrnce.modules.featuremap.dao.dto;

import lombok.Data;

@Data
public class FeatureMapDTO {

    private Long id;
    private Long parentId;
    private String name;
    private String tag;
    private boolean status;
}
