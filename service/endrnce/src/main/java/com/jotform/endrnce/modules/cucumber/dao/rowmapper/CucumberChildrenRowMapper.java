package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberChildrenDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CucumberChildrenRowMapper {

    public static class CucumberChildrenDTOMapper implements RowMapper<CucumberChildrenDTO> {

        @Override
        public CucumberChildrenDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            CucumberChildrenDTO cucumberChildrenDTO = new CucumberChildrenDTO();
            cucumberChildrenDTO.setId(rs.getLong("id"));
            cucumberChildrenDTO.setCucumberFeatureId(rs.getLong("cucumber_feature_id"));
            cucumberChildrenDTO.setName(rs.getString("name"));
            cucumberChildrenDTO.setDescription(rs.getString("description"));
            cucumberChildrenDTO.setKeyword(rs.getString("keyword"));
            cucumberChildrenDTO.setLocation(rs.getString("location"));
            cucumberChildrenDTO.setExampleHeader(rs.getString("exampleHeader"));
            cucumberChildrenDTO.setExampleBody(rs.getString("exampleBody"));
            cucumberChildrenDTO.setFeatureName(rs.getString("featureName"));
            cucumberChildrenDTO.setTags(rs.getString("tags"));

            return cucumberChildrenDTO;
        }
    }
}
