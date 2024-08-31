package com.jotform.endrnce.modules.cucumber.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jotform.endrnce.common.payload.response.BaseResponse;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.constant.QueryConstants;
import com.jotform.endrnce.exception.BadRequestException;
import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberChildrenDTO;
import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberRequestDTO;
import com.jotform.endrnce.modules.cucumber.dao.dto.CucumberTagsDTO;
import com.jotform.endrnce.modules.cucumber.dao.dto.HistoryRequestDTO;
import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberFeature;
import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberHistory;
import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberSteps;
import com.jotform.endrnce.modules.cucumber.dao.entity.CucumberTag;
import com.jotform.endrnce.modules.cucumber.service.CucumberService;
import com.jotform.endrnce.modules.user.dao.dto.UserDTO;
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
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.CUCUMBER_PATH)
public class CucumberController {

    private final CucumberService cucumberService;

    @Operation(
            summary = "Insert cucumber schema",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Inserted bulk data",
                            content = @Content(schema = @Schema(implementation = ResponseEntity.class))),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Schema is not suitable",
                            content = @Content(schema = @Schema(implementation = BadRequestException.class))),
            })
    @PostMapping("/bulk-insert")
    public ResponseEntity<BaseResponse> insertBulkCucumberData(@Valid @RequestBody List<CucumberRequestDTO> cucumberRequestDTOList) {
        try {
            cucumberService.insertBulkCucumberData(cucumberRequestDTOList);

            return new ResponseEntity<>(new BaseResponse(200, "success"), HttpStatus.CREATED);
        } catch (Exception ex) {
            log.error(ex.toString());
            return new ResponseEntity<>(new BaseResponse(HttpStatus.BAD_REQUEST.value(), ex.toString()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            summary = "Get Test Case Query List",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Cucumber List",
                            content = @Content(schema = @Schema(implementation = UserDTO.class)))
            })
    @GetMapping("/query")
    public QueryResponse<List<CucumberChildrenDTO>> getTestCaseQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "name") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "filter_tags") Optional<String> optionalTags,
            @RequestParam(value = "search") Optional<String> optionalSearch,
            @RequestParam(value = "filter_featureId") Optional<Integer> optionalFeatureId,
            @RequestParam Optional<Boolean> isEnterprise,
            @RequestParam Optional<Boolean> isExcludeEnterpriseBsg,
            @RequestParam Optional<Boolean> isBsgOnly,
            @RequestParam Optional<Boolean> isEeproducttest,
            @RequestParam Optional<Boolean> isRegression
    ) throws JsonProcessingException {
        String tags = optionalTags.orElse("");
        String search = optionalSearch.orElse("");
        Integer featureId = optionalFeatureId.orElse(0);

        return cucumberService.getTestCaseQuery(page, items_per_page, sort, order, tags, search, featureId,
                isEnterprise.orElse(false), isExcludeEnterpriseBsg.orElse(false),
                    isBsgOnly.orElse(false), isEeproducttest.orElse(false), isRegression.orElse(false));
    }

    @Operation(
            summary = "Get Tags List",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Tags List",
                            content = @Content(schema = @Schema(implementation = CucumberTag.class)))
            })
    @GetMapping("/tags")
    public List<CucumberTagsDTO> getTags(@RequestParam Optional<Boolean> isEnterprise) {
        return cucumberService.getTags(isEnterprise.orElse(false));
    }

    @GetMapping("/tags/popular-top5")
    public List<CucumberTagsDTO> getPopularTagsTop5(@RequestParam Optional<Boolean> isEnterprise,
                                                    @RequestParam Optional<Boolean> isExcludeEnterpriseBsg,
                                                    @RequestParam Optional<Boolean> isBsgOnly) {
        return cucumberService.getPopularTagsTop5(isEnterprise.orElse(false), isExcludeEnterpriseBsg.orElse(false), isBsgOnly.orElse(false));
    }

    @Operation(
            summary = "Get Scenarios",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Scenarios",
                            content = @Content(schema = @Schema(implementation = CucumberChildrenDTO.class)))
            })
    @ResponseBody
    @GetMapping("/scenario")
    public List<CucumberChildrenDTO> getScenarios(@RequestParam Optional<Boolean> isEnterprise) throws JsonProcessingException {
        return cucumberService.getScenarios(isEnterprise.orElse(false));
    }

    @Operation(
            summary = "Get Test Steps",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Test Steps",
                            content = @Content(schema = @Schema(implementation = CucumberSteps.class)))
            })
    @GetMapping("/scenario/{scenarioId}/test-steps")
    public List<CucumberSteps> getTestSteps(@PathVariable("scenarioId") Long scenarioId) {
        return cucumberService.getTestSteps(scenarioId);
    }

    @Operation(
            summary = "Get Number of Test Steps",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Number of Test Steps",
                            content = @Content(schema = @Schema(implementation = ResponseEntity.class)))
            })
    @ResponseBody
    @GetMapping("/scenario/test-steps/count")

    public ResponseEntity<BaseResponse> getTotalNumberOfSteps(@RequestParam Optional<Boolean> isEnterprise) {
        Long count = cucumberService.getTotalNumberOfSteps(isEnterprise.orElse(false));


        return new ResponseEntity<>(new BaseResponse(200, String.valueOf(count)), HttpStatus.OK);
    }

    @Operation(
            summary = "Get Features",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Features",
                            content = @Content(schema = @Schema(implementation = CucumberFeature.class)))
            })
    @GetMapping("/feature")
    public List<CucumberFeature> getFeatures(@RequestParam Optional<Boolean> isEnterprise,
                                             @RequestParam Optional<Boolean> isExcludeEnterpriseBsg,
                                             @RequestParam Optional<Boolean> isBsgOnly,
                                             @RequestParam Optional<Boolean> isEeproducttest,
                                             @RequestParam Optional<Boolean> isRegression
    ) {
        return cucumberService.getFeatures(isEnterprise.orElse(false), isExcludeEnterpriseBsg.orElse(false),
                isBsgOnly.orElse(false), isEeproducttest.orElse(false), isRegression.orElse(false));
    }

    @Operation(
            summary = "Get History",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "History",
                            content = @Content(schema = @Schema(implementation = CucumberHistory.class)))
            })
    @ResponseBody
    @GetMapping("/history")
    public List<CucumberHistory> getHistory() {
        return cucumberService.getHistory();
    }

    @Operation(
            summary = "Delete History By Id",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Delete History By Id",
                            content = @Content(schema = @Schema(implementation = CucumberHistory.class)))
            })
    @ResponseBody
    @DeleteMapping("/history/{historyId}")
    public ResponseEntity<BaseResponse> deleteHistory(@PathVariable Long historyId) {
        cucumberService.deleteHistory(historyId);

        return new ResponseEntity<>(new BaseResponse(200, String.format("%d history deleted", historyId)), HttpStatus.OK);
    }

    @Operation(
            summary = "Insert History",
            description = "",
            tags = {"CucumberController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Insert History",
                            content = @Content(schema = @Schema(implementation = CucumberHistory.class)))
            })
    @ResponseBody
    @PostMapping("/history")
    public ResponseEntity<BaseResponse> insertHistory(@Valid @RequestBody HistoryRequestDTO historyRequest) {
        cucumberService.insertHistory(historyRequest);

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        return new ResponseEntity<>(new BaseResponse(201, String.format("%s is inserted", formatter.format(historyRequest.addingDate))), HttpStatus.CREATED);
    }
}