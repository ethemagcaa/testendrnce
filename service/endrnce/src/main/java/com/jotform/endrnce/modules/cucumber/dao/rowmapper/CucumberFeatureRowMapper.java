package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberFeature;
import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberHistory;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CucumberFeatureRowMapper {

    public static class CucumberFeatureDTOMapper implements RowMapper<CucumberFeature> {

        @Override
        public CucumberFeature mapRow(ResultSet rs, int rowNum) throws SQLException {
            CucumberFeature cucumberFeature = new CucumberFeature();
            cucumberFeature.setId(rs.getLong("id"));
            cucumberFeature.setName(rs.getString("name"));
            cucumberFeature.setDescription(rs.getString("description"));
            cucumberFeature.setKeyword(rs.getString("keyword"));
            cucumberFeature.setLanguage(rs.getString("language"));
            cucumberFeature.setLocation(rs.getString("location"));

            return cucumberFeature;
        }
    }
}
