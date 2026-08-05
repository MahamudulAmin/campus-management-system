# 1.Functional Requirements

## FR-01 User Authentication
- Users shall be able to log in using valid credentials.
- The system shall support role-based access control.
- Users shall be able to update profile information.

## FR-02 User Management
- Administrators shall create, update, and deactivate user accounts.
- Administrators shall assign roles to users.

## FR-03 Office Management
- Administrators shall manage university office information.
- Users shall view office details and services.

## FR-04 Service Request Management
- Students and teachers shall submit service requests.
- Users shall upload supporting documents.
- Users shall view request history.
- Users shall track request status.
- Office staff shall review requests.
- Office staff shall approve or reject requests.
- Office staff shall update request progress.

## FR-05 Complaint Management
- Users shall submit complaints.
- Users shall track complaint status.
- Office staff shall review complaints.
- Office staff shall update complaint status.

## FR-06 Notice Management
- Administrators and office staff shall publish notices.
- Users shall view notices and announcements.

## FR-07 Notification Management
- Users shall receive notifications when:
  - Requests are submitted.
  - Request status changes.
  - Complaint status changes.
  - New notices are published.

## FR-08 Reporting

# 2.Non-Functional Requirements

## Performance
- The system shall respond within 3 seconds under normal load.
- The system shall support at least 500 concurrent users.

## Security
- User passwords shall be encrypted.
- Authentication shall use secure sessions.
- Role-based authorization shall be enforced.

## Reliability
- System uptime shall be at least 99%.
- Automatic backup shall be performed daily.

## Availability
- The system shall be accessible 24/7.

## Scalability
- The system shall support future expansion of users and services.

## Usability
- User interfaces shall be simple and intuitive.
- Navigation shall be user-friendly.

## Maintainability
- The system shall follow modular architecture.
- Code shall be documented.

## Compatibility
- The system shall work on modern web browsers.
- The system shall support desktop and mobile devices.

## Data Integrity
- All submitted requests shall be stored accurately.
- Database transactions shall maintain consistency.


# 3.Use Cases

## UC-01 Login

Actor: Student, Teacher, Office Staff, Administrator

Precondition:
- User account exists.

Flow:
1. User enters username and password.
2. System validates credentials.
3. System grants access.

Postcondition:
- User dashboard is displayed.

--------------------------------------------------

## UC-02 Submit Service Request

Actor:
- Student
- Teacher

Flow:
1. User selects office.
2. User fills request form.
3. User uploads documents.
4. User submits request.
5. System stores request.
6. Notification is sent.

Postcondition:
- Request status becomes "Pending".

--------------------------------------------------

## UC-03 Process Service Request

Actor:
- Office Staff

Flow:
1. Staff views pending requests.
2. Staff reviews request.
3. Staff approves/rejects request.
4. Status updated.
5. Notification sent.

Postcondition:
- Request status updated.

--------------------------------------------------

## UC-04 Submit Complaint

Actor:
- Student
- Teacher

Flow:
1. User opens complaint form.
2. User enters complaint details.
3. User submits complaint.
4. System stores complaint.

Postcondition:
- Complaint created.

--------------------------------------------------

## UC-05 Publish Notice

Actor:
- Administrator
- Office Staff

Flow:
1. User creates notice.
2. Notice is published.
3. Users receive notifications.

Postcondition:
- Notice visible to all users.

# 4.Data Flow Diagram (DFD)

Level 0 DFD

External Entities:
1. Student
2. Teacher
3. Office Staff
4. Administrator

Main Process:
Campus Management System

Data Stores:
D1 User Database
D2 Service Requests
D3 Complaints
D4 Notices
D5 Notifications

Flow:

Student/Teacher
        |
        v
Campus Management System
        |
        +------> Service Requests
        |
        +------> Complaints
        |
        +------> Notifications

Office Staff
        |
        v
Campus Management System
        |
        +------> Process Requests
        |
        +------> Process Complaints

Administrator
        |
        v
Campus Management System
        |
        +------> User Management
        |
        +------> Office Management
        |
        +------> Reports

# 5.Software Requirements Specification (SRS)

## 1. Introduction

### Purpose
The Campus Management System provides a centralized platform for managing university services, communication, complaints, and service requests.

### Scope
The system allows students, teachers, office staff, and administrators to interact through a web-based platform.

## 2. Overall Description

### Product Perspective
A web-based management system accessible through browsers.

### User Classes
- Student
- Teacher
- Office Staff
- Administrator

### Operating Environment
- Windows
- Linux
- macOS
- Modern Web Browsers

## 3. Functional Requirements

Refer to:
- Functional Requirements Document

## 4. Non-Functional Requirements

Refer to:
- Non-Functional Requirements Document

## 5. External Interface Requirements

### User Interface
- Login Page
- Dashboard
- Request Form
- Complaint Form
- Notice Board

### Database Interface
- MySQL or MongoDB

## 6. Security Requirements
- Authentication
- Authorization
- Password Encryption
- Secure Sessions

## 7. Future Enhancements
- Mobile Application
- Appointment Scheduling
- Email Notifications
- SMS Notifications
- Live Chat

- Administrators shall generate system reports.
- Administrators shall monitor user activities.
