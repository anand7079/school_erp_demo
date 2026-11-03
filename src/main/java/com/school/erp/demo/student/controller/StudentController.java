package com.school.erp.demo.student.controller;

import com.school.erp.demo.student.dto.StudentRequest;
import com.school.erp.demo.student.dto.StudentResponse;
import com.school.erp.demo.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse create(@Valid @RequestBody StudentRequest request) { return studentService.create(request); }

    @GetMapping
    public Page<StudentResponse> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size,
                                      @RequestParam(required = false) String search) {
        return studentService.list(page, size, search);
    }

    @GetMapping("/{id}")
    public StudentResponse get(@PathVariable Long id) { return studentService.get(id); }

    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return studentService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public StudentResponse setActive(@PathVariable Long id, @RequestParam boolean active) {
        return studentService.setActive(id, active);
    }
}
