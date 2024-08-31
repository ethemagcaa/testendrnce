package com.jotform.endrnce.modules.user_role.service;

import com.jotform.endrnce.modules.user_role.dao.entity.UserRole;
import com.jotform.endrnce.modules.user_role.dao.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserRoleService {
    private final UserRoleRepository userRoleRepository;

    @Transactional
    public void saveOrUpdateUserRoles(Long[] roleIds, Long userId) {
        List<UserRole> existingUserRoles = userRoleRepository.findByUserId(userId);
        userRoleRepository.deleteAll(existingUserRoles);

        for (Long roleId : roleIds) {
            UserRole userRole = new UserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRoleRepository.save(userRole);
        }
    }
}
