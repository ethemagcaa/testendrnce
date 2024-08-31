package com.jotform.endrnce.modules.role.dao.rowmapper;

import com.jotform.endrnce.modules.role.dao.dto.RoleQueryDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RoleRowMapper {

    public static class RoleDTOMapper implements RowMapper<RoleQueryDTO> {

        @Override
        public RoleQueryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            RoleQueryDTO roleQueryDTO = new RoleQueryDTO();
            roleQueryDTO.setId(rs.getLong("id"));
            roleQueryDTO.setName(rs.getString("name"));

            return roleQueryDTO;
        }
    }
}
