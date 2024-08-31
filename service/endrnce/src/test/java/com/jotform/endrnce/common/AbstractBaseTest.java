package com.jotform.endrnce.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotform.endrnce.common.extensions.TestResultLoggerExtension;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.modules.user.dao.dto.LoginRequestDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * @link Based on : https://github.com/marekhudyma/application-style
 */
@Log4j2
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(TestResultLoggerExtension.class)
@ActiveProfiles("test")
public abstract class AbstractBaseTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    public static MySQLContainer postgreSQLContainer = new MySQLContainer(DockerImageName.parse("mysql:8.0.24"))
//                .withInitScript("database/INIT.sql")
            .withDatabaseName("endurance-test");

    static {
        postgreSQLContainer.withReuse(true);
        postgreSQLContainer.start();

//        ** IMPORTANT ** -> If you don't use  ".withReuse(true);" config, you can uncomment below scripts.
//        using .withReuse(true) on your container definition AND the following .testcontainers.properties file in your home directory:
//        testcontainers.reuse.enable=true

//        make sure that containers will be stop in fast way (Ryuk can be slow)
//        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
//            log.info("DockerContainers stop");
//            postgreSQLContainer.stop();
//        }));
    }

    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
    }

    protected String obtainAccessToken() throws Exception {
        return obtainAccessToken("enespekkaya@jotform.com","1234");
    }

    protected String obtainAccessToken(String email, String password) throws Exception {
        LoginRequestDTO loginRequest = LoginRequestDTO.builder().email(email).password(password).build();

        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.post(String.format("%s/login", APIConstants.AUTH_PATH))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest))
        ).andExpect(MockMvcResultMatchers.status().isOk());

        return resultActions.andReturn().getResponse().getContentAsString();
    }
}
