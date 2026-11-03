
package com.school.erp.demo.user.mapper;

import com.school.erp.demo.user.dto.UserResponse;
import com.school.erp.demo.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setActive(user.getActive());

        // Convert Role entities into role names
        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet())
        );

        // Convert Branch entities into branch IDs
        response.setBranchIds(
                user.getBranches()
                        .stream()
                        .map(branch -> branch.getId())
                        .collect(Collectors.toSet())
        );

        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}
