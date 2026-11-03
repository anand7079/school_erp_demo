package com.school.erp.demo.classroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ClassRequest {
    @NotNull(message = "Branch is required")
    private Long branchId;
    @NotBlank(message = "Class name is required")
    @Size(max = 100)
    private String name;
    @Size(max = 30)
    private String code;
    @Size(max = 255)
    private String description;
}
