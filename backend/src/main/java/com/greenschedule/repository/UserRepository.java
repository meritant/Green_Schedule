package com.greenschedule.repository;

import com.greenschedule.model.entity.User;
import com.greenschedule.model.entity.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmployeeNumber(String employeeNumber);
    long countByRole(UserRole role);
}