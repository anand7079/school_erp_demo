
package com.school.erp.demo.role.service;

import com.school.erp.demo.role.entity.Role;
import com.school.erp.demo.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {

        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role getRoleByName(String name) {

        return roleRepository.findByName(name)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Role not found: " + name));
    }
}
