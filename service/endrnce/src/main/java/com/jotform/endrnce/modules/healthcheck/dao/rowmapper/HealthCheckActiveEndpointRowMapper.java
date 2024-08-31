package com.jotform.endrnce.modules.healthcheck.dao.rowmapper;

import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckActiveEndPointDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HealthCheckActiveEndpointRowMapper {

    public static class HealthCheckActiveEndpointDTOMapper implements RowMapper<HealthCheckActiveEndPointDTO> {

        @Override
        public HealthCheckActiveEndPointDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            HealthCheckActiveEndPointDTO healthCheckActiveEndpointRow = new HealthCheckActiveEndPointDTO();
            healthCheckActiveEndpointRow.setId(rs.getLong("id"));
            healthCheckActiveEndpointRow.setName(rs.getString("name"));
            healthCheckActiveEndpointRow.setPeriod(rs.getInt("period"));
            healthCheckActiveEndpointRow.setVendorUrl(rs.getString("vendorUrl"));
            healthCheckActiveEndpointRow.setPath(rs.getString("path"));
            healthCheckActiveEndpointRow.setRequestType(rs.getString("request_type"));
            healthCheckActiveEndpointRow.setRequestHeader(rs.getString("request_header"));
            healthCheckActiveEndpointRow.setRequestPayload(rs.getString("request_payload"));
            healthCheckActiveEndpointRow.setNextRunTime(rs.getTimestamp("next_run_time"));

            healthCheckActiveEndpointRow.setVendorId(rs.getLong("vendorId"));

            return healthCheckActiveEndpointRow;
        }
    }
}
