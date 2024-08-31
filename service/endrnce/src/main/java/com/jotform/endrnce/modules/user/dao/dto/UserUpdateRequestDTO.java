package com.jotform.endrnce.modules.user.dao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserUpdateRequestDTO {

    private Long id;

    @NotBlank
    @NotEmpty
    private String firstName;

    @NotBlank
    @NotEmpty
    private String lastName;

    @NotBlank
    @NotEmpty
    @Email
    private String email;

    private Long[] roleIds;
}
