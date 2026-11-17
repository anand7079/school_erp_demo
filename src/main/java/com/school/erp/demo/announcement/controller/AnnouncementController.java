package com.school.erp.demo.announcement.controller;

import com.school.erp.demo.announcement.dto.AnnouncementCreateRequest;
import com.school.erp.demo.announcement.dto.AnnouncementResponse;
import com.school.erp.demo.announcement.service.AnnouncementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService service;

    @PostMapping
    public ResponseEntity<AnnouncementResponse> create(@Valid @RequestBody AnnouncementCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request.getText()));
    }

    @GetMapping
    public ResponseEntity<Page<AnnouncementResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(service.list(page, size));
    }
}
