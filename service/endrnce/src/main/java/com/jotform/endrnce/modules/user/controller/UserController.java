package com.jotform.endrnce.modules.user.controller;

import com.jotform.endrnce.common.controller.SecuredRestController;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.constant.QueryConstants;
import com.jotform.endrnce.exception.ForbiddenException;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.exception.ResourceNotFoundException;
import com.jotform.endrnce.modules.user.dao.dto.*;
import com.jotform.endrnce.modules.user.dao.entity.User;
import com.jotform.endrnce.modules.user.service.UserService;
import com.jotform.endrnce.security.CurrentUser;
import com.jotform.endrnce.security.UserPrincipal;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.USER_PATH)
public class UserController implements SecuredRestController {

    private final UserService userService;

    @Operation(
            summary = "Get Current User Info",
            tags = {"UserController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User Info",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized",
                            content = @Content(schema = @Schema(implementation = BadCredentialsException.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User not found",
                            content = @Content(schema = @Schema(implementation = ResourceNotFoundException.class))),
            })
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserDTO getCurrentUser(@CurrentUser UserPrincipal userPrincipal) throws ResourceNotFoundException {
        return userService.getCurrentUser(userPrincipal);
    }

    @Operation(
            summary = "Get User Query List",
            tags = {"UserController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User List",
                            content = @Content(schema = @Schema(implementation = UserQueryDTO.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            })
    @ResponseBody
    @GetMapping("/query")
    @PreAuthorize("hasRole('ADMIN')")
    public QueryResponse<List<UserQueryDTO>> getUserQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "u.first_name") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return userService.getUserQuery(page, items_per_page, sort, order, search);

    }

    @Operation(
            summary = "Get User By Id",
            tags = {"UserController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get User Info",
                            content = @Content(schema = @Schema(implementation = UserFormDTO.class))),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User Not Found",
                            content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
            })
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserFormDTO getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @Operation(
            summary = "Create a new User",
            tags = {"UserController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User created",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        User user = userService.createUser(userRequestDTO);

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update User",
            tags = {"UserController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User updated",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "User Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @PutMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserUpdateRequestDTO userUpdateRequestDTO) {
        User user = userService.updateUser(userUpdateRequestDTO);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Operation(
            summary = "Update User Password",
            tags = {"UserController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User password updated",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "User Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @PutMapping("/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserPassword(@Valid @RequestBody UserUpdatePasswordRequestDTO userUpdatePasswordRequestDTO) {
        User user = userService.updateUserPassword(userUpdatePasswordRequestDTO);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete User By Id",
            tags = {"UserController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete User By Id",
                    content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @ResponseBody
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deleteUser(@PathVariable Long userId) {
        User user = userService.deleteUser(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}