package com.jotform.endrnce.modules.user.service;

import com.jotform.endrnce.common.AbstractBaseTest;
import com.jotform.endrnce.exception.ResourceNotFoundException;
import com.jotform.endrnce.modules.user.dao.dto.LoginRequestDTO;
import com.jotform.endrnce.modules.user.dao.dto.UserDTO;
import com.jotform.endrnce.modules.user.dao.entity.User;
import com.jotform.endrnce.security.UserPrincipal;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.util.ObjectUtils;

class UserServiceTest extends AbstractBaseTest {

    @Autowired
    private UserService userService;

    @Test
    void authenticateUser() {
        LoginRequestDTO loginRequest = LoginRequestDTO.builder()
                .email("enespekkaya@jotform.com")
                .password("1234")
                .build();

        String token = userService.authenticateUser(loginRequest);

        Assertions.assertFalse(ObjectUtils.isEmpty(token), "Token is not generated!");
    }

    @Test
    void authenticateUserInvalid() {
        LoginRequestDTO loginRequest = LoginRequestDTO.builder()
                .email("enespekkaya@jotform.com")
                .password("12334")
                .build();

        Assertions.assertThrows(BadCredentialsException.class, () -> userService.authenticateUser(loginRequest));
    }

    @Test
    void getCurrentUser() {
        UserPrincipal userPrincipal = UserPrincipal.create(User.builder()
                .id(1L)
                .email("enespekkaya@jotform.com")
                .password("1234")
                .build()
        );

        UserDTO userDTO = userService.getCurrentUser(userPrincipal);
        Assertions.assertEquals(userPrincipal.getId(), (long) userDTO.getId());
//        fail("The test has yet to be implemented");
    }

    @Test
    void getCurrentUserInvalid() {
        UserPrincipal userPrincipal = UserPrincipal.create(User.builder()
                .id(0L)
                .build()
        );

        Assertions.assertThrows(ResourceNotFoundException.class, () -> userService.getCurrentUser(userPrincipal));
    }
}
