package com.jotform.endrnce.modules.cucumber.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScenarioWithFeatureTagsDTO implements Serializable {

    private Long id;

    private Long cucumberFeatureId;

    private String name;

    private String exampleHeader;

    private String exampleBody;

    private String tags;
}
