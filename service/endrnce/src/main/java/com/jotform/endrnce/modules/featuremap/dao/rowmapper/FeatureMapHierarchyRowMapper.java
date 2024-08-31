package com.jotform.endrnce.modules.featuremap.dao.rowmapper;

import com.jotform.endrnce.modules.featuremap.dao.dto.FeatureMapHierarchyDTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FeatureMapHierarchyRowMapper {

    public static class FeatureMapHierarchyDTOMapper implements RowMapper<FeatureMapHierarchyDTO> {

        @Override
        public FeatureMapHierarchyDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            FeatureMapHierarchyDTO hierarchyDTO = new FeatureMapHierarchyDTO();
            hierarchyDTO.setId(rs.getLong("id"));
            hierarchyDTO.setParentId(rs.getLong("parent_id"));
            hierarchyDTO.setName(rs.getString("name"));
            hierarchyDTO.setParentPath(rs.getString("parentPath"));
            hierarchyDTO.setStatus(rs.getBoolean("status"));

            return hierarchyDTO;
        }
    }
}
