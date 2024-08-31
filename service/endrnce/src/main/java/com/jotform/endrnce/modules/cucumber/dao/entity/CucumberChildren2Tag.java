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
@Table(name = "cucumber_children2tag")
public class CucumberChildren2Tag implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cucumber_children_id;

    private Long cucumber_tag_id;
}
