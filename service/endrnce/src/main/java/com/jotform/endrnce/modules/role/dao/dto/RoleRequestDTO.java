package com.jotform.endrnce.modules.role.dao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RoleRequestDTO {

    private Long id;

    @NotBlank
    @NotEmpty
    private String name;
}
