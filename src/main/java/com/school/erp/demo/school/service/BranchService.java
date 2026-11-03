
package com.school.erp.demo.school.service;

import com.school.erp.demo.school.entity.Branch;
import com.school.erp.demo.school.entity.School;
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

    @Transactional
    public Branch createBranch(
            Long schoolId,
            String name,
            String code,
            String address) {

        // 1. Check whether the school exists
        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new IllegalArgumentException("School not found"));

        // 2. Check whether the branch code already exists
        if (branchRepository.existsBySchool_IdAndCode(schoolId, code)) {
            throw new IllegalArgumentException(
                    "Branch code already exists");
        }

        // 3. Create the branch
        Branch branch = new Branch();

        branch.setSchool(school);
        branch.setName(name);
        branch.setCode(code);
        branch.setAddress(address);
        branch.setActive(true);

        // 4. Save and return the branch
        return branchRepository.save(branch);
    }

    @Transactional(readOnly = true)
    public List<Branch> getBranchesBySchool(Long schoolId) {

        // Check whether the school exists
        if (!schoolRepository.existsById(schoolId)) {
            throw new IllegalArgumentException("School not found");
        }

        return branchRepository.findBySchool_Id(schoolId);
    }
}
