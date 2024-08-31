package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberHistory;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CucumberHistoryRowMapper {

    public static class CucumberHistoryDTOMapper implements RowMapper<CucumberHistory> {

        @Override
        public CucumberHistory mapRow(ResultSet rs, int rowNum) throws SQLException {
            CucumberHistory cucumberHistory = new CucumberHistory();
            cucumberHistory.setId(rs.getLong("id"));
            cucumberHistory.setAddingDate(rs.getDate("adding_date"));
            cucumberHistory.setFeatureCount(rs.getInt("feature_count"));
            cucumberHistory.setTestCaseCount(rs.getInt("test_case_count"));

            return cucumberHistory;
        }
    }
}
