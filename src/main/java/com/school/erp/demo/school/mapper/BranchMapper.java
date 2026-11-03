
package com.school.erp.demo.school.mapper;

import com.school.erp.demo.school.dto.BranchResponse;
import com.school.erp.demo.school.entity.Branch;
import org.springframework.stereotype.Component;

@Component
public class BranchMapper {

    public BranchResponse toResponse(Branch branch) {

        BranchResponse response = new BranchResponse();

        response.setId(branch.getId());
        response.setSchoolId(branch.getSchool().getId());
        response.setName(branch.getName());
        response.setCode(branch.getCode());
        response.setAddress(branch.getAddress());
        response.setActive(branch.getActive());
        response.setCreatedAt(branch.getCreatedAt());

        return response;
    }
}
