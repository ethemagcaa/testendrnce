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
@Table(name = "cucumber_feature")
public class CucumberFeature implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Size(max = 250)
    private String keyword;

    @Size(max = 10)
    private String language;

    @Size(max = 250)
    private String location;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_feature_id", insertable = false, updatable = false)
    private List<CucumberChildren> cucumberChildrenList;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_feature_id", insertable = false, updatable = false)
    private List<CucumberFeature2Tag> cucumberFeature2TagList;
}
