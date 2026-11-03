# School ERP - Entity Relationship Diagram

```mermaid
erDiagram
    SCHOOLS ||--o{ BRANCHES : has
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned
    USERS ||--o{ USER_BRANCHES : assigned
    BRANCHES ||--o{ USER_BRANCHES : contains
```