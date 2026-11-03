
package com.school.erp.demo.school.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BranchResponse {

    private Long id;

    private Long schoolId;

    private String name;

    private String code;

    private String address;

    private Boolean active;

    private LocalDateTime createdAt;
}
