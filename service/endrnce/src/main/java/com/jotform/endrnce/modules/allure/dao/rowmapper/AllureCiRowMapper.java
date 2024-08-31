package com.jotform.endrnce.modules.allure.dao.rowmapper;

import com.jotform.endrnce.modules.allure.dao.dto.AllureCiDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AllureCiRowMapper {

    public static class AllureCiDTOMapper implements RowMapper<AllureCiDTO> {

        @Override
        public AllureCiDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            AllureCiDTO allureCiDTO = new AllureCiDTO();
            allureCiDTO.setId(rs.getLong("id"));
            allureCiDTO.setName(rs.getString("job_name"));

            return allureCiDTO;
        }
    }
}
