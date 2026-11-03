package com.school.erp.demo.student.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudentResponse(Long id, Long schoolId, Long branchId, String branchName,
                              String admissionNumber, String firstName, String lastName,
                              LocalDate dateOfBirth, String email, String mobile,
                              Boolean active, LocalDateTime createdAt) { }
