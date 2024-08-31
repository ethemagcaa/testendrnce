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
@Table(name = "cucumber_tag")
public class CucumberTag implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
