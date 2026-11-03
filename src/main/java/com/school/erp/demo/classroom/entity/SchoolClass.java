package com.school.erp.demo.classroom.entity;

import com.school.erp.demo.school.entity.Branch;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "classes")
@Getter @Setter @NoArgsConstructor
public class SchoolClass {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(length = 30)
    private String code;
    @Column(length = 255)
    private String description;
    @Column(nullable = false)
    private Boolean active = true;
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
