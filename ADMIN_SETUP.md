# 👑 Admin Account Setup Guide

## ✅ Admin Account Created!

Your account `vsj2015.us@gmail.com` is now an **admin account** with unlimited access!

---

## What Was Done

### 1. Database Changes

**Added `is_admin` column to users table:**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
```

**Set your account as admin:**
```sql
UPDATE users SET is_admin = true WHERE email = 'vsj2015.us@gmail.com';
```

**Verification:**
```sql
SELECT id, username, email, is_subscribed, is_admin FROM users WHERE email = 'vsj2015.us@gmail.com';
```

**Result:**
```
 id | username |        email         | is_subscribed | is_admin
----+----------+----------------------+---------------+----------
  1 | test     | vsj2015.us@gmail.com | f             | t
```

---

### 2. Backend Changes (Flask)

**File:** [app.py](antyboty/app.py)

**Login endpoint** (Line 499-509):
```python
# Check if user is admin or subscribed
is_admin = user.get("is_admin", False)
is_subscribed = user.get("is_subscribed", False)

return jsonify({
    "message": "Login successful",
    "token": token,
    "userId": user["id"],
    "isAdmin": is_admin,
    "isSubscribed": is_subscribed or is_admin  # Admins are treated as subscribed
})
```

**Subscription status endpoint** (Line 1023-1030):
```python
# Admins are treated as subscribed
is_admin = result.get("is_admin", False)
is_subscribed = result.get("is_subscribed", False)

return jsonify({
    "isSubscribed": is_subscribed or is_admin,
    "isAdmin": is_admin
})
```

---

### 3. Frontend Changes (React)

**File:** [LoginPage.tsx](antyboty/src/pages/LoginPage.tsx) (Line 56-57)

**Login saves admin status:**
```typescript
localStorage.setItem("isSubscribed", data.isSubscribed ? "true" : "false");
localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
```

**File:** [App.tsx](antyboty/src/App.tsx)

**Subscription check updated** (Line 2713):
```typescript
localStorage.setItem("isAdmin", res.data.isAdmin ? "true" : "false");
```

**Chat limit bypass** (Line 1969-1975):
```typescript
const isAdmin = localStorage.getItem("isAdmin") === "true";

// Check subscription limit (admins bypass this check)
if (!isSubscribed && !isAdmin && chatCount >= 5) {
  setModalPage("subscription-modal"); // Show the pricing popup
  return; // Block sending further messages
}
```

---

## How Admin Accounts Work

### Features:
✅ **Unlimited chats** - No 5-message limit
✅ **No subscription required** - Full access without Stripe payment
✅ **All AI models** - GPT-4, GPT-3.5, Ollama, etc.
✅ **Full features** - Chat history, encryption, everything

### Technical Flow:

1. **User logs in** with admin account
2. **Backend checks** `is_admin` column in database
3. **Backend returns** `isAdmin: true` in login response
4. **Frontend saves** `isAdmin` to localStorage
5. **Subscription checks** bypass if `isAdmin === true`
6. **Chat limits** don't apply to admins

---

## Testing Your Admin Account

### Step 1: Login
1. Open http://localhost:3000
2. Login with:
   - **Email:** `vsj2015.us@gmail.com`
   - **Password:** (your password)

### Step 2: Verify Admin Status
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Type:
   ```javascript
   console.log("isAdmin:", localStorage.getItem("isAdmin"));
   console.log("isSubscribed:", localStorage.getItem("isSubscribed"));
   ```
4. **Expected output:**
   ```
   isAdmin: true
   isSubscribed: true
   ```

### Step 3: Test Unlimited Chats
1. Send more than 5 messages
2. **Expected:** No subscription popup! ✅
3. **Expected:** Can send unlimited messages ✅

---

## Creating More Admin Accounts

### Method 1: SQL Command
```sql
-- Make any existing user an admin
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';

-- Or make user admin by ID
UPDATE users SET is_admin = true WHERE id = 2;
```

### Method 2: During Registration
If you want to create a new admin account, first register normally, then run:
```bash
psql -d cyberbotdb_u_t -c "UPDATE users SET is_admin = true WHERE email = 'newemail@example.com';"
```

---

## Database Schema

### Users Table Structure:
```
                                          Table "public.users"
    Column     |            Type             | Collation | Nullable |              Default
---------------+-----------------------------+-----------+----------+-----------------------------------
 id            | integer                     |           | not null | nextval('users_id_seq'::regclass)
 username      | character varying(50)       |           | not null |
 email         | character varying(100)      |           | not null |
 password      | text                        |           | not null |
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 is_subscribed | boolean                     |           |          | false
 is_admin      | boolean                     |           |          | false  ⬅️ NEW!
```

### Admin vs Subscribed:
- **`is_admin = true`** → Full access, no Stripe needed
- **`is_subscribed = true`** → Paid via Stripe, full access
- **Both false** → Limited to 5 messages, requires subscription

---

## Useful SQL Commands

### Check all admins:
```sql
SELECT id, username, email, is_admin FROM users WHERE is_admin = true;
```

### Check subscription status:
```sql
SELECT id, username, email, is_subscribed, is_admin FROM users;
```

### Make user admin:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

### Remove admin status:
```sql
UPDATE users SET is_admin = false WHERE email = 'your@email.com';
```

### Create new user as admin (direct insert):
```sql
-- First, hash the password with bcrypt (use Python)
-- Then insert:
INSERT INTO users (username, email, password, is_admin)
VALUES ('admin', 'admin@example.com', '$2b$10$...hashedpassword...', true);
```

---

## Security Considerations

### Production Deployment:
- ⚠️ **Never expose admin status** in public APIs
- ⚠️ **Admin accounts should use strong passwords**
- ⚠️ **Limit number of admin accounts** (1-2 max)
- ⚠️ **Monitor admin activity** in production logs
- ⚠️ **Use environment variables** for admin email whitelist

### Recommended Production Setup:
```python
# In app.py, add admin whitelist
ADMIN_EMAILS = os.getenv("ADMIN_EMAILS", "").split(",")

# During login, check:
is_admin = user["email"] in ADMIN_EMAILS and user.get("is_admin", False)
```

---

## Troubleshooting

### Admin status not working?

**Check localStorage:**
```javascript
// In browser console
console.log(localStorage.getItem("isAdmin"));
// Should be "true"
```

**If it's "false", try:**
1. Logout and login again
2. Clear localStorage:
   ```javascript
   localStorage.clear();
   ```
3. Login again

**Check database:**
```sql
SELECT is_admin FROM users WHERE email = 'your@email.com';
-- Should return: t (true)
```

**Check Flask logs:**
```bash
# Look for login output
✅ Login Successful for: your@email.com
```

### Still seeing subscription popup?

**Check frontend code:**
```javascript
// In App.tsx, verify line 1972:
if (!isSubscribed && !isAdmin && chatCount >= 5) {
  // Should NOT trigger if isAdmin === true
}
```

**Force refresh:**
1. Hard reload browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + F5` (Windows)
2. Clear cache and cookies
3. Login again

---

## Summary

### ✅ What You Have Now:

1. **Admin column** added to database
2. **Your account** (`vsj2015.us@gmail.com`) is admin
3. **Backend** returns admin status on login
4. **Frontend** stores and respects admin status
5. **Subscription checks** bypass for admins
6. **Unlimited chats** for admin accounts

### 🎉 You Can Now:

- ✅ Test your app for free
- ✅ Send unlimited messages
- ✅ No Stripe payment required
- ✅ Full access to all features
- ✅ Create more admin accounts easily

---

## Quick Reference

### Your Admin Account:
- **Email:** `vsj2015.us@gmail.com`
- **Database:** `cyberbotdb_u_t`
- **ID:** 1
- **Admin:** ✅ Yes

### Access URLs:
- **App:** http://localhost:3000
- **Backend:** http://localhost:5001
- **Database:** `psql -d cyberbotdb_u_t`

### Admin Check:
```sql
SELECT * FROM users WHERE email = 'vsj2015.us@gmail.com';
```

**Enjoy unlimited testing! 🚀**
