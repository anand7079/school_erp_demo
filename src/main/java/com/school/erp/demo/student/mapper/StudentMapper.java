package com.school.erp.demo.student.mapper;

import com.school.erp.demo.student.dto.StudentResponse;
import com.school.erp.demo.student.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {
    public StudentResponse toResponse(Student student) {
        return new StudentResponse(student.getId(), student.getSchool().getId(), student.getBranch().getId(),
                student.getBranch().getName(), student.getAdmissionNumber(), student.getFirstName(),
                student.getLastName(), student.getDateOfBirth(), student.getEmail(), student.getMobile(),
                student.getActive(), student.getCreatedAt());
    }
}
