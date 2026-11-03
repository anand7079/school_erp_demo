ALTER TABLE students
    ADD COLUMN class_id BIGINT REFERENCES classes (id),
    ADD COLUMN section_id BIGINT REFERENCES sections (id),
    ADD COLUMN fee_status VARCHAR(10) NOT NULL DEFAULT 'UNPAID',
    ADD CONSTRAINT chk_students_fee_status CHECK (fee_status IN ('PAID', 'UNPAID'));

CREATE INDEX idx_students_class_id ON students (class_id);
CREATE INDEX idx_students_section_id ON students (section_id);
CREATE INDEX idx_students_fee_status ON students (fee_status);
