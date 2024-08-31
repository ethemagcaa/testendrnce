package com.jotform.endrnce.modules.cucumber.dao.entity;

import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cucumber_children")
public class CucumberChildren implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cucumber_feature_id;

    private String name;

    private String description;

    @Size(max = 250)
    private String keyword;

    @Size(max = 250)
    private String location;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_children_id", insertable = false, updatable = false)
    private List<CucumberSteps> cucumberStepsList;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_children_id", insertable = false, updatable = false)
    private List<CucumberChildren2Tag> cucumberChildren2TagList;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_children_id", insertable = false, updatable = false)
    private List<CucumberExample> cucumberExampleList;
}
