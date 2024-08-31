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
@Table(name = "allure_test_case_step_parameter")
public class AllureTestCaseStepParameter implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_test_case_step_id")
    private Long allureTestCaseStepId;
    
    private String name;

    private String value;

    private boolean excluded;

    private String mode;
}
