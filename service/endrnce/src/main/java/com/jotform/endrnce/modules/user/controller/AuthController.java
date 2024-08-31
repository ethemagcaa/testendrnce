package com.jotform.endrnce.modules.user.controller;

import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.modules.user.dao.dto.LoginRequestDTO;
import com.jotform.endrnce.modules.user.dao.dto.RegisterRequestDTO;
import com.jotform.endrnce.modules.user.dao.entity.User;
import com.jotform.endrnce.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLIntegrityConstraintViolationException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.AUTH_PATH)
public class AuthController {

    private final UserService userService;

    @Operation(
        summary = "Authentication User",
        description = "",
        tags = {"AuthController"})
    @ApiResponses(
        value = {
            @ApiResponse(
                responseCode = "200",
                description = "Authentication User",
                content = @Content(schema = @Schema(implementation = ResponseEntity.class))),
            @ApiResponse(
                responseCode = "401",
                description = "Unauthorized",
                content = @Content(schema = @Schema(implementation = BadCredentialsException.class))),
            @ApiResponse(
                responseCode = "400",
                description = "Validation failed for request",
                content = @Content(schema = @Schema(implementation = MethodArgumentNotValidException.class))),
            @ApiResponse(
                    responseCode = "409",
                    description = "Email address is in used",
                    content = @Content(schema = @Schema(implementation = SQLIntegrityConstraintViolationException.class))),
        })
    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) throws BadCredentialsException {
        return new ResponseEntity<>(userService.authenticateUser(loginRequest), HttpStatus.OK);
    }

    @Operation(
        summary = "Create User",
        description = "",
        tags = {"AuthController"})
    @ApiResponses(
        value = {
            @ApiResponse(
                responseCode = "201",
                description = "Create User",
                content = @Content(schema = @Schema(implementation = ResponseEntity.class)))
        })
    @PostMapping("/user")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        User savedUser = userService.registerUser(registerRequest);

        LoginRequestDTO loginRequestDTO = LoginRequestDTO.builder()
            .email(savedUser.getEmail())
            .password(registerRequest.getPassword())
            .build();

        String token = userService.authenticateUser(loginRequestDTO);

        return new ResponseEntity<>(token, HttpStatus.CREATED);
    }
}
