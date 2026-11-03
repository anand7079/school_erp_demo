package com.school.erp.demo.section.mapper;

import com.school.erp.demo.section.dto.SectionResponse;
import com.school.erp.demo.section.entity.Section;
import org.springframework.stereotype.Component;

@Component
public class SectionMapper {
    public SectionResponse toResponse(Section value) {
        return new SectionResponse(value.getId(), value.getSchoolClass().getId(), value.getSchoolClass().getName(),
                value.getSchoolClass().getBranch().getId(), value.getName(), value.getCapacity(), value.getActive(), value.getCreatedAt());
    }
}
