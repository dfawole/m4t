# M4T Learning Platform - License Management Testing Guide

## 🎯 Complete License Management Testing Scenarios

This guide provides comprehensive testing scenarios for the enterprise license management system, including test data setup and step-by-step procedures.

## 🏢 Test Companies and License Scenarios

### Company 1: TechCorp Solutions
- **Company ID:** 1
- **Admin Account:** `company_admin` / `company123`
- **Email:** `admin@techcorp.com`
- **Subscription Plan:** Professional (50 licenses)
- **License Allocation:** 25 created, 10 assigned, 15 available

### Company 2: Innovate Inc
- **Company ID:** 2
- **Admin Account:** `enterprise_admin` / `enterprise123`
- **Email:** `admin@innovate.com`
- **Subscription Plan:** Enterprise (100 licenses)
- **License Allocation:** 50 created, 30 assigned, 20 available

## 👥 Test Users for License Assignment

### TechCorp Solutions Users
| User ID | Name | Email | Role | License Status |
|---------|------|-------|------|----------------|
| `tc-user-001` | Alice Johnson | `alice@techcorp.com` | Employee | Licensed |
| `tc-user-002` | Bob Smith | `bob@techcorp.com` | Employee | Licensed |
| `tc-user-003` | Carol Davis | `carol@techcorp.com` | Manager | Licensed |
| `tc-user-004` | David Wilson | `david@techcorp.com` | Employee | Not Licensed |
| `tc-user-005` | Eva Martinez | `eva@techcorp.com` | Employee | Not Licensed |

### Innovate Inc Users
| User ID | Name | Email | Role | License Status |
|---------|------|-------|------|----------------|
| `in-user-001` | Frank Thompson | `frank@innovate.com` | Developer | Licensed |
| `in-user-002` | Grace Lee | `grace@innovate.com` | Designer | Licensed |
| `in-user-003` | Henry Brown | `henry@innovate.com` | Manager | Licensed |
| `in-user-004` | Iris Chen | `iris@innovate.com` | Developer | Not Licensed |
| `in-user-005` | Jack Rodriguez | `jack@innovate.com` | Analyst | Not Licensed |

## 🔧 License Testing Scenarios

### Scenario 1: Basic License Assignment

**Objective:** Test single license assignment to an employee

**Steps:**
1. Login as `company_admin` (TechCorp)
2. Navigate to Company Dashboard → License Management
3. Click on "Available Licenses" tab
4. Select any unassigned license
5. Click "Assign License"
6. Choose `tc-user-004` (David Wilson) from dropdown
7. Click "Confirm Assignment"
8. Verify license appears in "Assigned Licenses" tab
9. Verify user `tc-user-004` can now access premium content

**Expected Result:** License successfully assigned, user gains access

### Scenario 2: License Revocation

**Objective:** Test removing license from an employee

**Steps:**
1. Login as `company_admin` (TechCorp)
2. Navigate to License Management → Assigned Licenses
3. Find license assigned to `tc-user-001` (Alice Johnson)
4. Click "Revoke License"
5. Confirm revocation in dialog
6. Verify license moves to Available Licenses tab
7. Verify user `tc-user-001` loses premium access

**Expected Result:** License revoked, user loses premium access

### Scenario 3: Bulk License Creation

**Objective:** Test creating multiple licenses at once

**Steps:**
1. Login as `enterprise_admin` (Innovate Inc)
2. Go to License Management → Create Licenses
3. Enter quantity: 25
4. Click "Create Licenses"
5. Verify 25 new licenses appear in Available tab
6. Check subscription usage doesn't exceed plan limit

**Expected Result:** 25 new licenses created successfully

### Scenario 4: Bulk License Assignment

**Objective:** Test assigning multiple licenses simultaneously

**Steps:**
1. Login as `enterprise_admin` (Innovate Inc)
2. Navigate to Available Licenses tab
3. Select multiple licenses using checkboxes (5-10 licenses)
4. Click "Bulk Assign" button
5. Select multiple users for assignment
6. Confirm bulk assignment
7. Verify all licenses are properly assigned

**Expected Result:** All selected licenses assigned to chosen users

### Scenario 5: License Expiration Handling

**Objective:** Test system behavior with expired licenses

**Steps:**
1. Login as company admin
2. Navigate to License Management
3. Find licenses with expiration dates in the past
4. Verify expired licenses show "Expired" status
5. Attempt to assign expired license
6. Verify system prevents assignment
7. Check user with expired license loses access

**Expected Result:** Expired licenses cannot be assigned, users lose access

### Scenario 6: Subscription Limit Testing

**Objective:** Test license creation at subscription limits

**Steps:**
1. Login as `company_admin` (TechCorp - 50 license limit)
2. Navigate to Create Licenses
3. Try to create 30 new licenses (would exceed 50 total)
4. Verify system shows error message
5. Create 25 licenses instead (within limit)
6. Verify creation succeeds

**Expected Result:** System prevents exceeding subscription limits

## 📊 License Analytics Testing

### Scenario 7: License Usage Reports

**Objective:** Test license analytics and reporting

**Steps:**
1. Login as company admin
2. Navigate to License Management → Analytics
3. View license utilization dashboard
4. Check assigned vs. available ratio
5. Review user activity reports
6. Export license usage data
7. Verify accuracy of all metrics

**Expected Result:** Accurate reporting of license usage and analytics

### Scenario 8: License Activity Tracking

**Objective:** Test license audit trail functionality

**Steps:**
1. Perform several license operations (assign, revoke, create)
2. Navigate to License Activity Log
3. Verify all operations are logged with:
   - Timestamp
   - Admin who performed action
   - License ID affected
   - User involved (if applicable)
   - Action type
4. Test filtering and searching in activity log

**Expected Result:** Complete audit trail of all license operations

## 🚫 Error Handling Testing

### Scenario 9: Invalid License Operations

**Objective:** Test system response to invalid operations

**Test Cases:**
1. **Assign Already Assigned License**
   - Try to assign a license that's already assigned
   - Expected: Error message, operation prevented

2. **Revoke Unassigned License**
   - Try to revoke a license that's not assigned
   - Expected: Error message, operation prevented

3. **Assign to Non-existent User**
   - Try to assign license to invalid user ID
   - Expected: Error message, operation prevented

4. **Exceed License Limits**
   - Try to create more licenses than subscription allows
   - Expected: Error message, operation prevented

### Scenario 10: Concurrent Operations Testing

**Objective:** Test system behavior with simultaneous operations

**Steps:**
1. Open multiple browser tabs with different company admins
2. Simultaneously attempt to:
   - Assign same license to different users
   - Create licenses at the same time
   - Revoke and reassign same license
3. Verify data consistency
4. Check for race conditions

**Expected Result:** System maintains data integrity during concurrent operations

## 🔄 Integration Testing

### Scenario 11: Payment Integration

**Objective:** Test license creation via subscription payments

**Steps:**
1. Login as company admin with no active subscription
2. Navigate to Subscription Management
3. Purchase additional licenses via Stripe/PayPal
4. Verify licenses are automatically created
5. Check license count matches purchased amount
6. Test license assignment with new licenses

**Expected Result:** Payment successfully creates appropriate licenses

### Scenario 12: User Onboarding Integration

**Objective:** Test automatic license assignment during user onboarding

**Steps:**
1. Admin creates new company user account
2. System automatically assigns available license
3. New user receives welcome email with access instructions
4. User can immediately access premium content
5. License shows as assigned in management dashboard

**Expected Result:** Seamless license assignment during user creation

## 📱 API Testing

### Scenario 13: License Management API

**Objective:** Test all license management API endpoints

**API Endpoints to Test:**
```bash
# Get company licenses
GET /api/companies/{companyId}/licenses

# Create licenses
POST /api/licenses/create
{
  "companyId": 1,
  "subscriptionId": 1,
  "quantity": 10
}

# Assign license
POST /api/licenses/assign
{
  "licenseId": 123,
  "userId": "tc-user-004"
}

# Revoke license
POST /api/licenses/revoke
{
  "licenseId": 123
}

# Get license analytics
GET /api/companies/{companyId}/licenses/analytics
```

**Expected Results:** All endpoints return correct data and status codes

## 🎯 Performance Testing

### Scenario 14: Large-Scale License Operations

**Objective:** Test system performance with large license volumes

**Test Cases:**
1. **1000+ License Creation**
   - Create 1000 licenses at once
   - Measure response time
   - Verify all licenses created correctly

2. **Bulk Assignment (100+ licenses)**
   - Assign 100+ licenses simultaneously
   - Monitor database performance
   - Check for timeout issues

3. **Concurrent User Testing**
   - 50+ simultaneous license operations
   - Monitor system responsiveness
   - Verify data consistency

**Performance Benchmarks:**
- License creation: < 5 seconds for 100 licenses
- License assignment: < 2 seconds per license
- Analytics loading: < 3 seconds
- Bulk operations: < 10 seconds for 50 items

## ✅ Testing Checklist

### Before Testing
- [ ] UAT environment is properly set up
- [ ] Test companies and users are seeded
- [ ] Payment processors are in test mode
- [ ] All test accounts can login successfully

### Core Functionality
- [ ] Single license assignment works
- [ ] License revocation works
- [ ] Bulk license creation works
- [ ] Bulk license operations work
- [ ] License expiration handling works
- [ ] Subscription limit enforcement works

### Analytics and Reporting
- [ ] License usage analytics display correctly
- [ ] Activity logging captures all operations
- [ ] Export functionality works
- [ ] Filtering and search work in reports

### Error Handling
- [ ] Invalid operations are prevented
- [ ] Appropriate error messages shown
- [ ] System maintains data integrity
- [ ] Concurrent operations handled correctly

### Integration
- [ ] Payment integration creates licenses
- [ ] User onboarding assigns licenses automatically
- [ ] Email notifications work
- [ ] API endpoints function correctly

### Performance
- [ ] Large-scale operations complete in reasonable time
- [ ] System remains responsive under load
- [ ] Database performance is acceptable
- [ ] No memory leaks or resource issues

---

**Ready for Production:** Once all test scenarios pass successfully, the license management system is ready for production deployment.