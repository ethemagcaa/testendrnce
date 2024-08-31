package com.jotform.endrnce.modules.allure.dao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "allure_suite")
public class AllureSuite implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_environment_id")
    private Long allureEnvironmentId;

    @Column(name = "allure_ci_id")
    private Long allureCiId;

    private String name;

    private Long failed;

    private Long broken;

    private Long skipped;

    private Long passed;

    private Long unknown;

    private Long total;

    private Timestamp start;

    private Timestamp stop;

    private Long duration;

    @Column(name = "min_duration")
    private Long minDuration;

    @Column(name = "max_duration")
    private Long maxDuration;

    @Column(name = "sum_duration")
    private Long sumDuration;

    @Column(name = "job_build_number")
    private Long jobBuildNumber;

    @Column(name = "job_build_url")
    private String jobBuildUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private AllureEnvironment allureEnvironment;
}
