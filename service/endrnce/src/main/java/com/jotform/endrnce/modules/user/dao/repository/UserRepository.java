package com.jotform.endrnce.modules.user.dao.repository;

import com.jotform.endrnce.modules.user.dao.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findByProviderTypeIdAndEmail(Long providerTypeId, String email);
    Optional<User> findFirstByEmailAndProviderTypeId(String email, Long providerTypeId);

}
