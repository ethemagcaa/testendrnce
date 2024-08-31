package com.jotform.endrnce.modules.healthcheck.dao.rowmapper;

import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckVendorDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HealthCheckVendorRowMapper {

    public static class HealthCheckVendorDTOMapper implements RowMapper<HealthCheckVendorDTO> {

        @Override
        public HealthCheckVendorDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            HealthCheckVendorDTO healthCheckVendorDTO = new HealthCheckVendorDTO();
            healthCheckVendorDTO.setId(rs.getLong("id"));
            healthCheckVendorDTO.setName(rs.getString("name"));
            healthCheckVendorDTO.setUrl(rs.getString("url"));
            healthCheckVendorDTO.setPeriod(rs.getInt("period"));
            healthCheckVendorDTO.setStatus(rs.getBoolean("status"));

            return healthCheckVendorDTO;
        }
    }
}
