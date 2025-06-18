#!/bin/bash

echo "Testing ECE Trading Platform Authentication"
echo "=========================================="

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3000/api/health || echo "Health endpoint not available"

# Test signup endpoint
echo -e "\n2. Testing signup endpoint..."
curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "company": "Test Company",
    "phone": "123-456-7890"
  }' \
  | python3 -m json.tool 2>/dev/null || echo "Signup endpoint test failed"

# Test sign in with credentials
echo -e "\n3. Testing credentials sign in..."
# This would require NextAuth session handling - testing via browser

echo -e "\nAuthentication endpoints are ready for testing!"
echo "Visit http://localhost:3000/auth/signin to test the full flow"
