package com.school.erp.demo.student.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.school.erp.demo.student.entity.FeeStatus;

public record StudentResponse(Long id, Long schoolId, Long branchId, String branchName,
                              Long classId, String className, Long sectionId, String sectionName,
                              String admissionNumber, String firstName, String lastName,
                              LocalDate dateOfBirth, String email, String mobile,
                              Boolean active, FeeStatus feeStatus, LocalDateTime createdAt) { }
