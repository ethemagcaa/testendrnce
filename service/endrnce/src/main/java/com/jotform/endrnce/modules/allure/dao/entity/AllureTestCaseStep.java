package com.jotform.endrnce.modules.allure.dao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "allure_test_case_step")
public class AllureTestCaseStep implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_test_case_id")
    private Long allureTestCaseId;

    @Column(name = "allure_test_case_step_id")
    private Long allureTestCaseStepId;

    private String name;

    @Column(name = "allure_status_id")
    private Long allureStatusId;

    private String stage;

    private Timestamp start;

    private Timestamp stop;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "allure_test_case_step_id", insertable = false, updatable = false)
    private List<AllureTestCaseStepParameter> allureTestCaseStepParameterList;
}
