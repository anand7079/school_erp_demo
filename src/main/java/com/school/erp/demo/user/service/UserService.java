
package com.school.erp.demo.user.service;

import com.school.erp.demo.user.entity.User;
import com.school.erp.demo.user.repository.UserRepository;
import com.school.erp.demo.user.dto.UserResponse;
import com.school.erp.demo.user.mapper.UserMapper;

import com.school.erp.demo.role.entity.Role;
import com.school.erp.demo.role.repository.RoleRepository;

import com.school.erp.demo.school.entity.Branch;
import com.school.erp.demo.school.repository.BranchRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse createUser(
            String fullName,
            String email,
            String passwordHash,
            Set<Long> roleIds,
            Set<Long> branchIds) {

        // Check whether email is already registered
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Every user must have at least one role
        if (roleIds == null || roleIds.isEmpty()) {
            throw new IllegalArgumentException("At least one role must be assigned");
        }

        // Fetch and validate selected roles
        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));

        if (roles.size() != roleIds.size()) {
            throw new IllegalArgumentException(
                    "One or more selected roles do not exist");
        }

        // Check whether the user is a school administrator
        boolean isSchoolAdmin = roles.stream()
                .anyMatch(role -> "SCHOOL_ADMIN".equals(role.getName()));

        // Non-school-admin users must have at least one branch
        if (!isSchoolAdmin && (branchIds == null || branchIds.isEmpty())) {
            throw new IllegalArgumentException(
                    "At least one branch must be assigned");
        }

        // Fetch and validate selected branches
        Set<Branch> branches = new HashSet<>();

        if (branchIds != null && !branchIds.isEmpty()) {

            branches.addAll(branchRepository.findAllById(branchIds));

            if (branches.size() != branchIds.size()) {
                throw new IllegalArgumentException(
                        "One or more selected branches do not exist");
            }
        }

        // Create the User entity
        User user = new User();

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setActive(true);
        user.setRoles(roles);
        user.setBranches(branches);

        // Save the user
        User savedUser = userRepository.save(user);

        // Convert entity into DTO before transaction ends
        return userMapper.toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }
}
