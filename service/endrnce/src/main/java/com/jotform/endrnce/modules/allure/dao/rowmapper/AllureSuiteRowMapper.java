package com.jotform.endrnce.modules.allure.dao.rowmapper;

import com.jotform.endrnce.modules.allure.dao.dto.AllureSuiteDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AllureSuiteRowMapper {

    public static class AllureSuiteDTOMapper implements RowMapper<AllureSuiteDTO> {

        @Override
        public AllureSuiteDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            AllureSuiteDTO allureSuiteDTO = new AllureSuiteDTO();
            allureSuiteDTO.setId(rs.getLong("id"));
            allureSuiteDTO.setName(rs.getString("name"));
            allureSuiteDTO.setFailed(rs.getLong("failed"));
            allureSuiteDTO.setBroken(rs.getLong("broken"));
            allureSuiteDTO.setSkipped(rs.getLong("skipped"));
            allureSuiteDTO.setPassed(rs.getLong("passed"));
            allureSuiteDTO.setUnknown(rs.getLong("unknown"));

            return allureSuiteDTO;
        }
    }
}
