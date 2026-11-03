package com.school.erp.demo.classroom.service;

import com.school.erp.demo.classroom.dto.ClassRequest;
import com.school.erp.demo.classroom.dto.ClassResponse;
import com.school.erp.demo.classroom.entity.SchoolClass;
import com.school.erp.demo.classroom.mapper.SchoolClassMapper;
import com.school.erp.demo.classroom.repository.SchoolClassRepository;
import com.school.erp.demo.school.entity.Branch;
import com.school.erp.demo.school.repository.BranchRepository;
import com.school.erp.demo.section.repository.SectionRepository;
import com.school.erp.demo.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service @RequiredArgsConstructor
public class SchoolClassService {
    private final SchoolClassRepository repository;
    private final BranchRepository branchRepository;
    private final SchoolClassMapper mapper;
    private final SectionRepository sectionRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public ClassResponse create(ClassRequest request) {
        Branch branch = branch(request.getBranchId());
        checkDuplicate(branch.getId(), request.getName(), request.getCode(), null);
        SchoolClass value = new SchoolClass();
        value.setBranch(branch);
        apply(value, request);
        return mapper.toResponse(repository.save(value));
    }
    @Transactional(readOnly = true)
    public List<ClassResponse> list(Long branchId) {
        branch(branchId);
        return repository.findByBranchIdOrderByNameAsc(branchId).stream().map(mapper::toResponse).toList();
    }
    @Transactional(readOnly = true)
    public ClassResponse get(Long id) { return mapper.toResponse(byId(id)); }
    @Transactional
    public ClassResponse update(Long id, ClassRequest request) {
        SchoolClass value = byId(id);
        Branch branch = branch(request.getBranchId());
        if (repository.existsByIdAndBranchIdNot(id, branch.getId())
                && (sectionRepository.existsBySchoolClassId(id) || studentRepository.existsBySchoolClassId(id))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot move a class to another branch after sections or students are assigned");
        }
        checkDuplicate(branch.getId(), request.getName(), request.getCode(), id);
        value.setBranch(branch);
        apply(value, request);
        return mapper.toResponse(repository.save(value));
    }
    @Transactional
    public ClassResponse setActive(Long id, boolean active) {
        SchoolClass value = byId(id); value.setActive(active); return mapper.toResponse(repository.save(value));
    }
    private void checkDuplicate(Long branchId, String name, String code, Long excludeId) {
        boolean nameExists = excludeId == null ? repository.existsByBranchIdAndNameIgnoreCase(branchId, name.trim())
                : repository.existsByBranchIdAndNameIgnoreCaseAndIdNot(branchId, name.trim(), excludeId);
        boolean codeExists = code != null && !code.isBlank() && (excludeId == null
                ? repository.existsByBranchIdAndCodeIgnoreCase(branchId, code.trim())
                : repository.existsByBranchIdAndCodeIgnoreCaseAndIdNot(branchId, code.trim(), excludeId));
        if (nameExists || codeExists) throw new ResponseStatusException(HttpStatus.CONFLICT, "Class name or code already exists in this branch");
    }
    private void apply(SchoolClass value, ClassRequest request) {
        value.setName(request.getName().trim());
        value.setCode(request.getCode() == null || request.getCode().isBlank() ? null : request.getCode().trim());
        value.setDescription(request.getDescription());
    }
    private Branch branch(Long id) { return branchRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Branch not found")); }
    private SchoolClass byId(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found")); }
}
