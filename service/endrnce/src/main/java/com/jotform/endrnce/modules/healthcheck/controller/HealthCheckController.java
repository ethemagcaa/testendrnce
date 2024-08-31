package com.jotform.endrnce.modules.healthcheck.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.common.httpclient.model.HttpModel;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.constant.QueryConstants;
import com.jotform.endrnce.exception.ForbiddenException;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckEndpointHistoryDTO;
import com.jotform.endrnce.modules.healthcheck.dao.dto.HealthCheckVendorDTO;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPoint;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckVendor;
import com.jotform.endrnce.modules.healthcheck.service.HealthCheckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.HEALTHCHECK_PATH)
public class HealthCheckController {

    private final HealthCheckService healthCheckService;

    @Operation(
            summary = "Get Health Check Vendor List",
            tags = {"HealthCheckController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Vendor List",
                            content = @Content(schema = @Schema(implementation = HealthCheckVendor.class)))
            })
    @GetMapping("/vendor")
    public List<HealthCheckVendor> getHealthCheckVendors() {
        return healthCheckService.getHealthCheckVendorList();
    }

    @Operation(
            summary = "Get Health Check End Point List By Vendor Id",
            tags = {"HealthCheckController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "End Point of Vendor List",
                            content = @Content(schema = @Schema(implementation = HealthCheckEndPoint.class)))
            })
    @GetMapping("/vendor/{vendorId}/endpoint")
    public List<HealthCheckEndPoint> getHealthCheckEndPointByVendorId(@PathVariable Long vendorId) {
        return healthCheckService.getHealthCheckEndPointByVendorId(vendorId);
    }

    @Operation(
            summary = "Get Vendor Endpoint History Query List",
            tags = {"HealthCheckController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Vendor Endpoint History List",
                            content = @Content(schema = @Schema(implementation = HealthCheckVendorDTO.class)))
            })
    @ResponseBody
    @GetMapping("/history/query")
    public QueryResponse<List<HealthCheckEndpointHistoryDTO>> getVendorEndpointHistoryQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = "500") int items_per_page,
            @RequestParam(value = "sort", defaultValue = "hcesh.check_date") String sort,
            @RequestParam(value = "order", defaultValue = "DESC") String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return healthCheckService.getVendorEndpointHistoryQuery(page, items_per_page, sort, order, search);
    }

    @Operation(
            summary = "Sending request for vendor endpoints",
            tags = {"HealthCheckController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Request sent for vendor endpoint",
                            content = @Content(schema = @Schema(implementation = HttpModel.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Vendor Not Found",
                            content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
            })
    @GetMapping("/send-request-vendor/{vendorId}")
    public ResponseEntity<Void> sendRequestVendor(@PathVariable Long vendorId) throws JsonProcessingException, ParseException {
        healthCheckService.sendRequestVendor(vendorId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/wait-ten-seconds")
    public String test() throws InterruptedException {
        Thread.sleep(10000);

        return "Wait 10 seconds";
    }
}