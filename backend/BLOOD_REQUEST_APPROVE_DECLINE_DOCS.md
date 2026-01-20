# Blood Request Approve/Decline - Backend Implementation

## ✅ Completed Features

### 1. Database Model Updates
**File:** `/backend/models/BloodRequestModel.js`

Added fields:
- `status` - String enum: 'pending', 'approved', 'declined' (default: 'pending')
- `approvedAt` - Date of approval (null for pending/declined)
- `approvedBy` - Admin who approved (stores admin ID or 'admin')

### 2. Controller Method
**File:** `/backend/controllers/bloodRequestController.js`

Added `updateStatus()` function:
```javascript
PATCH /api/blood-requests/:id
Body: {
  status: "approved" | "declined",
  approvedBy: "admin" (optional)
}
```

Features:
- ✅ Validates MongoDB ObjectId
- ✅ Validates status enum (pending/approved/declined)
- ✅ Records approvedAt timestamp when status is 'approved'
- ✅ Returns updated blood request
- ✅ Error handling for invalid requests

### 3. Route Setup
**File:** `/backend/routes/bloodRequestRoutes.js`

Added PATCH endpoint:
```javascript
router.patch('/:id', controller.updateStatus);
```

### 4. API Testing Results

#### Test 1: Approve Request
```
Request: PATCH /api/blood-requests/696b117f39372b37b1835160
Body: { status: "approved", approvedBy: "admin" }

Response: ✅ Success
- Status changed to "approved"
- approvedAt timestamp recorded: 2026-01-17T04:39:14.886Z
- approvedBy: "admin"
```

#### Test 2: Decline Request
```
Request: PATCH /api/blood-requests/696b0f0b39372b37b183512c
Body: { status: "declined" }

Response: ✅ Success
- Status changed to "declined"
- approvedAt remains empty (for declined requests)
```

#### Test 3: Database Persistence
```
GET /api/blood-requests

Current status in database:
- ID: 696b117f39372b37b1835160, Status: approved, ApprovedAt: 2026-01-17T04:39:14.886Z
- ID: 696b0f0b39372b37b183512c, Status: declined
- ID: 696b0da739372b37b183510e, Status: pending
- ID: 696b0b1b39372b37b18350d4, Status: pending
... (others pending)
```

## 🔗 Integration Points

### Frontend (Admin Panel)
**File:** `/admin-panel/src/pages/BloodRequests.jsx`
- Calls: `PATCH /api/blood-requests/{id}` with status: 'approved' or 'declined'
- Refreshes list after action
- Shows success/error alerts

### Frontend (Mobile App - NotificationScreen)
**File:** `/src/screens/NotificationScreen.jsx`
- Calls same endpoint when admin approves
- Automatically notifies user on approval

## 📊 Database Schema

```javascript
BloodRequest {
  fullName: String (required),
  bloodGroup: String (required, enum),
  hospital: String (required),
  contact: String (required),
  location: String (required),
  urgency: String (default: 'normal'),
  additionalNotes: String,
  userId: String,
  isActive: Boolean (default: true),
  
  // ✅ NEW FIELDS
  status: String (enum: ['pending', 'approved', 'declined'], default: 'pending'),
  approvedAt: Date (null),
  approvedBy: String (null),
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## ✅ Validation & Error Handling

| Scenario | Response |
|----------|----------|
| Invalid ID | 400 - "Invalid request ID" |
| Not found | 404 - "Blood request not found" |
| Invalid status | 400 - "Invalid status" |
| Success - Approve | 200 - "Blood request approved successfully" |
| Success - Decline | 200 - "Blood request declined successfully" |
| Database error | 500 - "Failed to update request status" |

## 🚀 Usage Examples

### Approve Request
```bash
curl -X PATCH http://localhost:4000/api/blood-requests/696b117f39372b37b1835160 \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","approvedBy":"admin@example.com"}'
```

### Decline Request
```bash
curl -X PATCH http://localhost:4000/api/blood-requests/696b0f0b39372b37b183512c \
  -H "Content-Type: application/json" \
  -d '{"status":"declined"}'
```

## ✅ All Tests Passed
- ✅ Database schema updated with status fields
- ✅ Controller method implemented with validation
- ✅ Route endpoint registered
- ✅ Approve endpoint working (status change + timestamp)
- ✅ Decline endpoint working (status change)
- ✅ Database persistence verified
- ✅ Error handling tested
