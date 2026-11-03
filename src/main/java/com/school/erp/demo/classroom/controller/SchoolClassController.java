package com.school.erp.demo.classroom.controller;

import com.school.erp.demo.classroom.dto.ClassRequest;
import com.school.erp.demo.classroom.dto.ClassResponse;
import com.school.erp.demo.classroom.service.SchoolClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/classes") @RequiredArgsConstructor
public class SchoolClassController {
    private final SchoolClassService service;
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ClassResponse create(@Valid @RequestBody ClassRequest request) { return service.create(request); }
    @GetMapping public List<ClassResponse> list(@RequestParam Long branchId) { return service.list(branchId); }
    @GetMapping("/{id}") public ClassResponse get(@PathVariable Long id) { return service.get(id); }
    @PutMapping("/{id}") public ClassResponse update(@PathVariable Long id, @Valid @RequestBody ClassRequest request) { return service.update(id, request); }
    @PatchMapping("/{id}/status") public ClassResponse setActive(@PathVariable Long id, @RequestParam boolean active) { return service.setActive(id, active); }
}
