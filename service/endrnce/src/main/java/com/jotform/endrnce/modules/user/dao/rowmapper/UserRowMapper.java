package com.jotform.endrnce.modules.user.dao.rowmapper;

import com.jotform.endrnce.modules.user.dao.dto.UserQueryDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper {

    public static class UserDTOMapper implements RowMapper<UserQueryDTO> {

        @Override
        public UserQueryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserQueryDTO userQueryDTO = new UserQueryDTO();
            userQueryDTO.setId(rs.getLong("id"));
            userQueryDTO.setFirstName(rs.getString("first_name"));
            userQueryDTO.setLastName(rs.getString("last_name"));
            userQueryDTO.setEmail(rs.getString("email"));
            userQueryDTO.setLastLoginDate(rs.getTimestamp("last_login_date"));
            userQueryDTO.setProviderTypeName(rs.getString("provider_type_name"));
            userQueryDTO.setRoles(rs.getString("roles"));

            return userQueryDTO;
        }
    }
}
