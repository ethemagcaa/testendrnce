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
@Table(name = "allure_test_case")
public class AllureTestCase implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_suite_id")
    private Long allureSuiteId;

    private String uuid;

    @Column(name = "history_id")
    private String historyId;

    @Column(name = "test_case_id")
    private String testCaseId;

    @Column(name = "full_name")
    private String fullName;

    private String name;

    @Column(name = "allure_status_id")
    private Long allureStatusId;

    private Timestamp start;

    private Timestamp stop;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private AllureSuite allureSuite;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private AllureStatus allureStatus;
}
