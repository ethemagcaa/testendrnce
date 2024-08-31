package com.jotform.endrnce.modules.role.controller;

import com.jotform.endrnce.common.controller.SecuredRestController;
import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.constant.APIConstants;
import com.jotform.endrnce.constant.QueryConstants;
import com.jotform.endrnce.exception.ForbiddenException;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.modules.role.dao.dto.RoleQueryDTO;
import com.jotform.endrnce.modules.role.dao.dto.RoleRequestDTO;
import com.jotform.endrnce.modules.role.dao.entity.Role;
import com.jotform.endrnce.modules.role.service.RoleService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(APIConstants.ROLE_PATH)
public class RoleController implements SecuredRestController {

    private final RoleService roleService;

    @Operation(
            summary = "Get Role Query List",
            tags = {"RoleController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Role List",
                            content = @Content(schema = @Schema(implementation = RoleQueryDTO.class))),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden",
                            content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            })
    @ResponseBody
    @GetMapping("/query")
    @PreAuthorize("hasRole('ADMIN')")
    public QueryResponse<List<RoleQueryDTO>> getRoleQuery(
            @RequestParam(value = "page", defaultValue = QueryConstants.currentPage) int page,
            @RequestParam(value = "items_per_page", defaultValue = QueryConstants.itemPerPage) int items_per_page,
            @RequestParam(value = "sort", defaultValue = "name") String sort,
            @RequestParam(value = "order", defaultValue = QueryConstants.order) String order,
            @RequestParam(value = "search") Optional<String> optionalSearch
    ) {
        String search = optionalSearch.orElse("");

        return roleService.getRoleQuery(page, items_per_page, sort, order, search);

    }

    @Operation(
            summary = "Get Role By Id",
            tags = {"RoleController"})
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Get Role Info",
                            content = @Content(schema = @Schema(implementation = Role.class))),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Role Not Found",
                            content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
            })
    @GetMapping("/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Role getRoleById(@PathVariable Long roleId) {
        return roleService.getRoleById(roleId);
    }

    @Operation(
            summary = "Create a new Role",
            tags = {"RoleController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Role created",
                    content = @Content(schema = @Schema(implementation = Role.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
    })
    @ResponseBody
    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleRequestDTO roleRequestDTO) {
        Role role = roleService.createRole(roleRequestDTO);

        return new ResponseEntity<>(role, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update Role",
            tags = {"RoleController"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Role updated",
                    content = @Content(schema = @Schema(implementation = Role.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "Role Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })
    @PutMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> updateRole(@Valid @RequestBody RoleRequestDTO roleRequestDTO) {
        Role role = roleService.updateRole(roleRequestDTO);

        return new ResponseEntity<>(role, HttpStatus.OK);
    }

    @Operation(
            summary = "Delete Role By Id",
            tags = {"RoleController"})
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Delete Role By Id",
                    content = @Content(schema = @Schema(implementation = Role.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ForbiddenException.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Role Not Found",
                    content = @Content(schema = @Schema(implementation = NotFoundRequestException.class))),
    })

    @ResponseBody
    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Role> deleteRole(@PathVariable Long roleId) {
        Role role = roleService.deleteRole(roleId);

        return new ResponseEntity<>(role, HttpStatus.OK);
    }
}