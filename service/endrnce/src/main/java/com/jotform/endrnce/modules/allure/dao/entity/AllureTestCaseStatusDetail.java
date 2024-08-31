package com.jotform.endrnce.modules.allure.dao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "allure_test_case_status_detail")
public class AllureTestCaseStatusDetail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_test_case_id")
    private Long allureTestCaseId;

    private boolean known;

    private boolean muted;

    private boolean flaky;

    private String message;

    private String trace;
}
