
package com.school.erp.demo.school.service;

import com.school.erp.demo.school.dto.SchoolResponse;
import com.school.erp.demo.school.entity.School;
import com.school.erp.demo.school.mapper.SchoolMapper;
import com.school.erp.demo.school.repository.SchoolRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;

    @Transactional
    public SchoolResponse createSchool(String name, String address) {

        // Only one school is allowed in this application
        if (schoolRepository.count() > 0) {
            throw new IllegalStateException(
                    "School has already been registered");
        }

        School school = new School();

        school.setName(name);
        school.setAddress(address);
        school.setActive(true);

        School savedSchool = schoolRepository.save(school);

        return schoolMapper.toResponse(savedSchool);
    }

    @Transactional(readOnly = true)
    public Optional<SchoolResponse> getSchool() {

        return schoolRepository.findAll()
                .stream()
                .findFirst()
                .map(schoolMapper::toResponse);
    }
}
