# Auth Testing Playbook (copied from integration playbook)

Use this to test Emergent Google Auth in the Bakery Management System.

## Step 1: Create Test User & Session

```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test Baker',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```
# /api/auth/me
curl -X GET "$URL/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# /api/products (public list)
curl -X GET "$URL/api/products"

# /api/products (create — auth required)
curl -X POST "$URL/api/products" -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"name":"Test Bun","price":50}'

# /api/orders (list mine)
curl -X GET "$URL/api/orders" -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# /api/orders (create)
curl -X POST "$URL/api/orders" -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"items":[{"product_id":"x","name":"Test Bun","price":50,"quantity":2,"subtotal":100}]}'
```

## Step 3: Browser testing

```
await page.context.add_cookies([{
  "name":"session_token","value":"YOUR_SESSION_TOKEN",
  "domain":"<domain>","path":"/","httpOnly":True,"secure":True,"sameSite":"None"
}])
await page.goto("$URL/dashboard")
```

## Success Indicators
- GET /api/auth/me returns user data with `user_id`, `email`, `name`
- /dashboard loads without redirect to /login
- Products & Orders CRUD work with the session token
