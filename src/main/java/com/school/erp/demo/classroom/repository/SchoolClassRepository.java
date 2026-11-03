package com.school.erp.demo.classroom.repository;

import com.school.erp.demo.classroom.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByBranchIdOrderByNameAsc(Long branchId);
    boolean existsByBranchIdAndNameIgnoreCase(Long branchId, String name);
    boolean existsByBranchIdAndCodeIgnoreCase(Long branchId, String code);
    boolean existsByBranchIdAndNameIgnoreCaseAndIdNot(Long branchId, String name, Long id);
    boolean existsByBranchIdAndCodeIgnoreCaseAndIdNot(Long branchId, String code, Long id);
    boolean existsByIdAndBranchIdNot(Long id, Long branchId);
}
