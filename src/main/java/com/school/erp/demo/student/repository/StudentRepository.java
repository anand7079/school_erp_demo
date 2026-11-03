package com.school.erp.demo.student.repository;

import com.school.erp.demo.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.school.erp.demo.student.entity.FeeStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsBySchoolIdAndAdmissionNumber(Long schoolId, String admissionNumber);
    boolean existsBySchoolIdAndAdmissionNumberAndIdNot(Long schoolId, String admissionNumber, Long id);
    Page<Student> findBySchoolId(Long schoolId, Pageable pageable);
    long countByFeeStatus(FeeStatus feeStatus);
    List<Student> findByFeeStatusOrderByFirstNameAscLastNameAsc(FeeStatus feeStatus);
    boolean existsBySchoolClassId(Long classId);
    boolean existsBySectionId(Long sectionId);
    Page<Student> findBySchoolIdAndFirstNameContainingIgnoreCaseOrSchoolIdAndLastNameContainingIgnoreCase(
            Long schoolId, String firstName, Long schoolIdAgain, String lastName, Pageable pageable);
}
