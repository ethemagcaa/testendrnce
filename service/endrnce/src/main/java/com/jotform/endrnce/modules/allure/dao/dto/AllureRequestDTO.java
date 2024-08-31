package com.jotform.endrnce.modules.allure.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllureRequestDTO {
    String environment;
    String suiteName;
    Long failed;
    Long broken;
    Long skipped;
    Long passed;
    Long unknown;
    Long total;
    Timestamp start;
    Timestamp stop;
    Long duration;
    Long minDuration;
    Long maxDuration;
    Long sumDuration;
    Long jobBuildNumber;
    String jobBuildUrl;
    AllureCi allureCi;
    ArrayList<AllureResult> allureResults;
    ArrayList<AllureSuiteEnvironment> allureSuiteEnvironment;

    public static class AllureCi {
        public String jobName;
        public String jobUrl;
    }

    public static class AllureResult {
        // Identifiers
        public String uuid;
        public String historyId;
        public String testCaseId;
        // Metadata
        public String name;
        public String fullName;
        public String description;
        public String descriptionHtml;
        public ArrayList<Link> links;
        public ArrayList<Label> labels;
        public ArrayList<Parameter> parameters;
        public ArrayList<Attachment> attachments;
        // Execution
        public String status;
        public StatusDetails statusDetails;
        public String stage;
        public Timestamp start;
        public Timestamp stop;
        public ArrayList<Step> steps;
    }
    public static class Attachment {
        public String name;
        public String source;
        public String type;
    }

    public static class Label {
        public String name;
        public String value;
    }

    public static class Parameter {
        public String name;
        public String value;
        public boolean excluded;
        public String mode;
    }

    public static class Link {
        public String name;
        public String url;
        public String type;
    }

    public static class StatusDetails {
        public boolean known;
        public boolean muted;
        public boolean flaky;
        public String message;
        public String trace;
    }

    public static class Step {
        // Metadata
        public String name;
        public ArrayList<Parameter> parameters;
        public ArrayList<Attachment> attachments;
        // Execution
        public String status;
        public StatusDetails statusDetails;
        public String stage;
        public Timestamp start;
        public Timestamp stop;
        public ArrayList<Step> steps;
    }

    public static class AllureSuiteEnvironment {
        public String name;
        public ArrayList<String> values;
    }
}
