package com.jotform.endrnce.config.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    /**
     * The constant DEFAULT_CONTACT.
     */
    public static final Contact DEFAULT_CONTACT =
            new Contact()
                    .name("Jotform QA Team")
                    .email("enespekkaya@jotform.com")
                    .url("https://ta-dashboards.jotformers.com");

    /**
     * The constant LICENSE.
     */
    public static final License LICENSE = new License().name("").url("");

    /**
     * The Api controller package.
     */
    @Value("${app.version}")
    public String API_VERSION;
    /**
     * The Application name.
     */
    @Value("${app.title}")
    public String APPLICATION_NAME;
    /**
     * The Application description.
     */
    @Value("${app.description}")
    public String APPLICATION_DESCRIPTION;

    @Value("${app.swagger.server.url}")
    public String SWAGGER_URL;

    @Value("${app.swagger.server.description}")
    public String SWAGGER_DESCRIPTION;

    /**
     * Custom open api open api.
     *
     * @return the open api
     */
    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        Server server = new Server();
        server.setUrl(SWAGGER_URL);
        server.description(SWAGGER_DESCRIPTION);

        return new OpenAPI()
//            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))  // global security schema
                .servers(List.of(server))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )).info(apiEndPointsInfo());
    }

    private Info apiEndPointsInfo() {
        return new Info()
                .title(APPLICATION_NAME)
                .description(APPLICATION_DESCRIPTION)
                .contact(DEFAULT_CONTACT)
                .license(LICENSE)
                .version(API_VERSION);
    }
}
