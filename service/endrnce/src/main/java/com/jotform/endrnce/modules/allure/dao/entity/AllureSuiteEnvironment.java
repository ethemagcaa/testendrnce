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
@Table(name = "allure_suite_environment")
public class AllureSuiteEnvironment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "allure_suite_id")
    private Long allureSuiteId;

    private String name;

    private String value;
}
