
package com.school.erp.demo.school.repository;

import com.school.erp.demo.school.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    Optional<Branch> findBySchool_IdAndCode(Long schoolId, String code);

    List<Branch> findBySchool_Id(Long schoolId);

    List<Branch> findBySchool_IdAndActiveTrue(Long schoolId);

    boolean existsBySchool_IdAndCode(Long schoolId, String code);

    boolean existsBySchool_IdAndName(Long schoolId, String name);
}
