package com.jotform.endrnce.modules.healthcheck.controller;

import com.jotform.endrnce.common.controller.SecuredRestController;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.constant.QueryConstants;
import com.jotform.endrnce.exception.ConflictException;
import com.jotform.endrnce.exception.ForbiddenException;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.healthcheck.dao.dto.*;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPoint;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEndPointStatusHistory;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckEnvironment;
import com.jotform.endrnce.modules.healthcheck.dao.entity.HealthCheckVendor;
import com.jotform.endrnce.modules.healthcheck.dao.repository.HealthCheckEndPointStatusHistoryRepository;
import com.jotform.endrnce.modules.healthcheck.service.HealthCheckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.HEALTHCHECK_PATH)
public class HealthCheckSecureController implements SecuredRestController {

    private final HealthCheckService healthCheckService;
    private final HealthCheckEndPointStatusHistoryRepository healthCheckEndPointStatusHistoryRepository;

    @Operation(
            summary = "Get Health Check Vendor",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Vendor Detail",
                            content = @Content(schema = @Schema(implementation = HealthCheckVendor.class)))
            })
    @GetMapping("/vendor/{vendorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public HealthCheckVendor getHealthCheckVendor(@PathVariable Long vendorId) {
        return healthCheckService.getHealthCheckVendor(vendorId);
    }

    @Operation(
            summary = "Get Vendor Query List",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Vendor Query List",
                            content = @Content(schema = @Schema(implementation = HealthCheckVendorDTO.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            })
    @ResponseBody
    @GetMapping("/vendor/query")
    @PreAuthorize("hasRole('ADMIN')")
    public QueryResponse<List<HealthCheckVendorDTO>> getVendorQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "name") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return healthCheckService.getVendorQuery(page, items_per_page, sort, order, search);
    }

    @Operation(
            summary = "Create a new Health Check Vendor",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Vendor created",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("/vendor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckVendor> createVendor(@Valid @RequestBody HealthCheckVendorDTO healthCheckVendorDTO) {
        HealthCheckVendor createdVendor = healthCheckService.createVendor(healthCheckVendorDTO);

        return new ResponseEntity<>(createdVendor, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update Health Check Vendor",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Vendor updated",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @PutMapping("/vendor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckVendor> updateVendor(@Valid @RequestBody HealthCheckVendorDTO healthCheckVendorDTO) {
        HealthCheckVendor updateVendor = healthCheckService.updateVendor(healthCheckVendorDTO);

        return new ResponseEntity<>(updateVendor, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete a Health Check Vendor By Vendor Id",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete Vendor By Id",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Conflict",
                    content = @Content(schema = @Schema(implementation = ConflictException.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "Vendor Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @ResponseBody
    @DeleteMapping("/vendor/{vendorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckVendor> deleteVendor(@PathVariable Long vendorId) {
        HealthCheckVendor healthCheckVendor = healthCheckService.deleteVendor(vendorId);

        return new ResponseEntity<>(healthCheckVendor, HttpStatus.OK);
    }

    @Operation(
            summary = "Get Vendor Endpoint Query List",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Vendor Query List",
                            content = @Content(schema = @Schema(implementation = HealthCheckEndpointQueryDTO.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            })
    @ResponseBody
    @GetMapping("/vendor/{vendorId}/endpoint/query")
    @PreAuthorize("hasRole('ADMIN')")
    public QueryResponse<List<HealthCheckEndpointQueryDTO>> getVendorEndpointQuery(
            @PathVariable Long vendorId,
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "hce.name") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return healthCheckService.getEndpointQuery(vendorId, page, items_per_page, sort, order, search);
    }

    @Operation(
            summary = "Get Health Check Endpoint",
            tags = {"HealthCheckController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Endpoint Detail",
                            content = @Content(schema = @Schema(implementation = HealthCheckEndPoint.class)))
            })
    @GetMapping("/endpoint/{endpointId}")
    @PreAuthorize("hasRole('ADMIN')")
    public HealthCheckEndPoint getHealthCheckEndpoint(@PathVariable Long endpointId) {
        return healthCheckService.getHealthCheckEndpoint(endpointId);
    }

    @Operation(
            summary = "Create a new endpoint of vendor",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Endpoint is created successfully",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("/endpoint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEndPoint> createEndpoint(@RequestBody HealthCheckEndPointDTO endPointDTO) {
        HealthCheckEndPoint healthCheckServiceEndpoint = healthCheckService.createEndpoint(endPointDTO);

        return new ResponseEntity<>(healthCheckServiceEndpoint, HttpStatus.OK);
    }

    @Operation(
            summary = "Update an endpoint of a vendor",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Endpoint is updated successfully",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @PutMapping("/endpoint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEndPoint> updateEndpoint(@Valid @RequestBody HealthCheckEndPointDTO endPointDTO) {
        HealthCheckEndPoint updatedEndpointDTO = healthCheckService.updateEndpoint(endPointDTO);

        return new ResponseEntity<>(updatedEndpointDTO, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete a Health Check Endpoint By Endpoint Id",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete Endpoint By Id",
                    content = @Content(schema = @Schema(implementation = HealthCheckEndPoint.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Endpoint Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @DeleteMapping("/endpoint/{endpointId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEndPoint> deleteEndpointAndHistory(@PathVariable Long endpointId) {
        HealthCheckEndPoint healthCheckEndPoint = healthCheckService.deleteEndpointAndHistory(endpointId);

        return new ResponseEntity<>(healthCheckEndPoint, HttpStatus.OK);
    }

    @Operation(
            summary = "Get Vendor Request History", 
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200", 
                    description = "Successfully retrieved history",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "401", 
                    description = "You are not authorized to view the resource",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "403", 
                    description = "Accessing the resource you were trying to reach is forbidden",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "The resource you were trying to reach is not found",
                    content = @Content(schema = @Schema(implementation = HealthCheckVendor.class))
            ),
    })
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HealthCheckEndPointStatusHistory>> getVendorRequestHistory(@RequestParam Long vendorId) {
        List<HealthCheckEndPointStatusHistory> historyList = healthCheckEndPointStatusHistoryRepository.findByHealthCheckEndPointId(vendorId);
        
        return new ResponseEntity<>(historyList, HttpStatus.OK);
    }

    @Operation(
            summary = "Get Environment By Id",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Environment Detail",
                            content = @Content(schema = @Schema(implementation = HealthCheckEnvironment.class)))
            })
    @GetMapping("/environment/{environmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public HealthCheckEnvironment getHealthCheckEnvironmentById(@PathVariable Long environmentId) {
        return healthCheckService.getHealthCheckEnvironmentById(environmentId);
    }

    @Operation(
            summary = "Get Environment Query List",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Environment List",
                            content = @Content(schema = @Schema(implementation = HealthCheckEndpointQueryDTO.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            })
    @ResponseBody
    @GetMapping("/environment/query")
    @PreAuthorize("hasRole('ADMIN')")
    public QueryResponse<List<HealthCheckEnvironmentQueryDTO>> getEnvironmentQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "environment_key") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return healthCheckService.getEnvironmentQuery(page, items_per_page, sort, order, search);
    }

    @Operation(
            summary = "Create a new Health Check Environment",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Vendor Environment created",
                    content = @Content(schema = @Schema(implementation = HealthCheckEnvironment.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("/environment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEnvironment> createEnvironment(@Valid @RequestBody HealthCheckEnvironmentDTO healthCheckEnvironmentDTO) {
        HealthCheckEnvironment createdEnvironment = healthCheckService.createEnvironment(healthCheckEnvironmentDTO);

        return new ResponseEntity<>(createdEnvironment, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update Health Check Environment",
            tags = {"HealthCheckSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Vendor Environment updated",
                    content = @Content(schema = @Schema(implementation = HealthCheckEnvironment.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @PutMapping("/environment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEnvironment> updateEnvironment(@Valid @RequestBody HealthCheckEnvironmentDTO healthCheckEnvironmentDTO) {
        HealthCheckEnvironment updateEnvironment = healthCheckService.updateEnvironment(healthCheckEnvironmentDTO);

        return new ResponseEntity<>(updateEnvironment, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete a Health Check Environment By Environment Id",
            tags = {"HealthCheckSecureController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete Environment By Id",
                    content = @Content(schema = @Schema(implementation = HealthCheckEnvironment.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Environment Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @DeleteMapping("/environment/{environmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HealthCheckEnvironment> deleteEnvironment(@PathVariable Long environmentId) {
        HealthCheckEnvironment healthCheckEnvironment = healthCheckService.deleteEnvironment(environmentId);

        return new ResponseEntity<>(healthCheckEnvironment, HttpStatus.OK);
    }
}