package com.jotform.endrnce.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotform.endrnce.common.AbstractBaseTest;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.modules.user.dao.dto.LoginRequestDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.stream.Stream;

class AuthControllerTest extends AbstractBaseTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MethodSource()
    @ParameterizedTest
    void authenticateUserNotValidRequests(LoginRequestDTO loginRequest) throws Exception {
        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.post(String.format("%s/login", APIConstants.AUTH_PATH))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
        );

        resultActions
                .andExpect(MockMvcResultMatchers.status().is4xxClientError())
                .andExpect(result -> Assertions.assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
    }

    private static Stream<LoginRequestDTO> authenticateUserNotValidRequests() {
        return Stream.of(
                LoginRequestDTO.builder().build(),
                LoginRequestDTO.builder().email("").password("").build(),
                LoginRequestDTO.builder().email("test").build(),
                LoginRequestDTO.builder().email("test@test.com").build(),
                LoginRequestDTO.builder().password("test").build(),
                LoginRequestDTO.builder().email("test").password("test").build(),
                LoginRequestDTO.builder().email("").build()
        );
    }

    @Test
    void authenticateUserSuccess() throws Exception {
        LoginRequestDTO loginRequest = LoginRequestDTO.builder()
                .email("enespekkaya@jotform.com")
                .password("1234")
                .build();

        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.post(String.format("%s/login", APIConstants.AUTH_PATH))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
        );

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(result -> Assertions.assertFalse(ObjectUtils.isEmpty(result.getResponse().getContentAsString())));
    }
}
