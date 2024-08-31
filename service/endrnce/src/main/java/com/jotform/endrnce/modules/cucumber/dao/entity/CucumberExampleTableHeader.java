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
@Table(name = "cucumber_example_table_header")
public class CucumberExampleTableHeader implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cucumber_example_id")
    private Long cucumber_example_id;

    @Size(max = 250)
    private String location;

    private String cells;
}
