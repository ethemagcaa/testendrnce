package com.jotform.endrnce.modules.role.service;

import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.role.dao.dto.RoleQueryDTO;
import com.jotform.endrnce.modules.role.dao.dto.RoleRequestDTO;
import com.jotform.endrnce.modules.role.dao.entity.Role;
import com.jotform.endrnce.modules.role.dao.repository.RoleRepository;
import com.jotform.endrnce.modules.role.dao.rowmapper.RoleRowMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class RoleService {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private final RoleRepository roleRepository;

    public QueryResponse<List<RoleQueryDTO>> getRoleQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (name LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountRoleQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectRoleQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<RoleQueryDTO> roleQueryDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new RoleRowMapper.RoleDTOMapper()
        );

        return QueryResponse.<List<RoleQueryDTO>>builder()
                .data(roleQueryDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    public Role getRoleById(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new NotFoundRequestException("Role not found"));
    }

    @Transactional
    public Role createRole(RoleRequestDTO roleRequestDTO) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        Role role = modelMapper.map(roleRequestDTO, Role.class);

        roleRepository.save(role);

        return role;
    }

    public Role updateRole(RoleRequestDTO roleUpdateRequestDTO) {
        Optional<Role> roleOptional = roleRepository.findById(roleUpdateRequestDTO.getId());
        if (ObjectUtils.isEmpty(roleUpdateRequestDTO.getId()) || roleOptional.isEmpty()) {
            throw new NotFoundRequestException("Role is not found!");
        }

        Role role = roleOptional.get();
        role.setName(roleUpdateRequestDTO.getName());

        roleRepository.save(role);

        return role;
    }

    public Role deleteRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new NotFoundRequestException("Role is not found"));
        roleRepository.delete(role);

        return role;
    }
}
