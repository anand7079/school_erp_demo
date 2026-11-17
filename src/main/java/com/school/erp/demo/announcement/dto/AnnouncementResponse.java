package com.school.erp.demo.announcement.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AnnouncementResponse {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
}
