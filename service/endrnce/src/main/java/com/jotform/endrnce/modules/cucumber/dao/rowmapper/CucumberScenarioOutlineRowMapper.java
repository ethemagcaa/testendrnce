package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberScenarioOutlineDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CucumberScenarioOutlineRowMapper {

    public static class CucumberScenarioOutlineDTOMapper implements RowMapper<CucumberScenarioOutlineDTO> {

        @Override
        public CucumberScenarioOutlineDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            CucumberScenarioOutlineDTO gherkinScenarioOutlineDTO = new CucumberScenarioOutlineDTO();
            gherkinScenarioOutlineDTO.setName(rs.getString("name"));
            gherkinScenarioOutlineDTO.setExampleHeader(rs.getString("exampleHeader"));
            gherkinScenarioOutlineDTO.setExampleBody(rs.getString("exampleBody"));

            return gherkinScenarioOutlineDTO;
        }
    }
}
