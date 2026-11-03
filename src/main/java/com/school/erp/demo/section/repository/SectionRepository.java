package com.school.erp.demo.section.repository;

import com.school.erp.demo.section.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findBySchoolClassIdOrderByNameAsc(Long classId);
    boolean existsBySchoolClassIdAndNameIgnoreCase(Long classId, String name);
    boolean existsBySchoolClassIdAndNameIgnoreCaseAndIdNot(Long classId, String name, Long id);
    boolean existsBySchoolClassId(Long classId);
}
