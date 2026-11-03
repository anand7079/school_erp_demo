package com.school.erp.demo.section.dto;

import java.time.LocalDateTime;

public record SectionResponse(Long id, Long classId, String className, Long branchId,
                              String name, Integer capacity, Boolean active, LocalDateTime createdAt) { }
