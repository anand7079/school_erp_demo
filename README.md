# School ERP – School Management System

A backend application for managing school operations, including school registration, branch management, user management, role assignments, and student administration.

Built using **Java 21, Spring Boot, Spring Data JPA, Hibernate, PostgreSQL, and Flyway**.

The project follows a layered architecture with a focus on maintainability, scalability, secure data handling, and RESTful API development.

Our documentation URL is:

http://localhost:8080/swagger-ui/index.html

And the OpenAPI JSON specification is available at:

http://localhost:8080/v3/api-docs

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Application Architecture](#application-architecture)
5. [Project Structure](#project-structure)
6. [Database Design](#database-design)
7. [API Documentation](#api-documentation)
8. [Getting Started](#getting-started)
9. [Database Migration](#database-migration)
10. [Security](#security)
11. [Validation and Error Handling](#validation-and-error-handling)
12. [Development Roadmap](#development-roadmap)
13. [Development Guidelines](#development-guidelines)

---

## 1. Project Overview

The School ERP is designed to provide a centralized backend system for managing the administrative and academic operations of a school.

The application follows a **single-school architecture**. Each application instance manages one school, which can operate through one or multiple branches.

For example:

- A school with only one campus can register one branch.
- A school with multiple campuses can register multiple branches.
- Staff members can be assigned to multiple branches.
- School administrators have school-wide access, while other staff members can be assigned to specific branches.

The backend exposes REST APIs that can be consumed by a React-based frontend application.

### Primary Objectives

- Build a modular and maintainable backend.
- Implement RESTful APIs using Spring Boot.
- Manage relational data using PostgreSQL and Spring Data JPA.
- Maintain database schema changes through Flyway.
- Follow DTO-based request and response handling.
- Implement role-based access control.
- Store user passwords securely using BCrypt.
- Support branch-level data management.

---

## 2. Key Features

### Implemented

| Feature | Description |
|---|---|
| School Management | Register and retrieve the school's information. |
| Branch Management | Create branches and retrieve branches belonging to the registered school. |
| User Management | Create users and retrieve individual or all users. |
| Role Management Foundation | Predefined roles stored in the database. |
| Branch Assignment Foundation | Assign users to one or multiple branches. |
| User-Role Mapping | Support multiple roles for a user. |
| DTO Architecture | Separate API request/response objects from JPA entities. |
| Password Hashing | BCrypt password encoding before persistence. |
| Database Migration | Flyway-managed database schema. |
| Data Validation | Jakarta Bean Validation for request DTOs. |

### Planned

- Student management and CRUD operations.
- Class and section management.
- Student admission and enrollment.
- Parent and guardian management.
- Attendance management.
- Fee and payment management.
- Examination and results management.
- Timetable management.
- Role-based authorization.
- JWT-based authentication.
- Pagination, sorting, and filtering.
- Unit and integration testing.
- Docker-based deployment.

---

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Primary programming language |
| Spring Boot 4.1.2 | Application framework |
| Spring Web | REST API development |
| Spring Data JPA | Database access and repository abstraction |
| Hibernate | ORM implementation |
| PostgreSQL | Relational database |
| Flyway | Database version control and migrations |
| Spring Security | Security infrastructure |
| BCrypt | Password hashing |
| Jakarta Bean Validation | Request validation |
| Lombok | Reduces boilerplate code |
| Maven | Dependency management and build automation |
| Postman | API testing |

### Frontend (Planned)

- React
- JavaScript
- HTML5
- CSS3

---

## 4. Application Architecture

The application follows a layered architecture.

### Request Flow

```text
React Frontend / Postman
          |
          v
    REST Controller
          |
          v
      DTO Layer
          |
          v
     Service Layer
          |
          v
   Repository Layer
          |
          v
     Hibernate / JPA
          |
          v
      PostgreSQL
```

### Layer Responsibilities

**1. Controller Layer**

- Exposes REST endpoints.
- Receives HTTP requests.
- Validates incoming request DTOs.
- Delegates business operations to services.
- Returns appropriate HTTP responses.

**2. DTO Layer**

- Defines request and response structures.
- Prevents direct exposure of database entities.
- Controls which fields are accepted and returned by APIs.

**3. Service Layer**

- Contains business logic.
- Performs validations and business-rule checks.
- Coordinates repository operations.
- Manages transaction boundaries.
- Converts entities into response DTOs through mappers.

**4. Repository Layer**

- Handles database operations.
- Uses Spring Data JPA repositories.
- Provides CRUD operations and custom query methods.

**5. Entity Layer**

- Represents database tables.
- Defines entity relationships.
- Maps Java objects to PostgreSQL records using JPA annotations.

**6. Mapper Layer**

- Converts JPA entities into response DTOs.
- Keeps entity-to-response conversion separate from business logic.

**7. Config Layer**

- Contains application configuration and reusable Spring beans.
- Currently includes BCrypt password encoder configuration.

---

## 5. Project Structure

The project uses feature-based packages with separate architectural layers.

```text
school-erp/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── school/
│   │   │           └── erp/
│   │   │               └── demo/
│   │   │
│   │   │                   ├── config/
│   │   │                   │   └── PasswordEncoderConfig.java
│   │   │
│   │   │                   ├── school/
│   │   │                   │   ├── controller/
│   │   │                   │   │   ├── SchoolController.java
│   │   │                   │   │   └── BranchController.java
│   │   │                   │   │
│   │   │                   │   ├── dto/
│   │   │                   │   │   ├── SchoolCreateRequest.java
│   │   │                   │   │   ├── SchoolResponse.java
│   │   │                   │   │   ├── BranchCreateRequest.java
│   │   │                   │   │   └── BranchResponse.java
│   │   │                   │   │
│   │   │                   │   ├── entity/
│   │   │                   │   │   ├── School.java
│   │   │                   │   │   └── Branch.java
│   │   │                   │   │
│   │   │                   │   ├── mapper/
│   │   │                   │   │   ├── SchoolMapper.java
│   │   │                   │   │   └── BranchMapper.java
│   │   │                   │   │
│   │   │                   │   ├── repository/
│   │   │                   │   │   ├── SchoolRepository.java
│   │   │                   │   │   └── BranchRepository.java
│   │   │                   │   │
│   │   │                   │   └── service/
│   │   │                   │       ├── SchoolService.java
│   │   │                   │       └── BranchService.java
│   │   │                   │
│   │   │                   ├── user/
│   │   │                   │   ├── controller/
│   │   │                   │   │   └── UserController.java
│   │   │                   │   │
│   │   │                   │   ├── dto/
│   │   │                   │   │   ├── UserCreateRequest.java
│   │   │                   │   │   └── UserResponse.java
│   │   │                   │   │
│   │   │                   │   ├── entity/
│   │   │                   │   │   └── User.java
│   │   │                   │   │
│   │   │                   │   ├── mapper/
│   │   │                   │   │   └── UserMapper.java
│   │   │                   │   │
│   │   │                   │   ├── repository/
│   │   │                   │   │   └── UserRepository.java
│   │   │                   │   │
│   │   │                   │   └── service/
│   │   │                   │       └── UserService.java
│   │   │                   │
│   │   │                   ├── role/
│   │   │                   │   ├── entity/
│   │   │                   │   │   └── Role.java
│   │   │                   │   ├── repository/
│   │   │                   │   │   └── RoleRepository.java
│   │   │                   │   └── service/
│   │   │                   │       └── RoleService.java
│   │   │                   │
│   │   │                   └── DemoApplication.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/
│   │           └── migration/
│   │               ├── V1__create_schools_table.sql
│   │               └── V2__create_branch_user_role_tables.sql
│   │
│   └── test/
│
├── pom.xml
└── README.md
```

The structure will expand as additional modules such as students, classes, sections, attendance, and fees are implemented.

---

## 6. Database Design

The application uses PostgreSQL as its relational database.

Flyway manages all database schema changes through versioned SQL migration scripts.

### Database Tables

| Table | Purpose |
|---|---|
| schools | Stores the registered school's information. |
| branches | Stores one or multiple school branches. |
| users | Stores user account information. |
| roles | Stores predefined application roles. |
| user_roles | Maps users to their assigned roles. |
| user_branches | Maps users to their assigned branches. |

### Entity Relationships

**School and Branch**

- One school can have multiple branches.
- Each branch belongs to one school.
- A branch cannot exist without a school.

Relationship: `One-to-Many`

**User and Role**

- A user can have multiple roles.
- A role can be assigned to multiple users.

Relationship: `Many-to-Many`

Mapping table: `user_roles`

**User and Branch**

- A user can be assigned to multiple branches.
- A branch can have multiple assigned users.

Relationship: `Many-to-Many`

Mapping table: `user_branches`

### Database Relationship Diagram

```text
             SCHOOLS
                |
                | 1
                |
                | N
             BRANCHES
                |
                |
                |
       USER_BRANCHES
                |
                |
              USERS
                |
                |
          USER_ROLES
                |
                |
              ROLES
```

### Predefined Roles

The following roles are seeded through the V2 migration:

| Role | Description |
|---|---|
| SCHOOL_ADMIN | Administrator with access to all school branches |
| BRANCH_ADMIN | Administrator responsible for assigned branches |
| TEACHER | Teaching staff |
| ACCOUNTANT | Handles school fee and financial operations |
| STUDENT | Student account |
| PARENT | Parent or guardian account |

### Database Design Decisions

- User email addresses are globally unique within the application.
- Branch names and branch codes are unique within a school.
- Passwords are stored as BCrypt hashes.
- User-role and user-branch relationships use composite primary keys.
- Branch-specific data will reference `branch_id`.
- School administrators have school-wide access as an application authorization rule.

---

## 7. API Documentation

Base URL:

```text
http://localhost:8080
```

### School APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/schools` | Register a school |
| GET | `/api/v1/schools` | Retrieve registered school |

#### Register School

**Endpoint**

```http
POST /api/v1/schools
```

**Request Body**

```json
{
    "name": "ABC Public School",
    "address": "Patna, Bihar"
}
```

**Expected Success Response: `201 Created`**

```json
{
    "id": 1,
    "name": "ABC Public School",
    "address": "Patna, Bihar",
    "active": true,
    "createdAt": "2026-11-03T10:30:00"
}
```

#### Get School

**Endpoint**

```http
GET /api/v1/schools
```

Returns the registered school's information.

If no school is registered, the controller returns `404 Not Found`.

### Branch APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/branches` | Create a branch |
| GET | `/api/v1/branches` | Retrieve all branches |

#### Create Branch

**Endpoint**

```http
POST /api/v1/branches
```

**Request Body**

```json
{
    "name": "Patna Main Branch",
    "code": "PAT-MAIN",
    "address": "Patna, Bihar"
}
```

**Expected Success Response: `201 Created`**

```json
{
    "id": 1,
    "schoolId": 1,
    "name": "Patna Main Branch",
    "code": "PAT-MAIN",
    "address": "Patna, Bihar",
    "active": true,
    "createdAt": "2026-11-03T10:30:00"
}
```

The backend automatically identifies the registered school. A `schoolId` is not required in the request.

#### Get All Branches

**Endpoint**

```http
GET /api/v1/branches
```

Returns all branches associated with the registered school.

### User APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/users` | Create a user |
| GET | `/api/v1/users` | Retrieve all users |
| GET | `/api/v1/users/{id}` | Retrieve a user by ID |

#### Create User

**Endpoint**

```http
POST /api/v1/users
```

**Request Body**

```json
{
    "fullName": "Rahul Kumar",
    "email": "rahul@example.com",
    "password": "School@123",
    "roleIds": [3],
    "branchIds": [1]
}
```

**Expected Success Response: `201 Created`**

```json
{
    "id": 1,
    "fullName": "Rahul Kumar",
    "email": "rahul@example.com",
    "active": true,
    "roles": [
        "TEACHER"
    ],
    "branchIds": [
        1
    ],
    "createdAt": "2026-11-03T10:30:00"
}
```

**Important:** The password is encoded using BCrypt before being passed to the service. Neither the raw password nor its hash is included in the response.

The `roleIds` must reference existing roles. Non-school-admin users must have at least one branch assigned.

#### Get All Users

```http
GET /api/v1/users
```

Returns all registered users.

#### Get User By ID

```http
GET /api/v1/users/1
```

Returns the user associated with the supplied ID.

---

## 8. Getting Started

Follow these steps to run the application locally.

### Prerequisites

Install the following:

- Java Development Kit (JDK) 21
- Maven
- PostgreSQL
- IntelliJ IDEA / Eclipse / VS Code
- Postman (for API testing)

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd school-erp
```

### Step 2: Create PostgreSQL Database

Open PostgreSQL or pgAdmin and execute:

```sql
CREATE DATABASE school_erp_demo;
```

### Step 3: Configure Database Connection

Update:

```text
src/main/resources/application.properties
```

Recommended configuration:

```properties
spring.application.name=school-erp

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/school_erp_demo}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=false

server.port=8080
```

Set the database password using the `DB_PASSWORD` environment variable.

Do not commit real database credentials to GitHub.

### Step 4: Build the Application

Run:

```bash
mvn clean install
```

### Step 5: Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

Alternatively, run `DemoApplication.java` directly from your IDE.

### Step 6: Verify Application Startup

The application should start on:

```text
http://localhost:8080
```

Flyway will execute pending database migrations automatically during startup.

---

## 9. Database Migration

Flyway is responsible for managing the database schema.

Migration scripts are stored in:

```text
src/main/resources/db/migration/
```

### Current Migrations

| Version | Migration File | Description |
|---|---|---|
| V1 | V1__create_schools_table.sql | Creates the schools table. |
| V2 | V2__create_branch_user_role_tables.sql | Creates branches, users, roles, user_roles, and user_branches; seeds predefined roles. |

### Migration Naming Convention

```text
V1__create_schools_table.sql
V2__create_branch_user_role_tables.sql
V3__create_students_table.sql
V4__create_classes_sections_tables.sql
```

### Important Migration Rules

1. Never modify a migration that has already been successfully applied.
2. Create a new versioned migration for every subsequent schema change.
3. Let Flyway manage schema creation and updates.
4. Keep Hibernate configured with:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

Hibernate validates entity mappings against the database schema rather than modifying the schema automatically.

---

## 10. Security

Security is an important part of the School ERP architecture.

### Password Security

- Passwords are encoded using BCrypt.
- Raw passwords are never stored in PostgreSQL.
- Password hashes are never returned through API responses.
- Password verification will use Spring Security's `PasswordEncoder.matches()` method during authentication implementation.

### Role-Based Access Control

The application defines the following roles:

- SCHOOL_ADMIN
- BRANCH_ADMIN
- TEACHER
- ACCOUNTANT
- STUDENT
- PARENT

The role and branch assignment foundation is implemented.

**Authentication and endpoint authorization are still planned.** JWT-based authentication, security filter-chain configuration, and enforcement of role and branch permissions will be added in a later development phase.

Until then, the presence of a BCrypt encoder and role assignments should not be interpreted as a fully secured application.

---

## 11. Validation and Error Handling

The application uses Jakarta Bean Validation for incoming request DTOs.

Examples:

| Validation | Purpose |
|---|---|
| `@NotBlank` | Rejects null, empty, and whitespace-only strings. |
| `@NotEmpty` | Ensures a collection is not empty. |
| `@Email` | Validates email format. |
| `@Size` | Enforces maximum or minimum lengths. |

Business validations currently include:

- Preventing duplicate school registration.
- Preventing duplicate user email addresses.
- Preventing duplicate branch codes.
- Preventing duplicate branch names.
- Ensuring selected roles exist.
- Ensuring selected branches exist.
- Requiring branch assignment for non-school-admin users.

A centralized exception-handling layer using `@RestControllerAdvice` is planned to provide consistent error responses.

---

## 12. Development Roadmap

The project will be developed incrementally.

| Milestone | Module / Feature | Status |
|---|---|---|
| 1 | Spring Boot project setup and PostgreSQL connection | Completed |
| 2 | Flyway migration configuration | Completed |
| 3 | School, Branch, User, and Role foundations | Completed |
| 4 | Initial School, Branch, and User REST APIs | Implemented |
| 5 | Postman API testing | Next |
| 6 | Centralized validation and exception handling | Planned |
| 7 | Student management CRUD | Planned |
| 8 | Class and section management | Planned |
| 9 | Spring Security and JWT authentication | Planned |
| 10 | Role-based and branch-based authorization | Planned |
| 11 | Pagination, sorting, and filtering | Planned |
| 12 | Unit and integration testing | Planned |
| 13 | Docker and deployment | Planned |

---

## 13. Development Guidelines

The following conventions will be followed throughout the project.

### Coding Standards

- Use meaningful class, method, and variable names.
- Keep controllers focused on HTTP request handling.
- Place business logic in service classes.
- Use repositories for database operations.
- Use DTOs for API requests and responses.
- Use mappers for entity-to-DTO conversion.
- Apply transaction management at the service layer.
- Keep database migrations version-controlled.

### Database Standards

- Use PostgreSQL as the primary database.
- Use Flyway for schema management.
- Define appropriate primary and foreign keys.
- Add unique constraints for business-critical fields.
- Add indexes for frequently queried columns.
- Avoid unnecessary database relationships.

### Security Standards

- Never store plaintext passwords.
- Never expose password hashes in API responses.
- Validate incoming requests.
- Enforce role-based and branch-based authorization before production deployment.
- Never commit credentials or secrets to source control.

---

## Project Status

**Current phase:** Initial backend foundation and REST API development.

The School, Branch, User, and Role foundations have been implemented. The next development phase focuses on API verification, centralized exception handling, and student management.

---

## Author

**MASHCOD Technologies**

School ERP – Backend Development

**Technology:** Java | Spring Boot | PostgreSQL | Spring Data JPA | Hibernate | Flyway
