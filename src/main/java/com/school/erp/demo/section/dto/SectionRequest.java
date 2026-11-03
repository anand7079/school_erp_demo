package com.school.erp.demo.section.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SectionRequest {
    @NotNull(message = "Class is required")
    private Long classId;
    @NotBlank(message = "Section name is required")
    @Size(max = 50)
    private String name;
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
}
