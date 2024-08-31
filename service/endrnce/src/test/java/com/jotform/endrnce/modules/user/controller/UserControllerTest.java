package com.jotform.endrnce.modules.user.controller;

import com.jotform.endrnce.common.AbstractBaseTest;
import com.jotform.endrnce.constant.APIConstants;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

class UserControllerTest extends AbstractBaseTest {
    private String accessToken;

    @Autowired
    private MockMvc mockMvc;

    @BeforeAll
    void initAll() throws Exception {
        accessToken = obtainAccessToken();
    }

    @Test
    void getCurrentUser() throws Exception {
        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.get(String.format("%s/me", APIConstants.USER_PATH))
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)

        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
    }
}
