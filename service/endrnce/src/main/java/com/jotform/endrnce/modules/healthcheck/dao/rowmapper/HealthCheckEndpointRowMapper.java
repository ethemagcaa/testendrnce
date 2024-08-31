package com.jotform.endrnce.modules.healthcheck.dao.rowmapper;

import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckEndpointQueryDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HealthCheckEndpointRowMapper {

    public static class HealthCheckEndpointDTOMapper implements RowMapper<HealthCheckEndpointQueryDTO> {

        @Override
        public HealthCheckEndpointQueryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            HealthCheckEndpointQueryDTO healthCheckEndPointQueryDTO = new HealthCheckEndpointQueryDTO();
            healthCheckEndPointQueryDTO.setId(rs.getLong("id"));
            healthCheckEndPointQueryDTO.setHealthCheckVendorId(rs.getLong("health_check_vendor_id"));
            healthCheckEndPointQueryDTO.setName(rs.getString("name"));
            healthCheckEndPointQueryDTO.setPeriod(rs.getObject("period") != null ? rs.getInt("period") : null);
            healthCheckEndPointQueryDTO.setPath(rs.getString("path"));
            healthCheckEndPointQueryDTO.setRequestType(rs.getString("request_type"));
            healthCheckEndPointQueryDTO.setNextRunTime(rs.getTimestamp("next_run_time"));
            healthCheckEndPointQueryDTO.setStatus(rs.getBoolean("status"));

            return healthCheckEndPointQueryDTO;
        }
    }
}
