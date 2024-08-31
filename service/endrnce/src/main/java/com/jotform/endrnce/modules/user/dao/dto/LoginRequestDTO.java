package com.jotform.endrnce.modules.user.dao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LoginRequestDTO {
    @NotBlank
    @NotEmpty
    @Email
    private String email;

    @NotBlank
    @NotEmpty
    private String password;
}
