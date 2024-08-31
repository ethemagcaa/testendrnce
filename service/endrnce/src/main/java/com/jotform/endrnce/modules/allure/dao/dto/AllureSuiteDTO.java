package com.jotform.endrnce.modules.allure.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AllureSuiteDTO implements Serializable {

    private Long id;
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
}
