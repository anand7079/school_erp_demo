
package com.school.erp.demo.user.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private Boolean active;

    private Set<String> roles;

    private Set<Long> branchIds;

    private LocalDateTime createdAt;
}
