package com.jotform.endrnce.modules.cucumber.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.modules.cucumber.dao.dto.*;
import com.jotform.endrnce.modules.cucumber.dao.entity.*;
import com.jotform.endrnce.modules.cucumber.dao.repository.*;
import com.jotform.endrnce.modules.cucumber.dao.rowmapper.*;
import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class CucumberService {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private final CucumberFeatureRepository cucumberFeatureRepository;

    private final CucumberTagRepository cucumberTagRepository;

    private final CucumberFeature2TagRepository cucumberFeature2TagRepository;

    private final CucumberChildrenRepository cucumberChildrenRepository;

    private final CucumberChildren2TagRepository cucumberChildren2TagRepository;

    private final CucumberStepsRepository cucumberStepsRepository;

    private final CucumberExampleRepository cucumberExampleRepository;

    private final CucumberExampleTableHeaderRepository cucumberExampleTableHeaderRepository;

    private final CucumberExampleTableBodyRepository cucumberExampleTableBodyRepository;

    private final CucumberHistoryRepository cucumberHistoryRepository;

    private final  CucumberStepsDataTableRepository cucumberStepsDataTableRepository;

    private final CucumberStepsDataTableRowRepository cucumberStepsDataTableRowRepository;

    private final CucumberStepsDataTableCellRepository cucumberStepsDataTableCellRepository;

    @Transactional
    public void insertBulkCucumberData(List<CucumberRequestDTO> cucumberRequestDTOList) {
        this.truncateTables();

        for (CucumberRequestDTO cucumberRequestDTO : cucumberRequestDTOList) {
            CucumberRequestDTO.Feature feature = cucumberRequestDTO.getFeature();
            CucumberFeature cucumberFeature = CucumberFeature
                    .builder()
                    .name(feature.name)
                    .description(feature.description)
                    .keyword(feature.keyword)
                    .language(feature.language)
                    .location(new Gson().toJson(feature.location))
                    .build();
            cucumberFeatureRepository.save(cucumberFeature);

            for (CucumberRequestDTO.Tag tag : feature.tags) {
                CucumberTag cucumberTag = cucumberTagRepository.findByNameEqualsIgnoreCase(tag.name);
                if (ObjectUtils.isEmpty(cucumberTag)) {
                    cucumberTag = CucumberTag.builder().name(tag.name).build();
                    cucumberTagRepository.save(cucumberTag);
                }

                CucumberFeature2Tag cucumberFeature2Tag = CucumberFeature2Tag
                        .builder()
                        .cucumber_feature_id(cucumberFeature.getId())
                        .cucumber_tag_id(cucumberTag.getId())
                        .build();
                cucumberFeature2TagRepository.save(cucumberFeature2Tag);
            }

            for (CucumberRequestDTO.Child child : feature.children) {
                if (ObjectUtils.isNotEmpty(child.background)) {
                    CucumberRequestDTO.Background background = child.background;

                    CucumberChildren cucumberChildren = CucumberChildren
                            .builder()
                            .cucumber_feature_id(cucumberFeature.getId())
                            .name(background.name)
                            .description(background.description)
                            .keyword(background.keyword)
                            .location(new Gson().toJson(background.location))
                            .build();
                    cucumberChildrenRepository.save(cucumberChildren);

                    for (CucumberRequestDTO.Step step : background.steps) {
                        CucumberSteps cucumberSteps = CucumberSteps
                                .builder()
                                .cucumberChildrenId(cucumberChildren.getId())
                                .text(step.text)
                                .keyword(step.keyword)
                                .keywordType(step.keywordType)
                                .location(new Gson().toJson(step.location))
                                .docString(step.docString)
                                .build();
                        cucumberStepsRepository.save(cucumberSteps);

                        this.saveDataTable(step, cucumberSteps);
                    }
                }

                if (ObjectUtils.isNotEmpty(child.scenario)) {
                    CucumberRequestDTO.Scenario scenario = child.scenario;

                    CucumberChildren cucumberChildren = CucumberChildren
                            .builder()
                            .cucumber_feature_id(cucumberFeature.getId())
                            .name(scenario.name)
                            .description(scenario.description)
                            .keyword(scenario.keyword)
                            .location(new Gson().toJson(scenario.location))
                            .build();
                    cucumberChildrenRepository.save(cucumberChildren);

                    for (CucumberRequestDTO.Step step : scenario.steps) {
                        CucumberSteps cucumberSteps = CucumberSteps
                                .builder()
                                .cucumberChildrenId(cucumberChildren.getId())
                                .text(step.text)
                                .keyword(step.keyword)
                                .keywordType(step.keywordType)
                                .location(new Gson().toJson(step.location))
                                .docString(step.docString)
                                .build();
                        cucumberStepsRepository.save(cucumberSteps);

                        this.saveDataTable(step, cucumberSteps);
                    }

                    for (CucumberRequestDTO.Tag tag : scenario.tags) {
                        CucumberTag cucumberTag = cucumberTagRepository.findByNameEqualsIgnoreCase(tag.name);
                        if (ObjectUtils.isEmpty(cucumberTag)) {
                            cucumberTag = CucumberTag.builder().name(tag.name).build();
                            cucumberTagRepository.save(cucumberTag);
                        }

                        CucumberChildren2Tag cucumberChildren2Tag = CucumberChildren2Tag
                                .builder()
                                .cucumber_children_id(cucumberChildren.getId())
                                .cucumber_tag_id(cucumberTag.getId())
                                .build();
                        cucumberChildren2TagRepository.save(cucumberChildren2Tag);
                    }

                    for (CucumberRequestDTO.Example example : scenario.examples) {
                        CucumberExample cucumberExample = CucumberExample
                                .builder()
                                .cucumber_children_id(cucumberChildren.getId())
                                .name(example.name)
                                .description(example.description)
                                .keyword(example.keyword)
                                .location(new Gson().toJson(example.location))
                                .build();
                        cucumberExampleRepository.save(cucumberExample);

                        CucumberExampleTableHeader cucumberExampleTableHeader = CucumberExampleTableHeader
                                .builder()
                                .cucumber_example_id(cucumberExample.getId())
                                .location(new Gson().toJson(example.tableHeader.location))
                                .cells(new Gson().toJson(example.tableHeader.cells))
                                .build();
                        cucumberExampleTableHeaderRepository.save(cucumberExampleTableHeader);

                        for (CucumberRequestDTO.TableBody tableBody : example.tableBody) {
                            CucumberExampleTableBody cucumberExampleTableBody = CucumberExampleTableBody
                                    .builder()
                                    .cucumber_example_id(cucumberExample.getId())
                                    .location(new Gson().toJson(tableBody.location))
                                    .cells(new Gson().toJson(tableBody.cells))
                                    .build();
                            cucumberExampleTableBodyRepository.save(cucumberExampleTableBody);
                        }
                    }
                }
            }
        }

        String sql = DaoUtil.getQuery("selectCucumberChildren");
        sql = sql.replace("{WHERE_TAG}", "");

        List<CucumberChildrenDTO> cucumberChildrenList = namedParameterJdbcTemplate.query(
                sql,
                new MapSqlParameterSource(),
                new CucumberChildrenRowMapper.CucumberChildrenDTOMapper()
        );
        int featureCount = (int) cucumberFeatureRepository.count();
        int testCaseCount = cucumberChildrenList.size();

        Sort sort = Sort.by("addingDate").descending();
        CucumberHistory cucumberHistoryLast = cucumberHistoryRepository.findFirstBy(sort);

        if (
                ObjectUtils.isEmpty(cucumberHistoryLast) ||
                        cucumberHistoryLast.getFeatureCount() != featureCount ||
                        cucumberHistoryLast.getTestCaseCount() != testCaseCount
        ) {
            CucumberHistory cucumberHistory = CucumberHistory
                    .builder()
                    .addingDate(new Date())
                    .featureCount(featureCount)
                    .testCaseCount(testCaseCount)
                    .build();
            cucumberHistoryRepository.save(cucumberHistory);
        }
    }

    private void saveDataTable(CucumberRequestDTO.Step step, CucumberSteps cucumberSteps) {
        if(ObjectUtils.isEmpty(step.dataTable)) {
            return;
        }

        CucumberStepsDataTable cucumberStepsDataTable = CucumberStepsDataTable
                .builder()
                .cucumber_steps_id(cucumberSteps.getId())
                .location(new Gson().toJson(step.dataTable.location))
                .build();
        cucumberStepsDataTableRepository.save(cucumberStepsDataTable);

        for (CucumberRequestDTO.Row row : step.dataTable.rows) {
            CucumberStepsDataTableRow cucumberStepsDataTableRow = CucumberStepsDataTableRow
                    .builder()
                    .cucumber_steps_data_table_id(cucumberStepsDataTable.getId())
                    .location(new Gson().toJson(row.location))
                    .build();
            cucumberStepsDataTableRowRepository.save(cucumberStepsDataTableRow);

            for (CucumberRequestDTO.Cell cell : row.cells) {
                CucumberStepsDataTableCell cucumberStepsDataTableCell = CucumberStepsDataTableCell
                        .builder()
                        .cucumber_steps_data_table_row_id(cucumberStepsDataTableRow.getId())
                        .location(new Gson().toJson(cell.location))
                        .value(cell.value)
                        .build();
                cucumberStepsDataTableCellRepository.save(cucumberStepsDataTableCell);
            }
        }
    }
    private void truncateTables() {
        cucumberFeature2TagRepository.deleteAllInBatch();
        cucumberChildren2TagRepository.deleteAllInBatch();
        cucumberTagRepository.deleteAllInBatch();
        cucumberExampleTableBodyRepository.deleteAllInBatch();
        cucumberExampleTableHeaderRepository.deleteAllInBatch();
        cucumberExampleRepository.deleteAllInBatch();
        cucumberStepsDataTableCellRepository.deleteAllInBatch();
        cucumberStepsDataTableRowRepository.deleteAllInBatch();
        cucumberStepsDataTableRepository.deleteAllInBatch();
        cucumberStepsRepository.deleteAllInBatch();
        cucumberChildrenRepository.deleteAllInBatch();
        cucumberFeatureRepository.deleteAllInBatch();
    }

    public QueryResponse<List<CucumberChildrenDTO>> getTestCaseQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String tags,
            String search,
            int featureId,
            Boolean isEnterprise,
            Boolean isExcludeEnterpriseBsg,
            Boolean isBsgOnly,
            Boolean isEeProductTest,
            Boolean isRegression

    ) throws JsonProcessingException {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        ArrayList<String> tagList = new ArrayList<>(Arrays.asList(tags.split(",")));

        String sqlCounter = DaoUtil.getQuery("selectCountTestCaseQuery");
        sqlCounter = sqlCounter.replace("{CONDITION}", isExcludeEnterpriseBsg ? " NOT " : "");
        sqlCounter = sqlCounter.replace("{FILTER}",
                isEnterprise ? " AND ct.name IN ('@enterprise') " :
                        (isExcludeEnterpriseBsg ?
                                " AND ct.name IN ('@enterprise', '@bsgOnly') " : (isBsgOnly ?
                                    " AND ct.name IN ('@bsgOnly') " : "")));
        sqlCounter = sqlCounter.replace("{FILTER_HAVING}", isEeProductTest ?
                " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 "
                : (isRegression ?
                    " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                    + " AND SUM(CASE WHEN ct.name = '@regression' THEN 1 ELSE 0 END) > 0 "
                    + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                    + " AND SUM(CASE WHEN ct.name = '@downloadFile' THEN 1 ELSE 0 END) = 0 "
                    + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                    + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 " : ""));
        sqlCounter = sqlCounter.replace("{TAGNAME}", ObjectUtils.isEmpty(tags) ? "" : " AND ct.name IN (:tags) ");
        sqlCounter = sqlCounter.replace("{SEARCH}", ObjectUtils.isEmpty(search) ? "" : " AND (cc.name LIKE :search OR cf.name LIKE :search) ");
        sqlCounter = sqlCounter.replace("{FEATUREID}", featureId == 0 ? "" : " AND cf.id = :featureId ");
        sqlCounter = sqlCounter.replace(
                "{HAVING}",
                ObjectUtils.isEmpty(tags) ? "" : String.format(" HAVING count(DISTINCT ct.name)= %d", tagList.size())
        );

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("tags", tagList);
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        mapSqlParameterCount.addValue("featureId", featureId);
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectTestCaseQuery");
        sql = sql.replace("{CONDITION}", isExcludeEnterpriseBsg ? " NOT " : "");
        sql = sql.replace("{FILTER}",
                isEnterprise ? " AND ct.name IN ('@enterprise') " :
                        (isExcludeEnterpriseBsg ?
                                " AND ct.name IN ('@enterprise', '@bsgOnly') " : (isBsgOnly ?
                                    " AND ct.name IN ('@bsgOnly') " : "")));
        sql = sql.replace("{FILTER_HAVING}", isEeProductTest ?
                " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                : (isRegression ?
                " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@regression' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@downloadFile' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 " : ""));
        sql = sql.replace("{TAGNAME}", ObjectUtils.isEmpty(tags) ? "" : " AND ct.name IN (:tags) ");
        sql = sql.replace("{SEARCH}", ObjectUtils.isEmpty(search) ? "" : " AND (cc.name LIKE :search OR cf.name LIKE :search) ");
        sql = sql.replace("{FEATUREID}", featureId == 0 ? "" : " AND cf.id = :featureId ");
        sql = sql.replace("{HAVING}",
                ObjectUtils.isEmpty(tags) ? "" : String.format(" HAVING count(DISTINCT ct.name)= %d", tagList.size()));
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("tags", tagList);
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("featureId", featureId);
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<CucumberChildrenDTO> cucumberChildrenDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new CucumberChildrenRowMapper.CucumberChildrenDTOMapper()
        );

        this.editScenariosOutlineName(cucumberChildrenDTOList);
        return QueryResponse.<List<CucumberChildrenDTO>>builder()
                .data(cucumberChildrenDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float) totalRows / items_per_page))
                .build();
    }

    private void editScenariosOutlineName(List<CucumberChildrenDTO> cucumberChildrenDTOList) throws JsonProcessingException {
        for (CucumberChildrenDTO cucumberChildrenDTO : cucumberChildrenDTOList) {
            if (ObjectUtils.isEmpty(cucumberChildrenDTO.getExampleBody())) {
                continue;
            }

            ObjectMapper mapper = new ObjectMapper();
            List<CucumberExampleHeaderDTO> exampleHeaderList = mapper.readValue(cucumberChildrenDTO.getExampleHeader(), new TypeReference<>() {
            });
            CucumberExampleBodyDTO[] exampleBodies = mapper.readValue(cucumberChildrenDTO.getExampleBody(), CucumberExampleBodyDTO[].class);

            int counter = 0;
            for (CucumberExampleHeaderDTO exampleHeader : exampleHeaderList) {
                String scenarioName = cucumberChildrenDTO.getName();

                if (scenarioName.contains(exampleHeader.getValue())) {
                    cucumberChildrenDTO.setName(
                            scenarioName.replace(String.format("<%s>", exampleHeader.getValue()), exampleBodies[counter].getValue())
                    );
                }

                counter++;
            }
        }
    }

    public List<CucumberTagsDTO> getTags(Boolean isEnterprise) {
        String sql = DaoUtil.getQuery("selectTagsQuery");
        sql = sql.replace("{CONDITION}", "");
        sql = sql.replace("{WHERE_TAG}", isEnterprise ? " AND ct.name = '@enterprise' " : "");

        return namedParameterJdbcTemplate.query(sql, new MapSqlParameterSource(), new CucumberTagsRowMapper.CucumberTagsDTOMapper());
    }

    public List<CucumberTagsDTO> getPopularTagsTop5(Boolean isEnterprise, Boolean isExcludeEnterpriseBsg, Boolean isBsgOnly) {
        String sql = DaoUtil.getQuery("selectTagsQuery");
        sql = sql.replace("{CONDITION}", isExcludeEnterpriseBsg ? " NOT " : "");
        sql = sql.replace("{WHERE_TAG}", isEnterprise ?
                " AND ct.name = '@enterprise' " : (isExcludeEnterpriseBsg ?
                    " AND ct.name IN ('@enterprise', '@bsgOnly') " : (isBsgOnly ?
                        " AND ct.name IN ('@bsgOnly') " : "")));
        sql = sql.concat(" LIMIT 5");

        return namedParameterJdbcTemplate.query(sql, new MapSqlParameterSource(), new CucumberTagsRowMapper.CucumberTagsDTOMapper());
    }

    public List<CucumberChildrenDTO> getScenarios(Boolean isEnterprise) throws JsonProcessingException {
        String sql = DaoUtil.getQuery("selectCucumberChildren");
        sql = sql.replace("{WHERE_TAG}", isEnterprise ? " AND gt.name = '@enterprise' " : "");

        List<CucumberChildrenDTO> cucumberChildrenList = namedParameterJdbcTemplate.query(
                sql,
                new MapSqlParameterSource(),
                new CucumberChildrenRowMapper.CucumberChildrenDTOMapper()
        );

        this.editScenariosOutlineName(cucumberChildrenList);
        return cucumberChildrenList;
    }

    public List<CucumberSteps> getTestSteps(long childrenId) {
        return cucumberStepsRepository.findByCucumberChildrenId(childrenId);
    }

    public Long getTotalNumberOfSteps(Boolean isEnterprise) {
        String sql = DaoUtil.getQuery("selectCountTestStepsQuery");
        sql = sql.replace("{WHERE_TAG}", isEnterprise ? " AND ct.name = '@enterprise' " : "");

        return namedParameterJdbcTemplate.queryForObject(sql, new MapSqlParameterSource(), Long.class);
    }

    public List<CucumberFeature> getFeatures(Boolean isEnterprise, Boolean isExcludeEnterpriseBsg, Boolean isBsgOnly,
                                             Boolean isEeProductTest, Boolean isRegression) {
        String sql = DaoUtil.getQuery("selectCucumberFeature");
        sql = sql.replace("{CONDITION}", isExcludeEnterpriseBsg ? " NOT " : "");
        sql = sql.replace("{FILTER}",
                isEnterprise ? " AND ct.name IN ('@enterprise') " :
                        (isExcludeEnterpriseBsg ?
                                " AND ct.name IN ('@enterprise', '@bsgOnly') " : (isBsgOnly ?
                                    " AND ct.name IN ('@bsgOnly') " : "")));
        sql = sql.replace("{FILTER_HAVING}", isEeProductTest ?
                " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                : (isRegression ?
                " HAVING SUM(CASE WHEN ct.name = '@enterprise' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@regression' THEN 1 ELSE 0 END) > 0 "
                        + " AND SUM(CASE WHEN ct.name = '@salesforce' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@downloadFile' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@ignore' THEN 1 ELSE 0 END) = 0 "
                        + " AND SUM(CASE WHEN ct.name = '@signDisabled' THEN 1 ELSE 0 END) = 0 " : ""));

        return namedParameterJdbcTemplate.query(sql, new MapSqlParameterSource(), new CucumberFeatureRowMapper.CucumberFeatureDTOMapper());
    }

    public List<ScenarioWithFeatureTagsDTO> getScenariosIncludeFeatureTags(String whereStatement) throws JsonProcessingException {
        String sql = DaoUtil.getQuery("selectScenariosIncludeFeatureTags");
        sql = sql.replace("{WHERE}", whereStatement);

        List<ScenarioWithFeatureTagsDTO> scenarioWithFeatureTagsDTOList = namedParameterJdbcTemplate.query(
                sql,
                new MapSqlParameterSource(),
                new ScenarioWithFeatureTagsRowMapper.ScenarioWithFeatureTagsDTOMapper()
        );

        this.renameScenariosOutlineName(scenarioWithFeatureTagsDTOList);

        return scenarioWithFeatureTagsDTOList;
    }

    private void renameScenariosOutlineName(List<ScenarioWithFeatureTagsDTO> scenarioWithFeatureTagsDTOList) throws JsonProcessingException {
        for (ScenarioWithFeatureTagsDTO scenarioWithFeatureTagsDTO : scenarioWithFeatureTagsDTOList) {
            if (ObjectUtils.isEmpty(scenarioWithFeatureTagsDTO.getExampleBody())) {
                continue;
            }

            ObjectMapper mapper = new ObjectMapper();
            List<CucumberExampleHeaderDTO> exampleHeaderList = mapper.readValue(scenarioWithFeatureTagsDTO.getExampleHeader(), new TypeReference<>() {
            });
            CucumberExampleBodyDTO[] exampleBodies = mapper.readValue(scenarioWithFeatureTagsDTO.getExampleBody(), CucumberExampleBodyDTO[].class);

            int counter = 0;
            for (CucumberExampleHeaderDTO exampleHeader : exampleHeaderList) {
                String scenarioName = scenarioWithFeatureTagsDTO.getName();

                if (scenarioName.contains(exampleHeader.getValue())) {
                    scenarioWithFeatureTagsDTO.setName(
                            scenarioName.replace(String.format("<%s>", exampleHeader.getValue()), exampleBodies[counter].getValue())
                    );
                }

                counter++;
            }
        }
    }

    public List<CucumberHistory> getHistory() {
        String sql = DaoUtil.getQuery("selectCucumberHistoryLimit10");

        return namedParameterJdbcTemplate.query(sql, new MapSqlParameterSource(), new CucumberHistoryRowMapper.CucumberHistoryDTOMapper());
    }

    public void deleteHistory(Long historyId) {
        cucumberHistoryRepository.deleteById(historyId);
    }

    public void insertHistory(HistoryRequestDTO historyRequest) {
        ModelMapper modelMapper = new ModelMapper();
        CucumberHistory cucumberHistory = modelMapper.map(historyRequest, CucumberHistory.class);

        cucumberHistoryRepository.save(cucumberHistory);
    }
}
