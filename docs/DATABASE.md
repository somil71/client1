# Database Schema

MongoDB database schema for Moksh Sanskar Foundation.

## Collections

### 1. Requests Collection

Stores assistance requests submitted by families.

**Collection Name:** `requests`

**Schema:**
```typescript
{
  _id: ObjectId,
  name: string (required, min: 2),
  phone: string (required, must match phone regex),
  email: string (required, must be valid email),
  city: string (required),
  address: string (required, min: 5),
  typeOfHelp: enum (required) [
    "antim-kit",
    "pandit",
    "cremation",
    "community-support",
    "other"
  ],
  description: string (required, min: 10, max: 2000),
  urgencyLevel: enum (default: "medium") [
    "low",
    "medium",
    "high",
    "critical"
  ],
  status: enum (default: "pending", indexed) [
    "pending",
    "reviewing",
    "approved",
    "rejected",
    "completed"
  ],
  documents: [string] (file names, default: []),
  adminNotes: string (max: 1000, default: ""),
  assignedTo: ObjectId (ref: User, nullable),
  responseMessage: string (max: 2000, default: ""),
  createdAt: Date (auto, indexed with status),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ status: 1, createdAt: -1 }` - For querying recent requests by status
- `{ email: 1 }` - For finding requests by email
- `{ city: 1 }` - For querying by city
- `{ urgencyLevel: 1 }` - For filtering by urgency

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Rajesh Kumar",
  "phone": "+91-9876543210",
  "email": "rajesh@example.com",
  "city": "Mumbai",
  "address": "123 Main Street, Andheri East",
  "typeOfHelp": "antim-kit",
  "description": "We need assistance with funeral arrangements. The family is small and we don't have resources. Please help.",
  "urgencyLevel": "high",
  "status": "approved",
  "documents": ["doc1_xyz.pdf", "photo_abc.jpg"],
  "adminNotes": "Approved for full kit. Assign to volunteer tomorrow.",
  "assignedTo": ObjectId("507f1f77bcf86cd799439012"),
  "responseMessage": "Your request has been approved. Our volunteer will contact you soon.",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-16T14:45:00Z")
}
```

---

### 2. Users Collection

Stores admin and staff user accounts.

**Collection Name:** `users`

**Schema:**
```typescript
{
  _id: ObjectId,
  name: string (required, min: 2),
  email: string (required, unique, lowercase),
  password: string (required, hashed with bcrypt, not returned in queries),
  role: enum (default: "staff") [
    "admin",
    "staff"
  ],
  isActive: boolean (default: true, indexed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `{ email: 1 (unique) }` - Ensure unique email addresses
- `{ isActive: 1 }` - For querying active users only

**Example Document:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Priya Sharma",
  "email": "priya@moksh.org",
  "password": "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm6", // hashed
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2024-01-01T08:00:00Z"),
  "updatedAt": ISODate("2024-01-01T08:00:00Z")
}
```

---

## Data Relationships

### Request → User (assignedTo)
- Many requests can be assigned to one user
- `requests.assignedTo` is a reference to `users._id`
- This is optional and nullable

---

## Database Statistics

### Collection Sizes (Estimated for 10,000 requests)
- `requests`: ~50-100 MB
- `users`: ~1-2 MB

---

## Backup Strategy

### Recommended Backups
1. **Daily Backups:** Every 24 hours
2. **Weekly Full Backups:** Every 7 days
3. **Monthly Archive:** First day of month

### Backup Command
```bash
mongodump --uri "mongodb://localhost:27017/moksh-foundation" --out /backups/moksh-foundation
```

### Restore Command
```bash
mongorestore --uri "mongodb://localhost:27017/moksh-foundation" /backups/moksh-foundation/moksh-foundation
```

---

## Queries

### Common Query Examples

**Get all pending requests:**
```javascript
db.requests.find({ status: "pending" }).sort({ createdAt: -1 })
```

**Get high-urgency requests by city:**
```javascript
db.requests.find({
  urgencyLevel: "high",
  city: "Mumbai",
  status: { $in: ["pending", "reviewing"] }
})
```

**Count requests by status:**
```javascript
db.requests.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])
```

**Get requests assigned to specific user:**
```javascript
db.requests.find({
  assignedTo: ObjectId("507f1f77bcf86cd799439012")
})
```

---

## Data Validation

### Field Validation Rules

**name:**
- Type: String
- Min length: 2
- Max length: 100
- Required: Yes

**phone:**
- Type: String
- Pattern: `/^[0-9\-\+\(\)\s]{10,}$/`
- Required: Yes

**email:**
- Type: String
- Pattern: Valid email format
- Lowercase: Always stored as lowercase
- Required: Yes

**description:**
- Type: String
- Min length: 10
- Max length: 2000
- Required: Yes

**documents:**
- Type: Array of strings
- Max items: 5
- Accepted formats: PDF, JPG, JPEG, PNG, DOC, DOCX
- Max file size: 5MB

---

## Database Connection

### MongoDB URI
```
mongodb://username:password@host:port/database
```

### Local Development
```
mongodb://localhost:27017/moksh-foundation
```

### Docker Compose
```
mongodb://mongodb:27017/moksh-foundation
```

---

## Monitoring

### Database Metrics to Monitor
1. **Connection Count** - Should be stable
2. **Query Performance** - Monitor slow queries
3. **Storage Size** - Track growth rate
4. **Index Usage** - Ensure indexes are being used
5. **Replication Lag** (if replicaset)

### Health Check
```bash
mongosh --eval "db.adminCommand('ping')"
```

---

## Migration Guide

### Adding New Field to Requests
```javascript
db.requests.updateMany({}, { $set: { newField: defaultValue } })
```

### Creating New Index
```javascript
db.requests.createIndex({ fieldName: 1 })
```

### Removing Unused Field
```javascript
db.requests.updateMany({}, { $unset: { fieldName: "" } })
```

---

## Performance Tips

1. **Use Indexes** - Always index frequently queried fields
2. **Aggregate Pipeline** - Use for complex queries
3. **Pagination** - Always limit result sets
4. **Projection** - Only fetch needed fields
5. **Connection Pooling** - Reuse connections

---

## Compliance & Privacy

### Data Retention
- Keep request data for 7 years (legal requirement)
- Archive completed requests after 2 years
- Delete personal data on request

### GDPR Compliance
- Implement "right to be forgotten"
- Maintain audit logs for data access
- Encrypt sensitive fields (optional)

---

## Support

For database questions: support@moksh.org
