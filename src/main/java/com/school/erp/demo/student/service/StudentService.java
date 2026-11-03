package com.school.erp.demo.student.service;

import com.school.erp.demo.school.entity.Branch;
import com.school.erp.demo.school.repository.BranchRepository;
import com.school.erp.demo.student.dto.StudentRequest;
import com.school.erp.demo.student.dto.StudentResponse;
import com.school.erp.demo.student.entity.Student;
import com.school.erp.demo.student.mapper.StudentMapper;
import com.school.erp.demo.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final BranchRepository branchRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public StudentResponse create(StudentRequest request) {
        Branch branch = getBranch(request.getBranchId());
        if (studentRepository.existsBySchoolIdAndAdmissionNumber(branch.getSchool().getId(), request.getAdmissionNumber().trim()))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                    "Admission number is already registered for this school");
        Student student = new Student();
        apply(student, request, branch);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> list(int page, int size, String search) {
        if (page < 0 || size < 1 || size > 100) throw new IllegalArgumentException("Page must be non-negative and size must be between 1 and 100");
        // This installation currently operates one school at a time; branch data supplies its school scope.
        Long schoolId = branchRepository.findAll().stream().findFirst()
                .map(b -> b.getSchool().getId()).orElse(null);
        if (schoolId == null) return Page.empty(PageRequest.of(page, size));
        PageRequest pageable = PageRequest.of(page, size, Sort.by("firstName").ascending());
        Page<Student> students = search == null || search.isBlank()
                ? studentRepository.findBySchoolId(schoolId, pageable)
                : studentRepository.findBySchoolIdAndFirstNameContainingIgnoreCaseOrSchoolIdAndLastNameContainingIgnoreCase(
                        schoolId, search.trim(), schoolId, search.trim(), pageable);
        return students.map(studentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public StudentResponse get(Long id) { return studentMapper.toResponse(getStudent(id)); }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = getStudent(id);
        Branch branch = getBranch(request.getBranchId());
        Long schoolId = branch.getSchool().getId();
        if (studentRepository.existsBySchoolIdAndAdmissionNumberAndIdNot(schoolId, request.getAdmissionNumber().trim(), id))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                    "Admission number is already registered for this school");
        apply(student, request, branch);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse setActive(Long id, boolean active) {
        Student student = getStudent(id);
        student.setActive(active);
        return studentMapper.toResponse(studentRepository.save(student));
    }

    private void apply(Student student, StudentRequest request, Branch branch) {
        student.setSchool(branch.getSchool());
        student.setBranch(branch);
        student.setAdmissionNumber(request.getAdmissionNumber().trim());
        student.setFirstName(request.getFirstName().trim());
        student.setLastName(request.getLastName() == null ? null : request.getLastName().trim());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEmail(request.getEmail());
        student.setMobile(request.getMobile());
    }

    private Branch getBranch(Long id) {
        return branchRepository.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Branch not found"));
    }
    private Student getStudent(Long id) {
        return studentRepository.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Student not found"));
    }
}
