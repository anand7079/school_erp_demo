
package com.school.erp.demo.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolCreateRequest {

    @NotBlank(message = "School name is required")
    @Size(max = 150, message = "School name cannot exceed 150 characters")
    private String name;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;
}
