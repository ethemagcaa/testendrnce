package com.jotform.endrnce.modules.user.dao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserUpdatePasswordRequestDTO {

    private Long id;

    @NotBlank
    @NotEmpty
    private String password;
}
