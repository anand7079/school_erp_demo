package com.school.erp.demo.classroom.mapper;

import com.school.erp.demo.classroom.dto.ClassResponse;
import com.school.erp.demo.classroom.entity.SchoolClass;
import org.springframework.stereotype.Component;

@Component
public class SchoolClassMapper {
    public ClassResponse toResponse(SchoolClass value) {
        return new ClassResponse(value.getId(), value.getBranch().getId(), value.getBranch().getName(),
                value.getName(), value.getCode(), value.getDescription(), value.getActive(), value.getCreatedAt());
    }
}
