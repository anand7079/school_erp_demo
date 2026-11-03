
package com.school.erp.demo.school.service;

import com.school.erp.demo.school.dto.BranchResponse;
import com.school.erp.demo.school.entity.Branch;
import com.school.erp.demo.school.entity.School;
import com.school.erp.demo.school.mapper.BranchMapper;
import com.school.erp.demo.school.repository.BranchRepository;
import com.school.erp.demo.school.repository.SchoolRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final SchoolRepository schoolRepository;
    private final BranchMapper branchMapper;

    @Transactional
    public BranchResponse createBranch(
            String name,
            String code,
            String address) {

        // Find the registered school
        School school = schoolRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Please register the school first"));

        Long schoolId = school.getId();

        // Check for duplicate branch code
        if (branchRepository.existsBySchool_IdAndCode(schoolId, code)) {
            throw new IllegalArgumentException(
                    "Branch code already exists");
        }

        // Check for duplicate branch name
        if (branchRepository.existsBySchool_IdAndName(schoolId, name)) {
            throw new IllegalArgumentException(
                    "Branch name already exists");
        }

        // Create Branch entity
        Branch branch = new Branch();

        branch.setSchool(school);
        branch.setName(name);
        branch.setCode(code);
        branch.setAddress(address);
        branch.setActive(true);

        // Save branch
        Branch savedBranch = branchRepository.save(branch);

        // Convert entity into DTO
        return branchMapper.toResponse(savedBranch);
    }

    @Transactional(readOnly = true)
    public List<BranchResponse> getBranches() {

        // Find the registered school
        School school = schoolRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "School has not been registered"));

        // Fetch and convert branches into DTOs
        return branchRepository.findBySchool_Id(school.getId())
                .stream()
                .map(branchMapper::toResponse)
                .toList();
    }
}
