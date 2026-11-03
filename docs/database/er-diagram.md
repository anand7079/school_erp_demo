# School ERP - Entity Relationship Diagram

```mermaid
erDiagram
    SCHOOLS ||--o{ BRANCHES : has
    BRANCHES ||--o{ CLASSES : offers
    CLASSES ||--o{ SECTIONS : contains
    SCHOOLS ||--o{ STUDENTS : enrolls
    BRANCHES ||--o{ STUDENTS : registers
    CLASSES ||--o{ STUDENTS : places
    SECTIONS ||--o{ STUDENTS : assigns
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned
    USERS ||--o{ USER_BRANCHES : assigned
    BRANCHES ||--o{ USER_BRANCHES : contains

    SCHOOLS {
        bigint id PK
        varchar name
        varchar address
        boolean active
        timestamp created_at
    }

    BRANCHES {
        bigint id PK
        bigint school_id FK
        varchar name
        varchar code
        varchar address
        boolean active
        timestamp created_at
    }

    CLASSES {
        bigint id PK
        bigint branch_id FK
        varchar name
        varchar code
        varchar description
        boolean active
        timestamp created_at
    }

    SECTIONS {
        bigint id PK
        bigint class_id FK
        varchar name
        integer capacity
        boolean active
        timestamp created_at
    }

    STUDENTS {
        bigint id PK
        bigint school_id FK
        bigint branch_id FK
        bigint class_id FK
        bigint section_id FK
        varchar admission_number UK
        varchar first_name
        varchar last_name
        date date_of_birth
        varchar email
        varchar mobile
        boolean active
        varchar fee_status
        timestamp created_at
    }

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        boolean active
        timestamp created_at
    }

    ROLES {
        bigint id PK
        varchar name UK
        varchar description
    }

    USER_ROLES {
        bigint user_id PK, FK
        bigint role_id PK, FK
    }

    USER_BRANCHES {
        bigint user_id PK, FK
        bigint branch_id PK, FK
        timestamp assigned_at
    }
```

Student admission numbers are unique within a school (`school_id`, `admission_number`).
Student fee status is `PAID` or `UNPAID`; the migration defaults existing and new records to `UNPAID`.
