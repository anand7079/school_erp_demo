
package com.school.erp.demo.school.controller;

import com.school.erp.demo.school.dto.BranchCreateRequest;
import com.school.erp.demo.school.dto.BranchResponse;
import com.school.erp.demo.school.service.BranchService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    // Create a new branch
    @PostMapping
    public ResponseEntity<BranchResponse> createBranch(
            @Valid @RequestBody BranchCreateRequest request) {

        BranchResponse response = branchService.createBranch(
                request.getName(),
                request.getCode(),
                request.getAddress()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all branches
    @GetMapping
    public ResponseEntity<List<BranchResponse>> getBranches() {

        List<BranchResponse> branches = branchService.getBranches();

        return ResponseEntity.ok(branches);
    }
}
