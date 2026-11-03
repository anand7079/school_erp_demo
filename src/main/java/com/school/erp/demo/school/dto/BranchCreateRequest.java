
package com.school.erp.demo.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BranchCreateRequest {

    @NotBlank(message = "Branch name is required")
    @Size(max = 150, message = "Branch name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Branch code is required")
    @Size(max = 30, message = "Branch code cannot exceed 30 characters")
    private String code;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;
}
