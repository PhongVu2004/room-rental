# Architecture Documentation

This document provides a comprehensive overview of the architecture, design, and requirements for the Room Rental Platform.

---

## 1. Functional Requirements

- **User Authentication:** Users can register, log in, and manage their profiles securely.
- **Room Listings:** Hosts can create, read, update, and delete room listings. Listings include descriptions, prices, images, and amenities.
- **Search & Filtering:** Guests can search for available rooms by location and filter by price range, dates, and amenities.
- **Booking Management:** Guests can request to book a room. Hosts can accept or decline booking requests.
- **Reviews & Ratings:** Guests can leave reviews and ratings for rooms they have stayed in.
- **Payment Processing:** (Placeholder) System handles secure payment transactions upon booking confirmation.

---

## 2. Non-Functional Requirements

- **Performance:** Fast initial page loads using Next.js Server-Side Rendering (SSR) and Static Site Generation (SSG). API response times should be under 200ms.
- **Scalability:** The NestJS backend must be stateless to allow horizontal scaling. The PostgreSQL database should support connection pooling.
- **Security:** Implement robust JWT-based authentication. All sensitive data (e.g., passwords) must be hashed using bcrypt. Validate all inputs to prevent SQL injection and XSS.
- **Availability:** Ensure 99.9% uptime by utilizing containerized deployments and health checks.

---

## 3. User Roles

| Role | Description |
| :--- | :--- |
| **Guest** | Can browse listings, search for rooms, make bookings, and leave reviews. |
| **Host** | Can create and manage room listings, view booking requests, and communicate with guests. |
| **Admin** | Has full access to the platform to manage users, resolve disputes, moderate listings, and view system analytics. |

---

## 4. Use Cases

### Guest Use Cases
1. Search for rooms by location and dates.
2. View detailed room information and availability.
3. Book a room and process payment.
4. Leave a review after the stay.

### Host Use Cases
1. Create a new room listing with photos and pricing.
2. Update existing room details or calendar availability.
3. Accept or reject incoming booking requests.
4. View earnings and upcoming reservations.

---

## 5. Activity Diagram

The following diagram illustrates the flow of a Guest searching for and booking a room.

```mermaid
stateDiagram-v2
    [*] --> SearchRooms
    SearchRooms --> ViewRoomDetails : Selects a Room
    ViewRoomDetails --> Login : Attempts to Book
    
    state Login {
        [*] --> EnterCredentials
        EnterCredentials --> Authenticated : Success
        EnterCredentials --> EnterCredentials : Failure
    }
    
    Login --> SelectDates : Authenticated
    SelectDates --> ConfirmPayment : Dates Available
    SelectDates --> ViewRoomDetails : Dates Unavailable
    
    ConfirmPayment --> BookingConfirmed : Payment Success
    ConfirmPayment --> SelectDates : Payment Failure
    
    BookingConfirmed --> [*]
```

---

## 6. Sequence Diagram

This diagram shows the interactions between the Guest, Frontend, Backend, and Database during a booking request.

```mermaid
sequenceDiagram
    actor Guest
    participant Frontend as Next.js Frontend
    participant Backend as NestJS API
    participant DB as PostgreSQL

    Guest->>Frontend: Clicks "Book Now"
    Frontend->>Backend: POST /bookings (Room ID, Dates)
    activate Backend
    Backend->>DB: Check Availability
    activate DB
    DB-->>Backend: Available
    deactivate DB
    
    Backend->>DB: Create Booking Record (Status: Pending)
    activate DB
    DB-->>Backend: Booking Created
    deactivate DB
    
    Backend-->>Frontend: 201 Created (Booking Details)
    deactivate Backend
    Frontend-->>Guest: Shows "Booking Pending Payment"
```

---

## 7. System Architecture

The high-level system architecture follows a modern three-tier application model.

```mermaid
flowchart TD
    Client[Web Browser / Mobile] -->|HTTPS| Proxy[Nginx Reverse Proxy]
    
    subgraph Frontend Tier
        Proxy --> NextJS[Next.js Application]
    end
    
    subgraph Backend Tier
        NextJS -->|REST / GraphQL| API[NestJS Backend API]
        API --> Prisma[Prisma ORM]
    end
    
    subgraph Data Tier
        Prisma --> DB[(PostgreSQL Database)]
    end
```

---

## 8. Authentication Flow

Authentication is handled via JSON Web Tokens (JWT). The diagram below outlines the login process.

```mermaid
sequenceDiagram
    actor User
    participant Web as Frontend (Next.js)
    participant Auth as Auth Service (NestJS)
    participant DB as Database

    User->>Web: Submits Email & Password
    Web->>Auth: POST /auth/login
    activate Auth
    Auth->>DB: Find User by Email
    activate DB
    DB-->>Auth: User Record & Hash
    deactivate DB
    
    Auth->>Auth: Verify Password Hash
    alt Valid Credentials
        Auth->>Auth: Generate JWT
        Auth-->>Web: 200 OK (JWT Token)
        Web->>Web: Store JWT in HttpOnly Cookie / LocalStorage
        Web-->>User: Redirect to Dashboard
    else Invalid Credentials
        Auth-->>Web: 401 Unauthorized
        Web-->>User: Show Error Message
    end
    deactivate Auth
```

---

## 9. Deployment Architecture

For local development and future staging/production, the application is containerized using Docker.

```mermaid
architecture-beta
    group container(cloud)[Docker Host]

    service proxy(internet)[Nginx Proxy] in container
    service frontend(server)[Next.js App] in container
    service backend(server)[NestJS API] in container
    service database(database)[PostgreSQL] in container

    proxy:R --> L:frontend
    frontend:R --> L:backend
    backend:R --> L:database
```

---

## 10. Folder Structure

The monorepo is structured to keep concerns separated while allowing shared tooling.

```text
room-rental/
├── .github/
│   └── workflows/
│       └── ci.yml             # Continuous Integration pipelines
├── backend/
│   ├── src/                   # NestJS source code (controllers, services, modules)
│   ├── test/                  # E2E and unit tests
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma data model
│   │   └── migrations/        # Database migration files
│   └── package.json
├── docs/
│   └── architecture.md        # This documentation file
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # Shadcn UI and custom components
│   │   ├── lib/               # Utility functions
│   │   └── styles/            # Tailwind CSS global styles
│   ├── package.json
│   └── tailwind.config.ts
├── docker-compose.yml         # Container orchestration
└── README.md                  # Project setup and commands
```
