# 1.Entity Relationship Diagram (ERD)

Entities:

1. User
2. Office
3. ServiceRequest
4. Complaint
5. Notice
6. Notification

Relationships:

User (1) -------- (M) ServiceRequest

User (1) -------- (M) Complaint

Office (1) ------ (M) ServiceRequest

Office (1) ------ (M) Complaint

User (1) -------- (M) Notification

User (1) -------- (M) Notice

# 2.System Design

Architecture:
Three-Tier Architecture

1. Presentation Layer
- React Frontend
- HTML/CSS

2. Business Logic Layer
- Node.js / Express.js

3. Data Layer
- MongoDB Database

Modules:

- Authentication Module
- User Management Module
- Office Management Module
- Service Request Module
- Complaint Module
- Notice Module
- Notification Module
- Reporting Module

# 3.Technical Design Document (TDD)

## Overview

The Campus Management System follows a modern web architecture using React, Node.js, Express, and MongoDB.

## Technology Stack

Frontend:
- React
- HTML5
- CSS3
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Authentication:
- JWT

Hosting:
- Vercel (Frontend)
- Render/Railway (Backend)

## Components

1. Authentication Service
2. User Service
3. Office Service
4. Request Service
5. Complaint Service
6. Notice Service
7. Notification Service

# 4.Database Design

## User Collection

{
  _id,
  name,
  email,
  password,
  role,
  createdAt
}

## Office Collection

{
  _id,
  officeName,
  description,
  services
}

## ServiceRequest Collection

{
  _id,
  userId,
  officeId,
  title,
  description,
  document,
  status,
  createdAt
}

## Complaint Collection

{
  _id,
  userId,
  officeId,
  description,
  status,
  createdAt
}

## Notice Collection

{
  _id,
  title,
  content,
  createdBy,
  createdAt
}

## Notification Collection

{
  _id,
  userId,
  message,
  isRead,
  createdAt
} 


# 5.API Design

## Authentication APIs

POST /api/auth/login

POST /api/auth/register

GET /api/auth/profile

--------------------------------------------------

## Office APIs

GET /api/offices

GET /api/offices/:id

POST /api/offices

PUT /api/offices/:id

DELETE /api/offices/:id

--------------------------------------------------

## Service Request APIs

POST /api/requests

GET /api/requests

GET /api/requests/:id

PUT /api/requests/:id

DELETE /api/requests/:id

--------------------------------------------------

## Complaint APIs

POST /api/complaints

GET /api/complaints

PUT /api/complaints/:id

--------------------------------------------------

## Notice APIs

POST /api/notices

GET /api/notices

PUT /api/notices/:id

DELETE /api/notices/:id

--------------------------------------------------

## Notification APIs

GET /api/notifications

PUT /api/notifications/:id/read
