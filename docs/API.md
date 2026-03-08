# Moksh Sanskar Foundation API Documentation

Complete API documentation for the Moksh Sanskar Foundation backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All admin routes require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

---

## Public Routes

### 1. Submit Assistance Request

**Endpoint:** `POST /requests`

**Description:** Submit a new assistance request

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (required)",
  "city": "string (required)",
  "address": "string (required)",
  "typeOfHelp": "antim-kit | pandit | cremation | community-support | other (required)",
  "description": "string (required, min 10 chars)",
  "urgencyLevel": "low | medium | high | critical (default: medium)",
  "documents": "multipart files (optional, max 5 files)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Request submitted successfully",
  "data": {
    "id": "mongodb_id",
    "trackingId": "TRACK_ID_SHORT"
  }
}
```

### 2. Get Request Details

**Endpoint:** `GET /requests/:id`

**Description:** Retrieve request details using request ID or tracking ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "mongodb_id",
    "name": "string",
    "phone": "string",
    "email": "string",
    "city": "string",
    "address": "string",
    "typeOfHelp": "string",
    "description": "string",
    "urgencyLevel": "string",
    "status": "string",
    "documents": ["array of file names"],
    "adminNotes": "string",
    "responseMessage": "string",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

---

## Authentication Routes

### 1. Login

**Endpoint:** `POST /auth/login`

**Description:** Admin login to get JWT token

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "mongodb_id",
      "name": "string",
      "email": "string",
      "role": "admin | staff"
    },
    "token": "JWT_TOKEN"
  }
}
```

### 2. Register (Admin Only)

**Endpoint:** `POST /auth/register`

**Description:** Create a new admin/staff user (requires admin authentication)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "role": "admin | staff (default: staff)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "JWT_TOKEN"
  }
}
```

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get authenticated user information (protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "mongodb_id",
    "name": "string",
    "email": "string",
    "role": "admin | staff"
  }
}
```

---

## Admin Routes (Protected)

### 1. List All Requests

**Endpoint:** `GET /requests`

**Description:** Get paginated list of all requests with optional filters

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (optional: pending | reviewing | approved | rejected | completed)
- `urgencyLevel` (optional: low | medium | high | critical)
- `city` (optional: string)
- `typeOfHelp` (optional: antim-kit | pandit | cremation | community-support | other)

**Example:**
```
GET /requests?page=1&limit=10&status=pending&urgencyLevel=high
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "mongodb_id",
      "name": "string",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### 2. Update Request Status

**Endpoint:** `PATCH /requests/:id/status`

**Description:** Update request status and send notifications

**Request Body:**
```json
{
  "status": "pending | reviewing | approved | rejected | completed (required)",
  "responseMessage": "string (optional, sent to requester)",
  "adminNotes": "string (optional, internal notes)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request status updated",
  "data": { ... }
}
```

### 3. Assign Volunteer

**Endpoint:** `POST /requests/:id/assign`

**Description:** Assign a volunteer/staff member to a request (admin only)

**Request Body:**
```json
{
  "userId": "mongodb_user_id (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Volunteer assigned",
  "data": {
    ...request,
    "assignedTo": {
      "_id": "mongodb_id",
      "name": "string",
      "email": "string"
    }
  }
}
```

### 4. Get Dashboard Statistics

**Endpoint:** `GET /dashboard/stats`

**Description:** Get aggregate statistics for the dashboard

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRequests": 100,
    "approvedRequests": 45,
    "pendingRequests": 30,
    "completedRequests": 25,
    "familiesHelped": 25
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Request not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Default:** 100 requests per 15 minutes per IP
- Limit applies to all routes under `/api/`
- Exceeded limit returns 429 Too Many Requests

---

## File Upload

### Supported Formats
- PDF, JPG, JPEG, PNG, DOC, DOCX

### File Size Limits
- Maximum 5MB per file
- Maximum 5 files per request

### Upload Example
```bash
curl -X POST http://localhost:3000/api/requests \
  -F "name=John Doe" \
  -F "phone=9876543210" \
  -F "email=john@example.com" \
  -F "city=Mumbai" \
  -F "address=123 Main St" \
  -F "typeOfHelp=antim-kit" \
  -F "description=Need assistance..." \
  -F "urgencyLevel=high" \
  -F "documents=@file1.pdf" \
  -F "documents=@file2.jpg"
```

---

## Environment Variables Required

```
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/moksh-foundation
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@moksh.org
```

---

## Support

For API issues or questions, contact: support@moksh.org
