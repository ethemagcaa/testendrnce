package com.jotform.endrnce.modules.healthcheck.dao.rowmapper;

import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckEnvironmentQueryDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HealthCheckEnvironmentRowMapper {
    public static class HealthCheckEnvironmentDTOMapper implements RowMapper<HealthCheckEnvironmentQueryDTO> {

        @Override
        public HealthCheckEnvironmentQueryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            HealthCheckEnvironmentQueryDTO healthCheckEnvironmentDTO = new HealthCheckEnvironmentQueryDTO();
            healthCheckEnvironmentDTO.setId(rs.getLong("id"));
            healthCheckEnvironmentDTO.setHealthCheckVendorId(rs.getLong("health_check_vendor_id"));
            healthCheckEnvironmentDTO.setEnvironmentKey(rs.getString("environment_key"));
            healthCheckEnvironmentDTO.setVendorName(rs.getString("vendorName"));

            return healthCheckEnvironmentDTO;
        }
    }
}
