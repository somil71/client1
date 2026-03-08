# Moksh Sanskar Foundation — System Architecture Blueprint

> A production engineering reference for the complete platform.

---

## Table of Contents

1. [Feature Architecture](#1-feature-architecture)
2. [Folder Structure](#2-folder-structure)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Security Architecture](#7-security-architecture)
8. [DevOps & Deployment](#8-devops--deployment)
9. [Scalability Strategy](#9-scalability-strategy)
10. [Developer Best Practices](#10-developer-best-practices)

---

## 1. Feature Architecture

### Public Website

| Module | Features |
|---|---|
| **Homepage** | Hero banner, mission statement, stats counter, recent events, testimonials, CTA buttons |
| **About** | Organization history, team members, mission/vision, impact statistics |
| **Request Help** | Multi-step form with file upload, urgency selection, type-of-help picker, tracking ID generation |
| **Track Request** | Lookup by tracking ID, status timeline, admin response display |
| **Events** | Upcoming/past event listings, event detail pages, registration, calendar view |
| **Ritual Booking** | Service catalog, date/time picker, priest selection, booking confirmation |
| **Donations** | One-time/recurring donations, Razorpay/Stripe integration, receipt generation, donor wall |
| **Volunteer** | Registration form, skill matching, availability scheduler, active volunteer directory |
| **NGO Partners** | Partner directory, collaboration forms, resource sharing |
| **Public Services** | Government scheme links, helpline numbers, document templates |
| **Contact** | Contact form, office location map, social links, FAQ accordion |
| **User Auth** | Register, login, forgot password, email verification, profile management |

### Admin Dashboard

| Module | Features |
|---|---|
| **Overview** | KPI cards (requests, donations, volunteers), charts, recent activity feed |
| **Request Management** | List/filter/search requests, status updates, assign volunteers, response messages |
| **User Management** | List users, role assignment (admin/staff/volunteer/user), activation/deactivation |
| **Event Management** | CRUD events, attendee tracking, event gallery, notifications |
| **Donation Tracking** | Transaction list, donor profiles, receipt management, revenue charts |
| **Volunteer Management** | Applications, assignments, hours logging, performance tracking |
| **Content Management** | Homepage banners, announcements, blog posts, media gallery |
| **Reports** | Export CSV/PDF, date-range filters, donation summaries, request analytics |
| **Settings** | Organization profile, SMTP configuration, payment gateway keys, rate limits |

### Backend Services

| Service | Responsibility |
|---|---|
| **AuthService** | JWT issuance, refresh tokens, password hashing, role verification |
| **RequestService** | CRUD requests, tracking ID generation, status transitions, assignment |
| **EventService** | CRUD events, registration, capacity management |
| **DonationService** | Payment initiation, webhook verification, receipt generation |
| **VolunteerService** | Applications, skill matching, availability, assignment |
| **EmailService** | SMTP transport, templated emails (welcome, status update, receipt) |
| **FileService** | Upload to disk/S3, file validation, URL generation |
| **NotificationService** | In-app notifications, email triggers, SMS (future) |
| **AnalyticsService** | Aggregation pipelines, report generation, dashboard stats |

---

## 2. Folder Structure

```
moksh-foundation/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + build on PR
│       ├── docker-publish.yml        # Build & push Docker images
│       └── deploy.yml                # SSH deploy to production
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           # Mongoose connection
│   │   │   ├── env.ts                # Validated env variables (zod)
│   │   │   └── logger.ts             # Winston/Pino logger
│   │   │
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── RequestController.ts
│   │   │   ├── EventController.ts
│   │   │   ├── DonationController.ts
│   │   │   ├── VolunteerController.ts
│   │   │   ├── ContactController.ts
│   │   │   └── UserController.ts
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   ├── RequestService.ts
│   │   │   ├── EventService.ts
│   │   │   ├── DonationService.ts
│   │   │   ├── VolunteerService.ts
│   │   │   ├── EmailService.ts
│   │   │   ├── FileService.ts
│   │   │   └── AnalyticsService.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Request.ts
│   │   │   ├── Event.ts
│   │   │   ├── Donation.ts
│   │   │   ├── Volunteer.ts
│   │   │   ├── Notification.ts
│   │   │   └── Content.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification + role checks
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   ├── rateLimiter.ts        # Per-route rate limits
│   │   │   ├── validation.ts         # Zod schema validation
│   │   │   └── upload.ts             # Multer configuration
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── requests.ts
│   │   │   ├── events.ts
│   │   │   ├── donations.ts
│   │   │   ├── volunteers.ts
│   │   │   ├── contact.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validation.ts         # Zod schemas
│   │   │   ├── helpers.ts            # Date formatting, ID gen
│   │   │   └── constants.ts          # Enums, status codes
│   │   │
│   │   ├── types/
│   │   │   └── index.ts              # Shared TypeScript interfaces
│   │   │
│   │   └── index.ts                  # Express app bootstrap
│   │
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx        # Admin sidebar
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Loader.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── StatCard.tsx
│   │   │       ├── StatusBadge.tsx
│   │   │       └── EmptyState.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   ├── ContactPage.tsx
│   │   │   │   ├── RequestHelpPage.tsx
│   │   │   │   ├── TrackRequestPage.tsx
│   │   │   │   ├── EventsPage.tsx
│   │   │   │   ├── DonationPage.tsx
│   │   │   │   ├── VolunteerPage.tsx
│   │   │   │   ├── NgoPage.tsx
│   │   │   │   └── PublicServicesPage.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── SignupPage.tsx
│   │   │   │   ├── AdminLoginPage.tsx
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── RequestsPage.tsx
│   │   │   │   ├── UsersPage.tsx
│   │   │   │   ├── EventsPage.tsx
│   │   │   │   ├── DonationsPage.tsx
│   │   │   │   ├── VolunteersPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   │
│   │   │   └── user/
│   │   │       ├── ProfilePage.tsx
│   │   │       └── MyRequestsPage.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useDebounce.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                 # Axios instance + interceptors
│   │   │   ├── authAPI.ts
│   │   │   ├── requestsAPI.ts
│   │   │   ├── eventsAPI.ts
│   │   │   └── donationsAPI.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # React Context for auth state
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── scripts/
│   ├── provision-server.sh            # One-command Ubuntu setup
│   ├── seed-admin.js                  # Create first admin user
│   └── backup-db.sh                   # MongoDB dump script
│
├── docs/
│   ├── ARCHITECTURE.md                # This document
│   ├── PRODUCTION_DEPLOYMENT.md       # Server deployment guide
│   ├── SETUP.md                       # Local dev setup
│   └── API_REFERENCE.md               # Endpoint documentation
│
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml                 # Development
├── docker-compose.prod.yml            # Production
├── nginx.production.conf
├── ecosystem.config.cjs               # PM2 config
└── README.md
```

**Design Rationale:** Controllers handle HTTP; Services handle business logic; Models handle data. This separation allows unit testing services without HTTP concerns and swapping databases without touching controllers.

---

## 3. Backend Architecture

### Layered Architecture

```
HTTP Request
    │
    ▼
┌─────────────┐
│   Routes    │  Define endpoints, attach middleware
└──────┬──────┘
       │
┌──────▼──────┐
│ Middleware   │  Auth, validation, rate limiting, logging
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │  Parse request, call service, send response
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │  Business logic, orchestration
└──────┬──────┘
       │
┌──────▼──────┐
│   Models    │  Mongoose schemas, data access
└─────────────┘
```

### Authentication Flow

```typescript
// POST /api/auth/login
Controller.login(req, res)
  → AuthService.authenticate(email, password)
    → User.findOne({ email })
    → bcrypt.compare(password, user.password)
    → jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
  → res.json({ token, user })

// Protected route middleware
auth.ts: authenticate(req, res, next)
  → Extract token from Authorization header
  → jwt.verify(token, JWT_SECRET)
  → Attach user to req.user
  → next()

auth.ts: authorize(...roles)(req, res, next)
  → Check req.user.role in allowed roles
  → 403 if not authorized
```

### Error Handling

```typescript
// middleware/errorHandler.ts
export const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Custom error class
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}
```

### Validation with Zod

```typescript
// utils/validation.ts
import { z } from 'zod';

export const createRequestSchema = z.object({
  name:         z.string().min(2).max(100),
  email:        z.string().email(),
  phone:        z.string().regex(/^\+?[\d\s-]{10,15}$/),
  city:         z.string().min(2).max(100),
  typeOfHelp:   z.enum(['antim-kit', 'financial', 'ritual', 'counseling', 'other']),
  description:  z.string().min(10).max(2000),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical']),
  address:      z.string().optional()
});

// middleware/validation.ts
export const validate = (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors
      });
    }
    req.body = result.data;  // Sanitized data
    next();
  };
```

### Environment Configuration

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:      z.enum(['development', 'production', 'test']),
  PORT:          z.coerce.number().default(3000),
  MONGODB_URI:   z.string().url(),
  JWT_SECRET:    z.string().min(32),
  CORS_ORIGIN:   z.string(),
  SMTP_HOST:     z.string().optional(),
  SMTP_PORT:     z.coerce.number().optional(),
  SMTP_USER:     z.string().optional(),
  SMTP_PASSWORD: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

---

## 4. Frontend Architecture

### Routing Structure

```typescript
// App.tsx
<Router>
  <Routes>
    {/* Public Pages */}
    <Route path="/"                element={<HomePage />} />
    <Route path="/about"           element={<AboutPage />} />
    <Route path="/events"          element={<EventsPage />} />
    <Route path="/events/:id"      element={<EventDetailPage />} />
    <Route path="/request-help"    element={<RequestHelpPage />} />
    <Route path="/track-request"   element={<TrackRequestPage />} />
    <Route path="/donate"          element={<DonationPage />} />
    <Route path="/volunteer"       element={<VolunteerPage />} />
    <Route path="/ngo"             element={<NgoPage />} />
    <Route path="/public-services" element={<PublicServicesPage />} />
    <Route path="/contact"         element={<ContactPage />} />

    {/* Auth Pages */}
    <Route path="/login"           element={<AdminLoginPage />} />
    <Route path="/user/login"      element={<LoginPage />} />
    <Route path="/signup"          element={<SignupPage />} />

    {/* Protected: User */}
    <Route element={<ProtectedRoute roles={['user','admin','staff']} />}>
      <Route path="/profile"       element={<ProfilePage />} />
      <Route path="/my-requests"   element={<MyRequestsPage />} />
    </Route>

    {/* Protected: Admin */}
    <Route element={<ProtectedRoute roles={['admin','staff']} />}>
      <Route path="/admin"         element={<AdminLayout />}>
        <Route index               element={<DashboardPage />} />
        <Route path="requests"     element={<RequestsPage />} />
        <Route path="users"        element={<UsersPage />} />
        <Route path="events"       element={<EventsPage />} />
        <Route path="donations"    element={<DonationsPage />} />
        <Route path="volunteers"   element={<VolunteersPage />} />
        <Route path="settings"     element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>
```

### Auth Context

```typescript
// context/AuthContext.tsx
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### API Service Layer

```typescript
// services/api.ts — Central Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Database Design

### Collections & Schemas

```
┌──────────────────────────────────────────────────┐
│                     users                        │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ name           String        required            │
│ email          String        unique, indexed      │
│ password       String        hashed (bcrypt)      │
│ phone          String                            │
│ role           Enum          user|admin|staff     │
│ isActive       Boolean       default: true       │
│ avatar         String        URL                 │
│ createdAt      Date          auto                │
│ updatedAt      Date          auto                │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                    requests                      │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ trackingId     String        unique, indexed      │
│ name           String                            │
│ email          String                            │
│ phone          String                            │
│ city           String                            │
│ address        String                            │
│ typeOfHelp     Enum          antim-kit|financial… │
│ description    String                            │
│ urgencyLevel   Enum          low|medium|high|crit │
│ status         Enum          pending|reviewing…   │
│ documents      [String]      file paths          │
│ userId         ObjectId      ref: users (opt)    │
│ assignedTo     ObjectId      ref: users (opt)    │
│ adminNotes     String                            │
│ responseMessage String                           │
│ createdAt      Date                              │
│ updatedAt      Date                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                     events                       │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ title          String                            │
│ description    String                            │
│ date           Date                              │
│ endDate        Date                              │
│ location       String                            │
│ capacity       Number                            │
│ registrations  [ObjectId]    ref: users          │
│ images         [String]                          │
│ status         Enum          upcoming|active|past │
│ createdBy      ObjectId      ref: users          │
│ createdAt      Date                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                   donations                      │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ donorName      String                            │
│ donorEmail     String                            │
│ amount         Number        in paise (INR)      │
│ currency       String        default: INR        │
│ paymentId      String        Razorpay txn ID     │
│ orderId        String        Razorpay order ID   │
│ status         Enum          created|paid|failed  │
│ receiptUrl     String                            │
│ isRecurring    Boolean                           │
│ userId         ObjectId      ref: users (opt)    │
│ message        String        donor message       │
│ createdAt      Date                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                   volunteers                     │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ userId         ObjectId      ref: users          │
│ skills         [String]                          │
│ availability   [String]      weekdays/weekends   │
│ location       String                            │
│ experience     String                            │
│ status         Enum          pending|approved|act │
│ hoursLogged    Number                            │
│ assignedTasks  [ObjectId]    ref: requests       │
│ createdAt      Date                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                 notifications                    │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ userId         ObjectId      ref: users          │
│ title          String                            │
│ message        String                            │
│ type           Enum          info|success|warning │
│ isRead         Boolean       default: false      │
│ link           String        in-app deep link    │
│ createdAt      Date                              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                    content                       │
├──────────────────────────────────────────────────┤
│ _id            ObjectId                          │
│ type           Enum          banner|announcement… │
│ title          String                            │
│ body           String        Rich text/Markdown  │
│ imageUrl       String                            │
│ isPublished    Boolean                           │
│ publishedAt    Date                              │
│ createdBy      ObjectId      ref: users          │
│ createdAt      Date                              │
└──────────────────────────────────────────────────┘
```

### Indexes

```javascript
// Performance-critical indexes
db.requests.createIndex({ trackingId: 1 }, { unique: true });
db.requests.createIndex({ status: 1, createdAt: -1 });
db.requests.createIndex({ userId: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.donations.createIndex({ paymentId: 1 }, { unique: true });
db.events.createIndex({ date: 1, status: 1 });
db.notifications.createIndex({ userId: 1, isRead: 1 });
```

---

## 6. API Design

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/admin/login` | Public | Admin login |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password` | Public | Reset with token |

### Requests

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/requests` | Public/User | Submit help request |
| GET | `/api/requests/:id` | Public | Get by trackingId or _id |
| GET | `/api/requests/me` | User | My requests |
| GET | `/api/requests` | Admin | List all (paginated, filterable) |
| PATCH | `/api/requests/:id/status` | Admin | Update status |
| POST | `/api/requests/:id/assign` | Admin | Assign volunteer |
| GET | `/api/requests/dashboard/stats` | Admin | Aggregated statistics |

### Events

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List upcoming events |
| GET | `/api/events/:id` | Public | Event details |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| POST | `/api/events/:id/register` | User | Register for event |

### Donations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/donations/create-order` | Public | Create Razorpay order |
| POST | `/api/donations/verify` | Public | Verify payment signature |
| GET | `/api/donations` | Admin | List all donations |
| GET | `/api/donations/stats` | Admin | Revenue analytics |

### Volunteers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/volunteers/apply` | User | Submit application |
| GET | `/api/volunteers` | Admin | List volunteers |
| PATCH | `/api/volunteers/:id` | Admin | Update status |
| GET | `/api/volunteers/:id/hours` | Admin | Hours log |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/profile` | User | Get own profile |
| PUT | `/api/user/profile` | User | Update profile |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/:id/role` | Admin | Change role |

### Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errors": { "email": ["Invalid email format"] }
}
```

---

## 7. Security Architecture

### JWT Authentication

```
Client                              Server
  │                                    │
  │  POST /auth/login {email, pass}    │
  │  ─────────────────────────────────►│
  │                                    │  Verify credentials
  │                                    │  Generate JWT (7d expiry)
  │  ◄─────────────────────────────────│
  │  { token, user }                   │
  │                                    │
  │  GET /api/requests                 │
  │  Authorization: Bearer <token>     │
  │  ─────────────────────────────────►│
  │                                    │  Verify JWT signature
  │                                    │  Check role permissions
  │  ◄─────────────────────────────────│
  │  { data: [...] }                   │
```

### Role-Based Access Control

```typescript
// Roles hierarchy
const ROLES = {
  user:  ['read:own'],
  staff: ['read:own', 'read:all', 'update:requests'],
  admin: ['read:own', 'read:all', 'update:requests', 'manage:users', 'manage:settings']
};

// Middleware usage
router.get('/admin/users',
  authenticate,              // Verify JWT
  authorize('admin'),        // Check role
  validate(listUsersSchema), // Validate query params
  listUsers                  // Controller
);
```

### Security Checklist

| Layer | Implementation |
|---|---|
| **Transport** | HTTPS via Let's Encrypt + Nginx |
| **Authentication** | JWT with 7-day expiry, bcrypt password hashing (12 rounds) |
| **Authorization** | Role-based middleware on every protected route |
| **Input Validation** | Zod schemas on all request bodies |
| **Rate Limiting** | `express-rate-limit`: 100 req/15min general, 5 req/15min login |
| **CORS** | Whitelist production domain only |
| **Headers** | Helmet.js: CSP, X-Frame-Options, HSTS, no-sniff |
| **Secrets** | `.env` files, never committed; GitHub Secrets for CI/CD |
| **Dependencies** | `npm audit` in CI pipeline; Dependabot enabled |
| **File Uploads** | MIME type validation, 5MB limit, server-side rename |

---

## 8. DevOps & Deployment

### Docker Architecture

```
┌─────────────────────────────────────────────────────┐
│                Host Server (Ubuntu 22.04)            │
│                                                     │
│  ┌────────────┐                                     │
│  │   Nginx    │ :80/:443                            │
│  │ (Host)     │─────────┐                           │
│  └────────────┘         │                           │
│                         │                           │
│  ┌──────────────────────┼──── Docker ──────────┐    │
│  │                      │                      │    │
│  │  ┌──────────────┐    │   ┌──────────────┐   │    │
│  │  │   Backend    │◄───┘   │  Frontend    │   │    │
│  │  │  :3000       │        │  :5173       │   │    │
│  │  └──────┬───────┘        └──────────────┘   │    │
│  │         │                                   │    │
│  │         ▼ (External)                        │    │
│  │  ┌──────────────┐                           │    │
│  │  │ MongoDB Atlas│                           │    │
│  │  │ (Managed)    │                           │    │
│  │  └──────────────┘                           │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### CI/CD Pipeline Flow

```
Developer pushes to main
         │
         ▼
┌─────────────────┐
│   CI Pipeline   │  Install → Build → (Lint future)
│   ci.yml        │  Matrix: Node 18.x, 20.x
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ Docker Publish  │  Build images → Push to GHCR
│ docker-publish  │  ghcr.io/somil71/client1/backend:latest
│ .yml            │  ghcr.io/somil71/client1/frontend:latest
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│   Deploy        │  SSH → docker compose pull → up -d
│   deploy.yml    │  Zero-downtime restart
└─────────────────┘
```

### Environment Variables Strategy

| Environment | Source | Secrets Storage |
|---|---|---|
| Development | `.env` files (local) | `.env.example` committed |
| CI/CD | GitHub Actions Secrets | Repository settings |
| Production | `.env.backend` on server | Restricted file permissions (600) |

---

## 9. Scalability Strategy

### Phase 1: Single Server (0–5K users)

Current architecture. One DigitalOcean Droplet, Docker Compose, MongoDB Atlas.

### Phase 2: Separated Services (5K–50K users)

```
┌─────────────┐       ┌─────────────┐
│  CDN         │       │  Load       │
│ (Cloudflare) │──────►│  Balancer   │
└─────────────┘       └──┬──────┬───┘
                         │      │
               ┌─────────▼┐  ┌─▼─────────┐
               │ Server 1 │  │ Server 2   │
               │ Backend  │  │ Backend    │
               └─────┬────┘  └─────┬──────┘
                     │             │
               ┌─────▼─────────────▼──────┐
               │   Redis (Session/Cache)   │
               └────────────┬──────────────┘
                            │
               ┌────────────▼──────────────┐
               │   MongoDB Atlas (M30+)    │
               │   Replica Set             │
               └───────────────────────────┘
```

**Key additions:**
- **Redis**: Shared session store, API response caching
- **Load Balancer**: DigitalOcean LB or Nginx upstream
- **CDN**: Cloudflare for static assets, DDoS protection
- **Frontend**: Deployed to Vercel/Netlify as static site (remove frontend Docker)

### Phase 3: Kubernetes (50K+ users)

- Migrate to DigitalOcean Kubernetes (DOKS) or AWS EKS
- Helm charts for standardized deployments
- Horizontal Pod Autoscaler for backend
- Ingress Controller replacing standalone Nginx
- Persistent Volume Claims for uploads → migrate to S3

---

## 10. Developer Best Practices

### Git Workflow

```
main          ←── Production-ready code
  └── develop ←── Integration branch
       ├── feature/events-page
       ├── feature/donation-api
       └── fix/tracking-id-bug
```

- **Branch naming**: `feature/`, `fix/`, `chore/`, `docs/`
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **PR reviews**: Required before merging to `develop`
- **Release**: Merge `develop` → `main` triggers CI/CD

### Testing Strategy

| Type | Tool | Coverage Target |
|---|---|---|
| Unit Tests | Jest + ts-jest | Services: 80% |
| Integration Tests | Supertest | API endpoints: 70% |
| E2E Tests | Playwright | Critical flows: login, request, payment |
| Visual Regression | Chromatic (future) | UI components |

### Code Quality

| Tool | Purpose |
|---|---|
| ESLint | Code linting with `@typescript-eslint` |
| Prettier | Automatic formatting |
| Husky | Pre-commit hooks for lint + format |
| lint-staged | Run linters on staged files only |

### Documentation Standards

- Every service class: JSDoc on public methods
- Every API endpoint: OpenAPI/Swagger comments
- Every component: Props interface with descriptions
- Architecture decisions: ADR (Architecture Decision Records) in `docs/`
