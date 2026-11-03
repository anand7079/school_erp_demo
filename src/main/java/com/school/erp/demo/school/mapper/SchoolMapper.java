
package com.school.erp.demo.school.mapper;

import com.school.erp.demo.school.dto.SchoolResponse;
import com.school.erp.demo.school.entity.School;
import org.springframework.stereotype.Component;

@Component
public class SchoolMapper {

    public SchoolResponse toResponse(School school) {

        SchoolResponse response = new SchoolResponse();

        response.setId(school.getId());
        response.setName(school.getName());
        response.setAddress(school.getAddress());
        response.setActive(school.getActive());
        response.setCreatedAt(school.getCreatedAt());

        return response;
    }
}
