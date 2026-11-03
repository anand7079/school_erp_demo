
package com.school.erp.demo.school.controller;

import com.school.erp.demo.school.dto.SchoolCreateRequest;
import com.school.erp.demo.school.dto.SchoolResponse;
import com.school.erp.demo.school.service.SchoolService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    // Register a new school
    @PostMapping
    public ResponseEntity<SchoolResponse> createSchool(
            @Valid @RequestBody SchoolCreateRequest request) {

        SchoolResponse response = schoolService.createSchool(
                request.getName(),
                request.getAddress()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Retrieve registered school
    @GetMapping
    public ResponseEntity<SchoolResponse> getSchool() {

        Optional<SchoolResponse> school = schoolService.getSchool();

        return school
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
