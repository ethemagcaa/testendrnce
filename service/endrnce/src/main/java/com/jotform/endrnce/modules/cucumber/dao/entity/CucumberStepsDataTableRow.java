package com.jotform.endrnce.modules.cucumber.dao.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cucumber_steps_data_table_row")
public class CucumberStepsDataTableRow implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cucumber_steps_data_table_id;

    @Size(max = 250)
    private String location;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName= "cucumber_steps_data_table_row_id", insertable = false, updatable = false)
    private CucumberStepsDataTableRow cucumberStepsDataTableRow;
}
