package com.school.erp.demo.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StudentRequest {
    @NotNull(message = "Branch is required")
    private Long branchId;

    @NotNull(message = "Class is required")
    private Long classId;

    @NotNull(message = "Section is required")
    private Long sectionId;

    @NotBlank(message = "Admission number is required")
    @Size(max = 50)
    private String admissionNumber;

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Email(message = "Please provide a valid email address")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String mobile;
}
