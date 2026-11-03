package com.school.erp.demo.classroom.dto;

import java.time.LocalDateTime;

public record ClassResponse(Long id, Long branchId, String branchName, String name,
                            String code, String description, Boolean active, LocalDateTime createdAt) { }
