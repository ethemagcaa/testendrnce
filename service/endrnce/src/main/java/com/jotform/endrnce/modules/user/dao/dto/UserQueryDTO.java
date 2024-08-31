package com.jotform.endrnce.modules.user.dao.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserQueryDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Date lastLoginDate;
    private String providerTypeName;
    private String roles;

}
