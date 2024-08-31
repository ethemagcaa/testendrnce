package com.jotform.endrnce.config.oauth2;

import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.security.CustomUserDetailsService;
import com.jotform.endrnce.security.TokenAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configurers.provisioning.InMemoryUserDetailsManagerConfigurer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@RequiredArgsConstructor
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true
)
public class WebSecurityConfig {

    @Value("${app.cors.allowedOrigins}")
    private String allowedOrigins;

    private final long MAX_AGE_SECS = 3600;

    AuthenticationManager authenticationManager;

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService);

        inMemoryConfigurer().withUser("actuator").password("{noop}Sy!v25N.14mbc").roles("USER", "ENDRNCE_ACTUATOR_API").and().configure(authenticationManagerBuilder);

        authenticationManager = authenticationManagerBuilder.build();

        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS));

        http.authorizeHttpRequests(request -> request.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/documentation/**").permitAll());
        http.authorizeHttpRequests(request -> request.requestMatchers(String.format("%s/**", APIConstants.AUTH_PATH), "/oauth2/**").permitAll());
        http.authorizeHttpRequests(request -> request.requestMatchers(APIConstants.ACTUATOR_PATH + "/**").hasRole("ENDRNCE_ACTUATOR_API"));
        http.authorizeHttpRequests(request -> request.anyRequest().permitAll());

        http.authenticationManager(authenticationManager);

        // Add our custom Token based authentication filter
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

    private InMemoryUserDetailsManagerConfigurer<AuthenticationManagerBuilder> inMemoryConfigurer() {
        return new InMemoryUserDetailsManagerConfigurer<>();
    }
}
