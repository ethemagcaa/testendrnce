package com.jotform.endrnce.modules.allure.service;

import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.modules.allure.dao.dto.AllureCiDTO;
import com.jotform.endrnce.modules.allure.dao.dto.AllureRequestDTO;
import com.jotform.endrnce.modules.allure.dao.dto.AllureSuiteDTO;
import com.jotform.endrnce.modules.allure.dao.entity.*;
import com.jotform.endrnce.modules.allure.dao.repository.*;
import com.jotform.endrnce.modules.allure.dao.rowmapper.AllureCiRowMapper;
import com.jotform.endrnce.modules.allure.dao.rowmapper.AllureSuiteRowMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class AllureService {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private final AllureEnvironmentRepository allureEnvironmentRepository;
    private final AllureStatusRepository allureStatusRepository;
    private final AllureSuiteRepository allureSuiteRepository;
    private final AllureTestCaseRepository allureTestCaseRepository;
    private final AllureTestCaseLinkRepository allureTestCaseLinkRepository;
    private final AllureTestCaseAttachmentRepository allureTestCaseAttachmentRepository;
    private final AllureTestCaseParameterRepository allureTestCaseParameterRepository;
    private final AllureTestCaseStatusDetailRepository allureTestCaseStatusDetailRepository;
    private final AllureTestCaseLabelRepository allureTestCaseLabelRepository;
    private final AllureTestCaseStepRepository allureTestCaseStepRepository;
    private final AllureTestCaseStepAttachmentRepository allureTestCaseStepAttachmentRepository;
    private final AllureTestCaseStepParameterRepository allureTestCaseStepParameterRepository;
    private final AllureTestCaseStepStatusDetailRepository allureTestCaseStepStatusDetailRepository;
    private final AllureCiRepository allureCiRepository;
    private final AllureSuiteEnvironmentRepository allureSuiteEnvironmentRepository;

    @Transactional
    public void insertBulkAllureData(@NotNull AllureRequestDTO allureRequestDTO) {
        AllureEnvironment allureEnvironment = allureEnvironmentRepository.findByNameEqualsIgnoreCase(allureRequestDTO.getEnvironment());
        if(ObjectUtils.isEmpty(allureEnvironment)) {
            allureEnvironment = AllureEnvironment.builder()
                    .name(allureRequestDTO.getEnvironment())
                    .build();
            allureEnvironmentRepository.save(allureEnvironment);
        }

        AllureCi allureCi = allureCiRepository.findByJobNameEqualsIgnoreCase(allureRequestDTO.getAllureCi().jobName);
        if(ObjectUtils.isEmpty(allureCi)) {
            if(ObjectUtils.isNotEmpty(allureRequestDTO.getAllureCi().jobName)) {
                allureCi = AllureCi.builder()
                        .jobName(allureRequestDTO.getAllureCi().jobName)
                        .jobUrl(allureRequestDTO.getAllureCi().jobUrl)
                        .build();

                allureCiRepository.save(allureCi);
            }
        }

        AllureSuite allureSuite = AllureSuite.builder()
                .name(allureRequestDTO.getSuiteName())
                .allureEnvironmentId(allureEnvironment.getId())
                .allureCiId(ObjectUtils.isEmpty(allureCi) ? null : allureCi.getId())
                .failed(allureRequestDTO.getFailed())
                .broken(allureRequestDTO.getBroken())
                .skipped(allureRequestDTO.getSkipped())
                .passed(allureRequestDTO.getPassed())
                .unknown(allureRequestDTO.getUnknown())
                .total(allureRequestDTO.getTotal())
                .start(allureRequestDTO.getStart())
                .stop(allureRequestDTO.getStop())
                .duration(allureRequestDTO.getDuration())
                .minDuration(allureRequestDTO.getMinDuration())
                .maxDuration(allureRequestDTO.getMaxDuration())
                .sumDuration(allureRequestDTO.getSumDuration())
                .jobBuildNumber(allureRequestDTO.getJobBuildNumber())
                .jobBuildUrl(allureRequestDTO.getJobBuildUrl())
                .build();
        allureSuiteRepository.save(allureSuite);

        for (AllureRequestDTO.AllureSuiteEnvironment allureSuiteEnv: allureRequestDTO.getAllureSuiteEnvironment()) {
            AllureSuiteEnvironment allureSuiteEnvironment = AllureSuiteEnvironment.builder()
                    .allureSuiteId(allureSuite.getId())
                    .name(allureSuiteEnv.name)
                    .value(new Gson().toJson(allureSuiteEnv.values))
                    .build();
            allureSuiteEnvironmentRepository.save(allureSuiteEnvironment);
        }

        for (AllureRequestDTO.AllureResult allureResult: allureRequestDTO.getAllureResults()) {
            AllureTestCase allureTestCase = AllureTestCase.builder()
                    .allureSuiteId(allureSuite.getId())
                    .testCaseId(allureResult.testCaseId)
                    .uuid(allureResult.uuid)
                    .historyId(allureResult.historyId)
                    .testCaseId(allureResult.testCaseId)
                    .fullName(allureResult.fullName)
                    .name(allureResult.name)
                    .allureStatusId(allureStatusRepository.findByNameEqualsIgnoreCase(allureResult.status).getId())
                    .start(allureResult.start)
                    .stop(allureResult.stop)
                    .build();
            allureTestCaseRepository.save(allureTestCase);

            for (AllureRequestDTO.Link link: allureResult.links) {
                AllureTestCaseLink allureTestCaseLink = AllureTestCaseLink.builder()
                        .allureTestCaseId(allureTestCase.getId())
                        .name(link.name)
                        .url(link.url)
                        .type(link.type)
                        .build();
                allureTestCaseLinkRepository.save(allureTestCaseLink);
            }

            for (AllureRequestDTO.Attachment attachment: allureResult.attachments) {
                AllureTestCaseAttachment allureTestCaseAttachment = AllureTestCaseAttachment.builder()
                        .allureTestCaseId(allureTestCase.getId())
                        .name(attachment.name)
                        .source(attachment.source)
                        .type(attachment.type)
                        .build();
                allureTestCaseAttachmentRepository.save(allureTestCaseAttachment);
            }

            for (AllureRequestDTO.Parameter parameter: allureResult.parameters) {
                AllureTestCaseParameter allureTestCaseParameter = AllureTestCaseParameter.builder()
                        .allureTestCaseId(allureTestCase.getId())
                        .name(parameter.name)
                        .value(parameter.value)
                        .excluded(parameter.excluded)
                        .mode(parameter.mode)
                        .build();
                allureTestCaseParameterRepository.save(allureTestCaseParameter);
            }

            for (AllureRequestDTO.Label label: allureResult.labels) {
                AllureTestCaseLabel allureTestCaseLabel = AllureTestCaseLabel.builder()
                        .allureTestCaseId(allureTestCase.getId())
                        .name(label.name)
                        .value(label.value)
                        .build();
                allureTestCaseLabelRepository.save(allureTestCaseLabel);
            }

            this.insertAllureTestCaseStep(allureResult.steps, allureTestCase.getId(), null);

            AllureTestCaseStatusDetail allureTestCaseStatusDetail = AllureTestCaseStatusDetail.builder()
                    .allureTestCaseId(allureTestCase.getId())
                    .known(allureResult.statusDetails.known)
                    .muted(allureResult.statusDetails.muted)
                    .flaky(allureResult.statusDetails.flaky)
                    .message(allureResult.statusDetails.message)
                    .trace(allureResult.statusDetails.trace)
                    .build();
            allureTestCaseStatusDetailRepository.save(allureTestCaseStatusDetail);
        }
    }

    private void insertAllureTestCaseStep(ArrayList<AllureRequestDTO.Step> steps, Long testCaseId, Long allureTestCaseStepId) {
        for (AllureRequestDTO.Step step: steps) {
            AllureTestCaseStep allureTestCaseStep = AllureTestCaseStep.builder()
                    .allureTestCaseId(testCaseId)
                    .allureTestCaseStepId(allureTestCaseStepId)
                    .name(step.name)
                    .allureStatusId(allureStatusRepository.findByNameEqualsIgnoreCase(step.status).getId())
                    .stage(step.stage)
                    .start(step.start)
                    .stop(step.stop)
                    .build();
            allureTestCaseStepRepository.save(allureTestCaseStep);

            for (AllureRequestDTO.Attachment attachment: step.attachments) {
                AllureTestCaseStepAttachment allureTestCaseAttachment = AllureTestCaseStepAttachment.builder()
                        .allureTestCaseStepId(allureTestCaseStep.getId())
                        .name(attachment.name)
                        .source(attachment.source)
                        .type(attachment.type)
                        .build();
                allureTestCaseStepAttachmentRepository.save(allureTestCaseAttachment);
            }

            for (AllureRequestDTO.Parameter parameter: step.parameters) {
                AllureTestCaseStepParameter allureTestCaseParameter = AllureTestCaseStepParameter.builder()
                        .allureTestCaseStepId(allureTestCaseStep.getId())
                        .name(parameter.name)
                        .value(parameter.value)
                        .excluded(parameter.excluded)
                        .mode(parameter.mode)
                        .build();
                allureTestCaseStepParameterRepository.save(allureTestCaseParameter);
            }

            AllureTestCaseStepStatusDetail allureTestCaseStepStatusDetail = AllureTestCaseStepStatusDetail.builder()
                    .allureTestCaseStepId(allureTestCaseStep.getId())
                    .known(step.statusDetails.known)
                    .muted(step.statusDetails.muted)
                    .flaky(step.statusDetails.flaky)
                    .message(step.statusDetails.message)
                    .trace(step.statusDetails.trace)
                    .build();
            allureTestCaseStepStatusDetailRepository.save(allureTestCaseStepStatusDetail);

            this.insertAllureTestCaseStep(step.steps, null, allureTestCaseStep.getId());
        }
    }

    public List<AllureEnvironment> getEnvironmentList() {
        return allureEnvironmentRepository.findAll();
    }

    public List<AllureCiDTO> getCiListByEnvironmentId(Long environmentId) {
        String sql = DaoUtil.getQuery("selectCiByEnvironment");

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("environmentId",environmentId);

        List<AllureCiDTO> ciList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new AllureCiRowMapper.AllureCiDTOMapper()
        );

        return ciList;
    }

    public List<AllureSuiteDTO> getSuiteListByEnvironmentIdNCi(Long environmentId, Long ciId, Long suiteId) {
        String sql = DaoUtil.getQuery("selectSuiteByEnvironmentNCiNSuiteIdLimit10");

        sql = sql.replace("{WHERE_CI}", ciId == 0L ? "" : " AND asu.allure_ci_id = :ciId ");
        sql = sql.replace("{WHERE_SUITE}", suiteId == 0L ? "" : " AND asu.start <= (SELECT asu_sub.start FROM allure_suite asu_sub WHERE asu_sub.id = :suiteId) ");

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("environmentId",environmentId);
        mapSqlParameterSource.addValue("ciId", ciId);
        mapSqlParameterSource.addValue("suiteId", suiteId);

        List<AllureSuiteDTO> allureSuiteDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new AllureSuiteRowMapper.AllureSuiteDTOMapper()
        );

        return allureSuiteDTOList;
    }

    public List<AllureSuiteEnvironment> getSuiteEnvironmentListBySuiteId(Long suiteId) {
        return allureSuiteEnvironmentRepository.findByAllureSuiteId(suiteId);
    }
}
