package com.jotform.endrnce.modules.user_role.dao.repository;

import com.jotform.endrnce.modules.user_role.dao.entity.UserRole;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface UserRoleRepository extends CrudRepository<UserRole, Long> {
    List<UserRole> findByUserId(Long userId);
}
