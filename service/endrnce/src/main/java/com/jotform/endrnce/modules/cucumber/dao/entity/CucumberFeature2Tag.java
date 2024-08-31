package com.jotform.endrnce.modules.cucumber.dao.entity;

import lombok.*;

import jakarta.persistence.*;
import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cucumber_feature2tag")
public class CucumberFeature2Tag implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cucumber_feature_id;

    private Long cucumber_tag_id;
}
