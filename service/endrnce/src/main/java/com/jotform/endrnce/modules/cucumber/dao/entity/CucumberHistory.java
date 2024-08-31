package com.jotform.endrnce.modules.cucumber.dao.entity;

import lombok.*;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cucumber_history")
public class CucumberHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "adding_date")
    private Date addingDate;

    @Column(name = "feature_count")
    private int featureCount;

    @Column(name = "test_case_count")
    private int testCaseCount;
}
