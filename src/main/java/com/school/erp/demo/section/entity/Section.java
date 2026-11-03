package com.school.erp.demo.section.entity;

import com.school.erp.demo.classroom.entity.SchoolClass;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "sections") @Getter @Setter @NoArgsConstructor
public class Section {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;
    @Column(nullable = false, length = 50)
    private String name;
    private Integer capacity;
    @Column(nullable = false)
    private Boolean active = true;
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
