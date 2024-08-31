package com.jotform.endrnce.modules.allure.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AllureCiDTO implements Serializable {

    private Long id;
    private String name;

}
