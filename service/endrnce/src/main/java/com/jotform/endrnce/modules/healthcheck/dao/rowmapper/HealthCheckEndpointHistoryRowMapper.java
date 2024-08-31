package com.jotform.endrnce.modules.healthcheck.dao.rowmapper;

import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckEndpointHistoryDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HealthCheckEndpointHistoryRowMapper {

    public static class HealthCheckEndpointHistoryDTOMapper implements RowMapper<HealthCheckEndpointHistoryDTO> {

        @Override
        public HealthCheckEndpointHistoryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            HealthCheckEndpointHistoryDTO healthCheckEndpointHistoryDTO = new HealthCheckEndpointHistoryDTO();
            healthCheckEndpointHistoryDTO.setId(rs.getLong("id"));
            healthCheckEndpointHistoryDTO.setHealthCheckpointId(rs.getLong("health_check_endpoint_id"));
            healthCheckEndpointHistoryDTO.setVendorName(rs.getString("vendorName"));
            healthCheckEndpointHistoryDTO.setEndpointName(rs.getString("endpointName"));
            healthCheckEndpointHistoryDTO.setCheckDate(rs.getTimestamp("check_date"));
            healthCheckEndpointHistoryDTO.setStatus(rs.getBoolean("status"));

            return healthCheckEndpointHistoryDTO;
        }
    }
}
