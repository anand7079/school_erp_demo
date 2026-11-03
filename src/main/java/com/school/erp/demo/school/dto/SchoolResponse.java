
package com.school.erp.demo.school.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SchoolResponse {

    private Long id;

    private String name;

    private String address;

    private Boolean active;

    private LocalDateTime createdAt;
}
