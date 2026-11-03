package com.school.erp.demo.student.controller;

import com.school.erp.demo.student.dto.StudentResponse;
import com.school.erp.demo.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class StudentPlacementController {
    private final StudentService studentService;

    @GetMapping("/{classId}/students")
    public List<StudentResponse> studentsInClass(@PathVariable Long classId) {
        return studentService.studentsInClass(classId);
    }

    @GetMapping("/{classId}/sections/{sectionId}/students")
    public List<StudentResponse> studentsInSection(@PathVariable Long classId, @PathVariable Long sectionId) {
        return studentService.studentsInSection(classId, sectionId);
    }
}
