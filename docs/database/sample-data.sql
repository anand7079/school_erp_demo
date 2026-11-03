-- Sample data for one existing school branch.
-- The first branch by ID is used. Change the branch_id selection below if needed.
-- Creates Class 1 through Class 5, sections A/B, and 10 students per section.
-- Safe to re-run: existing class, section, and admission-number rows are skipped.

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM branches) THEN
        RAISE EXCEPTION 'Create a school and branch before running this sample-data script';
    END IF;
END $$;

-- Create five classes for the first branch.
INSERT INTO classes (branch_id, name, code, description)
SELECT b.id,
       'Class ' || n,
       'CLASS-' || n,
       'Sample class ' || n
FROM (SELECT id FROM branches ORDER BY id LIMIT 1) b
CROSS JOIN generate_series(1, 5) AS class_nums(n)
ON CONFLICT (branch_id, name) DO NOTHING;

-- Create sections A and B under each sample class.
INSERT INTO sections (class_id, name, capacity)
SELECT c.id, section_name, 30
FROM classes c
CROSS JOIN (VALUES ('A'), ('B')) AS section_data(section_name)
WHERE c.name IN ('Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5')
  AND c.branch_id = (SELECT id FROM branches ORDER BY id LIMIT 1)
ON CONFLICT (class_id, name) DO NOTHING;

-- Insert 10 synthetic students per section. Odd admission numbers are unpaid;
-- even admission numbers are paid, which makes the fee endpoints easy to try.
INSERT INTO students (
    school_id,
    branch_id,
    class_id,
    section_id,
    admission_number,
    first_name,
    last_name,
    date_of_birth,
    email,
    mobile,
    active,
    fee_status
)
SELECT b.school_id,
       b.id,
       c.id,
       s.id,
       format('SAMPLE-C%s-%s-%s', class_number, s.name, lpad(student_number::text, 2, '0')),
       'Student ' || lpad(student_number::text, 2, '0'),
       format('Class %s Section %s', class_number, s.name),
       DATE '2014-01-01' + ((class_number * 365 + student_number * 13 + CASE s.name WHEN 'B' THEN 100 ELSE 0 END) % 2500),
       lower(format('sample.c%s.%s.%s@example.test', class_number, s.name, student_number)),
       '90000' || lpad((class_number * 100 + CASE s.name WHEN 'B' THEN 50 ELSE 0 END + student_number)::text, 5, '0'),
       TRUE,
       CASE WHEN student_number % 2 = 0 THEN 'PAID' ELSE 'UNPAID' END
FROM (SELECT id, school_id FROM branches ORDER BY id LIMIT 1) b
JOIN classes c ON c.branch_id = b.id
CROSS JOIN generate_series(1, 5) AS class_nums(class_number)
JOIN sections s ON s.class_id = c.id
CROSS JOIN generate_series(1, 10) AS student_nums(student_number)
WHERE c.name = 'Class ' || class_number
  AND s.name IN ('A', 'B')
ON CONFLICT (school_id, admission_number) DO NOTHING;

COMMIT;
