package com.jotform.endrnce.modules.cucumber.dao.rowmapper;

import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberTagsDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CucumberTagsRowMapper {

    public static class CucumberTagsDTOMapper implements RowMapper<CucumberTagsDTO> {

        @Override
        public CucumberTagsDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            CucumberTagsDTO gherkinTagsDTO = new CucumberTagsDTO();
            gherkinTagsDTO.setName(rs.getString("name"));
            gherkinTagsDTO.setCounter(rs.getLong("counter"));

            return gherkinTagsDTO;
        }
    }
}
