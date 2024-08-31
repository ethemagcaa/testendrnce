package com.jotform.endrnce.modules.allure.controller;

import com.jotform.endrnce.common.payload.response.BaseResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.exception.BadRequestException;
import com.jotform.endrnce.modules.allure.dao.dto.AllureCiDTO;
import com.jotform.endrnce.modules.allure.dao.dto.AllureRequestDTO;
import com.jotform.endrnce.modules.allure.dao.dto.AllureSuiteDTO;
import com.jotform.endrnce.modules.allure.dao.entity.AllureEnvironment;
import com.jotform.endrnce.modules.allure.dao.entity.AllureSuiteEnvironment;
import com.jotform.endrnce.modules.allure.service.AllureService;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.ALLURE_PATH)
public class AllureController {
    private final AllureService allureService;

    @Operation(
            summary = "Insert allure result schema",
            description = "",
            tags = {"AllureController"},
            externalDocs = @ExternalDocumentation(description = "Read This For Sure", url = "https://allurereport.org/docs/how-it-works/test-result-file/"))
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
    public ResponseEntity<BaseResponse> insertBulkCucumberData(@Valid @RequestBody AllureRequestDTO allureRequestDTO) {
        try {
            allureService.insertBulkAllureData(allureRequestDTO);

            return new ResponseEntity<>(new BaseResponse(HttpStatus.OK.value(), "success"), HttpStatus.CREATED);
        } catch (Exception ex) {
            log.error(ex.toString());
            return new ResponseEntity<>(new BaseResponse(HttpStatus.BAD_REQUEST.value(), ex.toString()), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            summary = "Get Allure Environment List",
            description = "",
            tags = {"AllureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Environment List",
                            content = @Content(schema = @Schema(implementation = AllureEnvironment.class)))
            })
    @GetMapping("/environment")
    public List<AllureEnvironment> getEnvironmentList() {
        return allureService.getEnvironmentList();
    }

    @Operation(
            summary = "Get Allure Ci List",
            description = "",
            tags = {"AllureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Ci List",
                            content = @Content(schema = @Schema(implementation = AllureCiDTO.class)))
            })
    @GetMapping("/ci")
    public List<AllureCiDTO> getCiList(@NotNull @RequestParam Long environmentId) {
        return allureService.getCiListByEnvironmentId(environmentId);
    }

    @Operation(
            summary = "Get Allure Suite List",
            description = "",
            tags = {"AllureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Suite List",
                            content = @Content(schema = @Schema(implementation = AllureSuiteDTO.class)))
            })
    @GetMapping("/suite")
    public List<AllureSuiteDTO> getSuiteListByEnvironmentIdNCi(@NotNull @RequestParam Long environmentId,
                                                               @RequestParam Optional<Long> ciId,
                                                               @RequestParam Optional<Long> suiteId) {
        Long ciIdOptional = ciId.orElse(0L);
        Long suiteIdOptional = suiteId.orElse(0L);

        return allureService.getSuiteListByEnvironmentIdNCi(environmentId, ciIdOptional, suiteIdOptional);
    }

    @Operation(
            summary = "Get Allure Suite Environment List",
            description = "",
            tags = {"AllureController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Suite Environment List",
                            content = @Content(schema = @Schema(implementation = AllureSuiteDTO.class)))
            })
    @GetMapping("/suite-environment")
    public List<AllureSuiteEnvironment> getSuiteEnvironmentListBySuiteId(@NotNull @RequestParam Long suiteId) {
        return allureService.getSuiteEnvironmentListBySuiteId(suiteId);
    }
}