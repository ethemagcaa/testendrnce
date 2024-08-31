package com.jotform.endrnce.modules.cucumber.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CucumberExampleHeaderDTO {

    public Location location;
    public String value;

    public static class Location {

        public int line;
        public int column;
    }
}
