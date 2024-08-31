package com.jotform.endrnce.modules.user.dao.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Long id;
    private Long providerTypeId;
    private String providerId;
    private String firstName;
    private String lastName;
    private String email;

}
