package com.jotform.endrnce.modules.featuremap.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.modules.featuremap.dao.dto.FeatureMapHierarchyDTO;
import com.jotform.endrnce.modules.featuremap.dao.entity.FeatureMap;
import com.jotform.endrnce.modules.featuremap.service.FeatureMapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.FEATURE_MAP_PATH)
public class FeatureMapController {

    private final FeatureMapService featureMapService;

    @Operation(
            summary = "Get Integrating Feature Map Hierarchy List",
            tags = {"FeatureMapController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Feature Map Hierarchy",
                            content = @Content(schema = @Schema(implementation = FeatureMap.class)))
            })
    @GetMapping("/hierarchy")
    public List<FeatureMapHierarchyDTO> getFeatureMapHierarchyList() throws JsonProcessingException {
        return featureMapService.getFeatureMapHierarchyList();
    }
}