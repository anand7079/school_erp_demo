package com.school.erp.demo.section.controller;

import com.school.erp.demo.section.dto.SectionRequest;
import com.school.erp.demo.section.dto.SectionResponse;
import com.school.erp.demo.section.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/sections") @RequiredArgsConstructor
public class SectionController {
    private final SectionService service;
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public SectionResponse create(@Valid @RequestBody SectionRequest request) { return service.create(request); }
    @GetMapping public List<SectionResponse> list(@RequestParam Long classId) { return service.list(classId); }
    @GetMapping("/{id}") public SectionResponse get(@PathVariable Long id) { return service.get(id); }
    @PutMapping("/{id}") public SectionResponse update(@PathVariable Long id, @Valid @RequestBody SectionRequest request) { return service.update(id, request); }
    @PatchMapping("/{id}/status") public SectionResponse setActive(@PathVariable Long id, @RequestParam boolean active) { return service.setActive(id, active); }
}
