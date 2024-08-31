package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.dto.ScenarioWithFeatureTagsDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ScenarioWithFeatureTagsRowMapper {

    public static class ScenarioWithFeatureTagsDTOMapper implements RowMapper<ScenarioWithFeatureTagsDTO> {

        @Override
        public ScenarioWithFeatureTagsDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ScenarioWithFeatureTagsDTO scenarioWithFeatureTagsDTO = new ScenarioWithFeatureTagsDTO();
            scenarioWithFeatureTagsDTO.setId(rs.getLong("id"));
            scenarioWithFeatureTagsDTO.setCucumberFeatureId(rs.getLong("cucumber_feature_id"));
            scenarioWithFeatureTagsDTO.setName(rs.getString("name"));
            scenarioWithFeatureTagsDTO.setExampleHeader(rs.getString("exampleHeader"));
            scenarioWithFeatureTagsDTO.setExampleBody(rs.getString("exampleBody"));
            scenarioWithFeatureTagsDTO.setTags(rs.getString("tags"));

            return scenarioWithFeatureTagsDTO;
        }
    }
}
