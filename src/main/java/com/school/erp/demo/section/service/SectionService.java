package com.school.erp.demo.section.service;

import com.school.erp.demo.classroom.entity.SchoolClass;
import com.school.erp.demo.classroom.repository.SchoolClassRepository;
import com.school.erp.demo.section.dto.SectionRequest;
import com.school.erp.demo.section.dto.SectionResponse;
import com.school.erp.demo.section.entity.Section;
import com.school.erp.demo.section.mapper.SectionMapper;
import com.school.erp.demo.section.repository.SectionRepository;
import com.school.erp.demo.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service @RequiredArgsConstructor
public class SectionService {
    private final SectionRepository repository;
    private final SchoolClassRepository classRepository;
    private final SectionMapper mapper;
    private final StudentRepository studentRepository;
    @Transactional
    public SectionResponse create(SectionRequest request) {
        SchoolClass parent = schoolClass(request.getClassId());
        checkDuplicate(parent.getId(), request.getName(), null);
        Section section = new Section(); section.setSchoolClass(parent); apply(section, request);
        return mapper.toResponse(repository.save(section));
    }
    @Transactional(readOnly = true)
    public List<SectionResponse> list(Long classId) {
        schoolClass(classId);
        return repository.findBySchoolClassIdOrderByNameAsc(classId).stream().map(mapper::toResponse).toList();
    }
    @Transactional(readOnly = true)
    public SectionResponse get(Long id) { return mapper.toResponse(byId(id)); }
    @Transactional
    public SectionResponse update(Long id, SectionRequest request) {
        Section section = byId(id); SchoolClass parent = schoolClass(request.getClassId());
        if (!section.getSchoolClass().getId().equals(parent.getId()) && studentRepository.existsBySectionId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot move a section to another class while students are assigned");
        }
        checkDuplicate(parent.getId(), request.getName(), id);
        section.setSchoolClass(parent); apply(section, request);
        return mapper.toResponse(repository.save(section));
    }
    @Transactional
    public SectionResponse setActive(Long id, boolean active) { Section section = byId(id); section.setActive(active); return mapper.toResponse(repository.save(section)); }
    private void checkDuplicate(Long classId, String name, Long excludeId) {
        boolean exists = excludeId == null ? repository.existsBySchoolClassIdAndNameIgnoreCase(classId, name.trim())
                : repository.existsBySchoolClassIdAndNameIgnoreCaseAndIdNot(classId, name.trim(), excludeId);
        if (exists) throw new ResponseStatusException(HttpStatus.CONFLICT, "Section name already exists in this class");
    }
    private void apply(Section section, SectionRequest request) { section.setName(request.getName().trim()); section.setCapacity(request.getCapacity()); }
    private SchoolClass schoolClass(Long id) { return classRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found")); }
    private Section byId(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Section not found")); }
}
