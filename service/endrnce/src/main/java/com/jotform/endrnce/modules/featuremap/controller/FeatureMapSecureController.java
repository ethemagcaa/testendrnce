package com.jotform.endrnce.modules.featuremap.controller;

import com.jotform.endrnce.common.controller.SecuredRestController;
import com.jotform.endrnce.common.payload.response.BaseResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.exception.ForbiddenException;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.featuremap.dao.dto.FeatureMapDTO;
import com.jotform.endrnce.modules.featuremap.dao.entity.FeatureMap;
import com.jotform.endrnce.modules.featuremap.service.FeatureMapService;
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

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.FEATURE_MAP_PATH)
public class FeatureMapSecureController implements SecuredRestController {

    private final FeatureMapService featureMapService;

    @Operation(
            summary = "Get Feature Map List",
            tags = {"FeatureMapSecureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Feature Map List",
                            content = @Content(schema = @Schema(implementation = FeatureMap.class)))
            })
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeatureMap> getFeatureMapList() {
        return featureMapService.getFeatureMapList();
    }

    @Operation(
            summary = "Create a new Feature Map",
            tags = {"FeatureMapSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Feature Map created",
                    content = @Content(schema = @Schema(implementation = FeatureMap.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureMap> createFeatureMap(@Valid @RequestBody FeatureMapDTO featureMapDTO) {
        FeatureMap featureMap = featureMapService.createFeatureMap(featureMapDTO);

        return new ResponseEntity<>(featureMap, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update Feature Map",
            tags = {"FeatureMapSecureController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Feature Map updated",
                    content = @Content(schema = @Schema(implementation = FeatureMap.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @PutMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureMap> updateFeatureMap(@Valid @RequestBody FeatureMapDTO featureMapDTO) {
        FeatureMap updateVendor = featureMapService.updateFeatureMap(featureMapDTO);

        return new ResponseEntity<>(updateVendor, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete a Feature Map By Id",
            tags = {"FeatureMapSecureController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete Feature Map By Id",
                    content = @Content(schema = @Schema(implementation = FeatureMap.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Feature Map Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @ResponseBody
    @DeleteMapping("/{featureMapId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse> deleteFeatureMap(@PathVariable Long featureMapId) {
        featureMapService.deleteFeatureMap(featureMapId);

        return ResponseEntity.ok(new BaseResponse(HttpStatus.OK.value(), String.format("Feature Map with id %d deleted", featureMapId)));
    }

}