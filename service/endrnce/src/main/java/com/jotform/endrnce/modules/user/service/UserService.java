package com.jotform.endrnce.modules.user.service;

import com.jotform.endrnce.common.payload.response.QueryResponse;
import com.jotform.endrnce.common.util.DaoUtil;
import com.jotform.endrnce.exception.NotFoundRequestException;
import com.jotform.endrnce.exception.ResourceNotFoundException;
import com.jotform.endrnce.modules.providertype.enums.ProviderTypeEnum;
import com.jotform.endrnce.modules.user.dao.dto.*;
import com.jotform.endrnce.modules.user.dao.entity.User;
import com.jotform.endrnce.modules.user.dao.repository.UserRepository;
import com.jotform.endrnce.modules.user.dao.rowmapper.UserRowMapper;
import com.jotform.endrnce.modules.user_role.dao.entity.UserRole;
import com.jotform.endrnce.modules.user_role.dao.repository.UserRoleRepository;
import com.jotform.endrnce.modules.user_role.service.UserRoleService;
import com.jotform.endrnce.security.TokenProvider;
import com.jotform.endrnce.security.UserPrincipal;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final UserRoleService userRoleService;

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public String authenticateUser(LoginRequestDTO loginRequest) throws BadCredentialsException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findById(((UserPrincipal) authentication.getPrincipal()).getId()).orElse(null);
        if(ObjectUtils.isNotEmpty(user)) {
            user.setLastLoginDate(new Date());

            userRepository.save(user);
        }

        return tokenProvider.createToken(authentication);
    }

    public UserDTO getCurrentUser(UserPrincipal userPrincipal) throws ResourceNotFoundException {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper.map(user, UserDTO.class);
    }

    @Transactional
    public User registerUser(RegisterRequestDTO registerRequest) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        User user = modelMapper.map(registerRequest, User.class);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setProviderTypeId(ProviderTypeEnum.ON_SITE.getId());
        user.setCreatedDate(new Date());

        userRepository.save(user);

        UserRole userRole = new UserRole();
        userRole.setUserId(user.getId());
        userRole.setRoleId(1L);
        userRoleRepository.save(userRole);

        return user;
    }

    public QueryResponse<List<UserQueryDTO>> getUserQuery(
            int page,
            int items_per_page,
            String sort,
            String order,
            String search
    ) {
        Pageable pagination = PageRequest.of(page - 1, items_per_page);
        String searchWhere = " AND (u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search ) ";

        String sqlCounter = DaoUtil.getQuery("selectCountUserQuery");
        sqlCounter = sqlCounter.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);

        MapSqlParameterSource mapSqlParameterCount = new MapSqlParameterSource();
        mapSqlParameterCount.addValue("search", "%" + search + "%");
        Integer totalRows = namedParameterJdbcTemplate.queryForObject(sqlCounter, mapSqlParameterCount, Integer.class);
        totalRows = totalRows == null ? 0 : totalRows;

        String sql = DaoUtil.getQuery("selectUserQuery");
        sql = sql.replace("{WHERE}", ObjectUtils.isEmpty(search) ? "" : searchWhere);
        sql = sql.replace("{ORDERBY}", String.format(" ORDER BY %s %s ", sort, order));

        MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
        mapSqlParameterSource.addValue("search", "%" + search + "%");
        mapSqlParameterSource.addValue("limit", pagination.getPageSize());
        mapSqlParameterSource.addValue("offset", pagination.getOffset());

        List<UserQueryDTO> userQueryDTOList = namedParameterJdbcTemplate.query(
                sql,
                mapSqlParameterSource,
                new UserRowMapper.UserDTOMapper()
        );

        return QueryResponse.<List<UserQueryDTO>>builder()
                .data(userQueryDTOList)
                .totalRows(totalRows)
                .pageCount((int) Math.ceil((float)totalRows / items_per_page))
                .build();
    }

    public UserFormDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundRequestException("User not found"));

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper.map(user, UserFormDTO.class);
    }

    @Transactional
    public User createUser(UserRequestDTO userRequestDTO) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        User user = modelMapper.map(userRequestDTO, User.class);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setProviderTypeId(ProviderTypeEnum.ON_SITE.getId());
        user.setCreatedDate(new Date());

        userRepository.save(user);

        userRoleService.saveOrUpdateUserRoles(userRequestDTO.getRoleIds(), user.getId());

        return user;
    }

    public User updateUser(UserUpdateRequestDTO userUpdateRequestDTO) {
        Optional<User> userOptional = userRepository.findById(userUpdateRequestDTO.getId());
        if (ObjectUtils.isEmpty(userUpdateRequestDTO.getId()) || userOptional.isEmpty()) {
            throw new NotFoundRequestException("User is not found!");
        }

        User user = userOptional.get();
        user.setFirstName(userUpdateRequestDTO.getFirstName());
        user.setLastName(userUpdateRequestDTO.getLastName());
        user.setEmail(userUpdateRequestDTO.getEmail());
        user.setEmail(userUpdateRequestDTO.getEmail());

        userRepository.save(user);

        userRoleService.saveOrUpdateUserRoles(userUpdateRequestDTO.getRoleIds(), user.getId());

        return user;
    }

    public User updateUserPassword(UserUpdatePasswordRequestDTO userUpdatePasswordRequestDTO) {
        Optional<User> userOptional = userRepository.findById(userUpdatePasswordRequestDTO.getId());
        if (ObjectUtils.isEmpty(userUpdatePasswordRequestDTO.getId()) || userOptional.isEmpty()) {
            throw new NotFoundRequestException("User is not found!");
        }

        User user = userOptional.get();

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundRequestException("User is not found"));
        userRepository.delete(user);

        return user;
    }
}
