package com.school.erp.demo.announcement.service;

import com.school.erp.demo.announcement.dto.AnnouncementResponse;
import com.school.erp.demo.announcement.entity.Announcement;
import com.school.erp.demo.announcement.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository repository;

    @Transactional
    public AnnouncementResponse create(String text) {
        Announcement a = new Announcement();
        a.setText(text);
        a.setCreatedAt(LocalDateTime.now());
        Announcement saved = repository.save(a);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<AnnouncementResponse> list(int page, int size) {
        if (size <= 0) size = 20;
        if (size > 20) size = 20;
        if (page < 0) page = 0;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    private AnnouncementResponse toResponse(Announcement a) {
        AnnouncementResponse r = new AnnouncementResponse();
        r.setId(a.getId());
        r.setText(a.getText());
        r.setCreatedAt(a.getCreatedAt());
        return r;
    }
}
