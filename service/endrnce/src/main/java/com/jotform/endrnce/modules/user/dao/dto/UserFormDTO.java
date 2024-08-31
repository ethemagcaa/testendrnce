package com.jotform.endrnce.modules.user.dao.dto;

import com.jotform.endrnce.modules.role.dao.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
public class UserFormDTO {

    private Long id;
    private Long providerTypeId;
    private String providerId;
    private String firstName;
    private String lastName;
    private String email;

    private Collection<Role> roles = new ArrayList<>();
}
