package com.school.erp.demo.student.mapper;

import com.school.erp.demo.student.dto.StudentResponse;
import com.school.erp.demo.student.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {
    public StudentResponse toResponse(Student student) {
        return new StudentResponse(student.getId(), student.getSchool().getId(), student.getBranch().getId(),
                student.getBranch().getName(), student.getSchoolClass() == null ? null : student.getSchoolClass().getId(),
                student.getSchoolClass() == null ? null : student.getSchoolClass().getName(),
                student.getSection() == null ? null : student.getSection().getId(),
                student.getSection() == null ? null : student.getSection().getName(),
                student.getAdmissionNumber(), student.getFirstName(),
                student.getLastName(), student.getDateOfBirth(), student.getEmail(), student.getMobile(),
                student.getActive(), student.getFeeStatus(), student.getCreatedAt());
    }
}
