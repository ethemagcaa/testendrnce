package com.jotform.endrnce.modules.healthcheck.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.common.httpclient.HttpClient;
import com.jotform.endrnce.common.httpclient.model.HttpModel;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.healthcheck.dao.dto.*;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPoint;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPointStatusHistory;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEnvironment;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckVendor;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckEndPointRepository;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckEndPointStatusHistoryRepository;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckEnvironmentRepository;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckVendorRepository;
import com.jotform.endrnce.modules.healthcheck.dao.rowmapper.*;
import com.jotform.endrnce.modules.healthcheck.service.helper.SendRequestVendorHelper;
import io.restassured.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class HealthCheckService extends HttpClient {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final HealthCheckVendorRepository healthCheckVendorRepository;
    private final HealthCheckEndPointRepository healthCheckEndPointRepository;
    private final HealthCheckEndPointStatusHistoryRepository healthCheckEndPointStatusHistoryRepository;
    private final HealthCheckEnvironmentRepository healthCheckEnvironmentRepository;

    public List<HealthCheckVendor> getHealthCheckVendorList() {
        return healthCheckVendorRepository.findAll();
    }

    public HealthCheckVendor getHealthCheckVendor(Long vendorId) {
        return healthCheckVendorRepository.findById(vendorId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Vendor with id %d is not found", vendorId)));
    }

    public List<HealthCheckEndPoint> getHealthCheckEndPointByVendorId(Long vendorId) {
        return healthCheckEndPointRepository.findByHealthCheckVendorId(vendorId);
    }

    @Transactional
    public HealthCheckVendor createVendor(HealthCheckVendorDTO healthCheckVendorDTO) {
        ModelMapper modelMapper = new ModelMapper();
        HealthCheckVendor vendor = modelMapper.map(healthCheckVendorDTO, HealthCheckVendor.class);
        
        return healthCheckVendorRepository.save(vendor);
    }

    @Transactional
    public HealthCheckVendor updateVendor(HealthCheckVendorDTO vendorDTO) {
        if(ObjectUtils.isEmpty(vendorDTO.getId()) || healthCheckVendorRepository.findById(vendorDTO.getId()).isEmpty()) {
            throw new NotFoundRequestException("Vendor is not found!");
        }

        ModelMapper modelMapper = new ModelMapper();
        HealthCheckVendor vendor = modelMapper.map(vendorDTO, HealthCheckVendor.class);

        return healthCheckVendorRepository.save(vendor);
    }

    public QueryResponse<List<HealthCheckVendorDTO>> getVendorQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (id LIKE :search OR name LIKE :search OR url LIKE :search OR period LIKE :search OR status LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountVendorQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectVendorQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<HealthCheckVendorDTO> healthCheckVendorList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new HealthCheckVendorRowMapper.HealthCheckVendorDTOMapper()
        );

        return QueryResponse.<List<HealthCheckVendorDTO>>builder()
                .data(healthCheckVendorList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    @Transactional
    public HealthCheckVendor deleteVendor(Long vendorId) {
        HealthCheckVendor vendor = healthCheckVendorRepository.findById(vendorId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Vendor with id %d is not found", vendorId)));
        healthCheckVendorRepository.delete(vendor);

        return vendor;
    }

    public QueryResponse<List<HealthCheckEndpointQueryDTO>> getEndpointQuery(
            Long vendorId,
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (id LIKE :search OR name LIKE :search OR path LIKE :search OR period LIKE :search OR status LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountEndpointQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("vendorId", vendorId);
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectEndpointQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("vendorId", vendorId);
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<HealthCheckEndpointQueryDTO> healthCheckEndpointQueryDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new HealthCheckEndpointRowMapper.HealthCheckEndpointDTOMapper()
        );

        return QueryResponse.<List<HealthCheckEndpointQueryDTO>>builder()
                .data(healthCheckEndpointQueryDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    public HealthCheckEndPoint getHealthCheckEndpoint(Long endpointId) {
        return healthCheckEndPointRepository.findById(endpointId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Endpoint with id %d is not found", endpointId)));
    }

    @Transactional
    public HealthCheckEndPoint createEndpoint(HealthCheckEndPointDTO endPointDTO) {
        ModelMapper modelMapper = new ModelMapper();
        HealthCheckEndPoint endPoint = modelMapper.map(endPointDTO, HealthCheckEndPoint.class);

        return healthCheckEndPointRepository.save(endPoint);
    }

    @Transactional
    public HealthCheckEndPoint updateEndpoint(HealthCheckEndPointDTO endPointDTO) {
        if (ObjectUtils.isEmpty(endPointDTO.getId()) || healthCheckEndPointRepository.findById(endPointDTO.getId()).isEmpty()) {
            throw new NotFoundRequestException("Endpoint is not found!");
        }

        HealthCheckEndPoint endPoint = new ModelMapper().map(endPointDTO, HealthCheckEndPoint.class);

        return healthCheckEndPointRepository.save(endPoint);
    }

    @Transactional
    public HealthCheckEndPoint deleteEndpointAndHistory(Long endpointId) {
        healthCheckEndPointStatusHistoryRepository.deleteByHealthCheckEndPointId(endpointId);

        HealthCheckEndPoint endpoint = healthCheckEndPointRepository.findById(endpointId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Endpoint with id %d is not found", endpointId)));
        healthCheckEndPointRepository.delete(endpoint);

        return endpoint;
    }

    public QueryResponse<List<HealthCheckEndpointHistoryDTO>> getVendorEndpointHistoryQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (hcv.name LIKE :search OR hce.name LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountEndPointHistoryQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectEndPointHistoryQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<HealthCheckEndpointHistoryDTO> healthCheckEndpointHistoryDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new HealthCheckEndpointHistoryRowMapper.HealthCheckEndpointHistoryDTOMapper()
        );

        return QueryResponse.<List<HealthCheckEndpointHistoryDTO>>builder()
                .data(healthCheckEndpointHistoryDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    public HealthCheckEndPointStatusHistory createEndpointStatusHistory(HealthCheckEndPointStatusHistory endpointStatusHistory) {
        return healthCheckEndPointStatusHistoryRepository.save(endpointStatusHistory);
    }

    public void sendRequestVendor(Long vendorId) throws JsonProcessingException, ParseException {
        this.callEndPointOfVendors(Optional.ofNullable(vendorId));
    }

    public void callEndPointOfVendors() throws JsonProcessingException, ParseException {
        this.callEndPointOfVendors(Optional.ofNullable(null));
    }

    public void callEndPointOfVendors(Optional<Long> vendorId) throws JsonProcessingException, ParseException {
        SendRequestVendorHelper sendRequestVendorHelper = new SendRequestVendorHelper(healthCheckEnvironmentRepository);

        String sql = DaoUtil.getQuery("selectActiveEndpointsOfVendor");
        sql = sql.replace("{WHERE}", vendorId.isPresent() ? " AND hcv.id= :vendorId" : "");

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:00");
        Date now = formatter.parse(formatter.format(new Date()));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("nextRunTime", now);
        vendorId.ifPresent(id -> mapSqlParameterSource.addValue("vendorId", id));

        List<HealthCheckActiveEndPointDTO> healthCheckActiveEndPointDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new HealthCheckActiveEndpointRowMapper.HealthCheckActiveEndpointDTOMapper()
        );

        for (HealthCheckActiveEndPointDTO endPointDTO : healthCheckActiveEndPointDTOList) {
            Map<String, String> headers = new HashMap<>();
            if(ObjectUtils.isNotEmpty(endPointDTO.getRequestHeader())) {
                String requestHeaderJson = endPointDTO.getRequestHeader().replaceAll("\\n", "");
                requestHeaderJson = sendRequestVendorHelper.replaceDynamicData(endPointDTO, requestHeaderJson);
                headers = sendRequestVendorHelper.parseJsonHeader(requestHeaderJson);
            }

            HttpModel httpModel = HttpModel.builder()
                    .requestBaseUri(endPointDTO.getVendorUrl())
                    .requestPath(sendRequestVendorHelper.replaceDynamicData(endPointDTO, endPointDTO.getPath()))
                    .requestHeaders(headers)
                    .build();

            if (ObjectUtils.isNotEmpty(endPointDTO.getRequestPayload())) {
                endPointDTO.setRequestPayload(sendRequestVendorHelper.replaceDynamicData(endPointDTO, endPointDTO.getRequestPayload()));
                httpModel.setRequestBody(endPointDTO.getRequestPayload());
            }

            try {
                Response response = switch (endPointDTO.getRequestType()) {
                    default -> get(httpModel);
                    case "POST" -> post(httpModel);
                    case "PUT" -> put(httpModel);
                    case "DELETE" -> delete(httpModel);
                };

                log.info("Response code: {}", response.getStatusCode());
                log.info("Response body: {}", response.getBody().asString());

                HealthCheckEndPointStatusHistory endpointStatusHistory = new HealthCheckEndPointStatusHistory();
                endpointStatusHistory.setHealthCheckEndPointId(endPointDTO.getId());
                endpointStatusHistory.setCheckDate(now);
                endpointStatusHistory.setStatus(!(response.getStatusCode() >= 400));
                this.createEndpointStatusHistory(endpointStatusHistory);

                Optional<HealthCheckEndPoint> healthCheckEndPoint = healthCheckEndPointRepository.findById(endPointDTO.getId());
                if(healthCheckEndPoint.isPresent()) {
                    HealthCheckEndPoint updateEndPoint = healthCheckEndPoint.get();

                    // Date nextRunTimeNew = new Date(endpointStatusHistory.getCheckDate().plusSeconds(endPoint.getPeriod()));
                    updateEndPoint.setNextRunTime(new Date(endpointStatusHistory.getCheckDate().getTime() + endPointDTO.getPeriod()));
                    healthCheckEndPointRepository.save(updateEndPoint);
                }
            } catch (Exception e) {
                log.error("Error occurred while sending request for endpoint with id {}: {}", endPointDTO.getId(), e.getMessage());
            }
        }
    }

    public HealthCheckEnvironment getHealthCheckEnvironmentById(Long environmentId) {
        return healthCheckEnvironmentRepository.findById(environmentId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Vendor with id %d is not found", environmentId)));
    }

    public QueryResponse<List<HealthCheckEnvironmentQueryDTO>> getEnvironmentQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (id LIKE :search OR environment_key LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountEnvironmentQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectEnvironmentQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<HealthCheckEnvironmentQueryDTO> healthCheckEndpointQueryDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new HealthCheckEnvironmentRowMapper.HealthCheckEnvironmentDTOMapper()
        );

        return QueryResponse.<List<HealthCheckEnvironmentQueryDTO>>builder()
                .data(healthCheckEndpointQueryDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    @Transactional
    public HealthCheckEnvironment createEnvironment(HealthCheckEnvironmentDTO healthCheckEnvironmentDTO) {
        ModelMapper modelMapper = new ModelMapper();
        HealthCheckEnvironment environment = modelMapper.map(healthCheckEnvironmentDTO, HealthCheckEnvironment.class);

        return healthCheckEnvironmentRepository.save(environment);
    }

    @Transactional
    public HealthCheckEnvironment updateEnvironment(HealthCheckEnvironmentDTO healthCheckEnvironmentDTO) {
        if(ObjectUtils.isEmpty(healthCheckEnvironmentDTO.getId()) || healthCheckEnvironmentRepository.findById(healthCheckEnvironmentDTO.getId()).isEmpty()) {
            throw new NotFoundRequestException("Environment is not found!");
        }

        ModelMapper modelMapper = new ModelMapper();
        HealthCheckEnvironment environment = modelMapper.map(healthCheckEnvironmentDTO, HealthCheckEnvironment.class);

        return healthCheckEnvironmentRepository.save(environment);
    }

    @Transactional
    public HealthCheckEnvironment deleteEnvironment(Long environmentId) {
        HealthCheckEnvironment environment = healthCheckEnvironmentRepository.findById(environmentId)
                .orElseThrow(() -> new NotFoundRequestException(String.format("Environment with id %d is not found", environmentId)));
        healthCheckEnvironmentRepository.delete(environment);

        return environment;
    }

}