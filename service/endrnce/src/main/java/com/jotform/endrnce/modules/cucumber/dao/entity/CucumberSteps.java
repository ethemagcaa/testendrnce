package com.jotform.endrnce.modules.cucumber.dao.entity;

import lombok.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cucumber_steps")
public class CucumberSteps implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "cucumber_children_id")
    private Long cucumberChildrenId;

    @Column(name = "text")
    private String text;

    @Size(max = 250)
    @Column(name = "keyword")
    private String keyword;

    @Size(max = 250)
    @Column(name = "keyword_type")
    private String keywordType;

    @Size(max = 250)
    @Column(name = "location")
    private String location;

    @Column(name = "doc_string")
    private String docString;
}
