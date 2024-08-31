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
@Table(name = "cucumber_example")
public class CucumberExample implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cucumber_children_id;

    private String name;

    private String description;

    @Size(max = 250)
    private String keyword;

    @Size(max = 250)
    private String location;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName= "cucumber_example_id", insertable = false, updatable = false)
    private CucumberExampleTableHeader cucumberExampleTableHeader;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "cucumber_example_id", insertable = false, updatable = false)
    private List<CucumberExampleTableBody> cucumberExampleTableBodyList;
}
