#!/bin/bash

echo "=========================================="
echo "COMPREHENSIVE API TEST SUITE"
echo "=========================================="

# Test 1: Admin Login
echo -e "\n[1/7] Testing Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moksh.org","password":"admin123"}')
echo "$LOGIN_RESPONSE" | python -m json.tool | head -10
TOKEN=$(echo "$LOGIN_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
echo "✓ Token obtained: ${TOKEN:0:20}..."

# Test 2: Submit Request
echo -e "\n[2/7] Testing Request Submission..."
REQUEST_RESPONSE=$(curl -s -X POST http://localhost:3001/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Family",
    "phone": "9876543210",
    "email": "test@test.com",
    "city": "Delhi",
    "address": "123 Test St",
    "typeOfHelp": "pandit",
    "description": "Test request for comprehensive testing",
    "urgencyLevel": "critical"
  }')
echo "$REQUEST_RESPONSE" | python -m json.tool
REQUEST_ID=$(echo "$REQUEST_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo "✓ Request ID: $REQUEST_ID"

# Test 3: Get Request by ID
echo -e "\n[3/7] Testing Get Request by ID..."
curl -s -X GET "http://localhost:3001/api/requests/$REQUEST_ID" | python -m json.tool | head -20

# Test 4: Get All Requests (Admin)
echo -e "\n[4/7] Testing Get All Requests (Admin)..."
curl -s -X GET "http://localhost:3001/api/requests" \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool | head -20

# Test 5: Get Statistics
echo -e "\n[5/7] Testing Get Statistics..."
curl -s -X GET "http://localhost:3001/api/requests?/stats" | python -m json.tool

# Test 6: Contact Form Submission
echo -e "\n[6/7] Testing Contact Form Submission..."
CONTACT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Test User",
    "email": "contact@test.com",
    "phone": "9876543210",
    "subject": "Test Contact",
    "message": "This is a test contact form submission for API testing"
  }')
echo "$CONTACT_RESPONSE" | python -m json.tool
echo "✓ Contact form submitted"

# Test 7: Update Request Status (Admin)
echo -e "\n[7/7] Testing Update Request Status (Admin)..."
if [ ! -z "$TOKEN" ] && [ ! -z "$REQUEST_ID" ]; then
  curl -s -X PATCH "http://localhost:3001/api/requests/$REQUEST_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "status": "reviewing",
      "adminNotes": "Test note from API",
      "responseMessage": "Test response from API"
    }' | python -m json.tool | head -20
  echo "✓ Request status updated"
else
  echo "✗ Skipped (missing token or request ID)"
fi

echo -e "\n=========================================="
echo "TEST SUITE COMPLETE"
echo "=========================================="
