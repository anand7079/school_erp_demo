
package com.school.erp.demo.school.service;

import com.school.erp.demo.school.entity.School;
import com.school.erp.demo.school.repository.SchoolRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;

    @Transactional
    public School createSchool(String name, String address) {

        // Only one school is allowed in this application
        if (schoolRepository.count() > 0) {
            throw new IllegalStateException(
                    "School has already been registered");
        }

        School school = new School();

        school.setName(name);
        school.setAddress(address);
        school.setActive(true);

        return schoolRepository.save(school);
    }

    @Transactional(readOnly = true)
    public Optional<School> getSchool() {

        return schoolRepository.findAll()
                .stream()
                .findFirst();
    }
}
