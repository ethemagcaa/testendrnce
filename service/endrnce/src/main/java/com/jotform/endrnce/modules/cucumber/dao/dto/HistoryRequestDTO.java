package com.jotform.endrnce.modules.cucumber.dao.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryRequestDTO {

    @JsonFormat(pattern = "yyyy-MM-dd")
    public Date addingDate;

    public int featureCount;

    public int testCaseCount;
}
