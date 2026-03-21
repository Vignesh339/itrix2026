# Quick Integration Guide

## For Admin Users

### Change Password:
1. Click the **key icon** (🔑) in the top right of the admin dashboard
2. Enter your current password: `admin123`
3. Enter a new password with at least:
   - 8 characters
   - 1 uppercase letter
   - 1 lowercase letter
   - 1 number
   - 1 special character (@$!%*?&)
4. Confirm the new password
5. Click "Change Password" - Session maintains automatically

### Update Global Timer:
1. Use the **timer dropdown** in the admin header
2. Select new timer value (30, 45, 60, 90, or 120 minutes)
3. All new participants automatically get the selected duration
4. Existing participants keep their current timers

### Manage Whitelisted Applications:
1. In admin dashboard, go to the **"Violations"** tab (if showing detailed violations view)
2. Find **"Proctoring Settings"** section
3. **Add App**: Type application name and click "Add App"
   - Example: "Sublime Text", "Python IDE", etc.
4. **Remove App**: Click the X on any whitelisted app badge
5. Changes apply immediately to all participants

---

## For Participants

### During Test Session:
- **Permitted Activities** (no violations):
  - Using whitelisted applications (Arduino IDE, VS Code, etc.)
  - Writing code and completing tasks
  - Reading documentation

- **Prohibited Activities** (violations logged):
  - Switching to other browser tabs
  - Opening chat interfaces (Discord, Slack, etc.)
  - Alt+Tab or Command+Tab to other applications
  - Accessing unauthorized websites
  - Opening developer tools (right-click blocked)

- **Warnings** (careful):
  - Minimizing window/losing focus without switching to whitelisted app
  - Exiting fullscreen mode

---

## Component Setup Instructions

### To View Setup Instructions for a Component:
1. In the participant interface, locate the component you need to set up
2. Click on the component or "Setup Instructions" button
3. View detailed information:
   - Step-by-step setup guide
   - Arduino pin configuration
   - Required libraries
   - Important warnings
   - Code example

### Example: Connecting a Servo Motor:
1. From component docs, you'll see:
   ```
   Signal (Orange) → Arduino Pin 9 (PWM)
   Power (Red) → Arduino 5V
   Ground (Brown) → Arduino GND
   ```
2. Include the Servo library: `#include <Servo.h>`
3. Attach servo: `myservo.attach(9)`
4. Control with: `myservo.write(angle)` (0-180 degrees)

---

## Violations Explanation

### How Violations Are Categorized:

**🟢 PERMITTED (Green)** - Allowed Activities
- Accessing whitelisted local applications
- These do NOT count against score
- Examples: Arduino IDE, VS Code for coding

**🟡 WARNING (Yellow)** - Caution Activities
- Window loses focus without clear context
- Should be minimized but tracked
- Examples: Accidental window minimize

**🔴 CRITICAL (Red)** - Prohibited Activities
- Tab switches to other websites
- Chat/communication attempts
- Keyboard shortcuts to switch apps (Alt+Tab)
- Right-click attempts
- Examples: Opening email, YouTube, chat apps

---

## Troubleshooting

### Can't Log In to Admin Panel:
- Ensure password is exactly correct (case-sensitive)
- Default password is: `admin123`
- If forgotten, server needs restart (development only)

### Timer Not Updating:
- Confirm you selected a new value in dropdown
- Wait 1-2 seconds for API update
- Refresh page if not showing new value
- Check browser console for errors (F12)

### Violations Not Showing:
- Ensure participant has been active in test
- Violations update every 5 seconds (check refresh time)
- Filter violations by severity if only viewing specific types
- Ensure participant hasn't cleared cache

### Whitelisted App Not Working:
- Ensure app name matches exactly (case matters for some)
- App must be installed and running
- Browser sandbox limits app detection
- Some apps may require OS-level integration

---

## API Testing (For Developers)

### Verify Password:
```bash
curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

### Change Password:
```bash
curl -X POST http://localhost:3000/api/admin/password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword":"admin123",
    "newPassword":"NewPass123!",
    "confirmPassword":"NewPass123!"
  }'
```

### Get Global Timer:
```bash
curl http://localhost:3000/api/admin/timer
```

### Set Global Timer (60 minutes):
```bash
curl -X POST http://localhost:3000/api/admin/timer \
  -H "Content-Type: application/json" \
  -d '{"duration":3600}'
```

### Get Whitelisted Apps:
```bash
curl http://localhost:3000/api/admin/whitelist
```

### Add Whitelisted App:
```bash
curl -X POST http://localhost:3000/api/admin/whitelist \
  -H "Content-Type: application/json" \
  -d '{"action":"add","app_name":"Sublime Text"}'
```

### Remove Whitelisted App:
```bash
curl -X POST http://localhost:3000/api/admin/whitelist \
  -H "Content-Type: application/json" \
  -d '{"action":"remove","app_name":"Sublime Text"}'
```

---

## Security Notes

### For Production Deployment:
1. **Change Default Password Immediately** - Do NOT use "admin123"
2. **Use HTTPS** - All admin connections should be encrypted
3. **Implement Rate Limiting** - Prevent brute force password attempts
4. **Add Session Timeout** - Auto-logout after inactivity
5. **Enable Audit Logging** - Log all admin actions
6. **Use Database** - Don't rely on in-memory storage
7. **Hash Passwords** - Use bcrypt or argon2
8. **Add MFA** - Consider two-factor authentication

### Best Practices:
- Never share admin credentials
- Change password regularly
- Monitor violation logs for suspicious patterns
- Review participant activity logs
- Keep component documentation up to date
- Test all features before competition

---

## Support

For issues or questions:
1. Check the IMPLEMENTATION_SUMMARY.md for detailed technical info
2. Review this guide for common troubleshooting
3. Check browser console (F12) for error messages
4. Verify all API endpoints are responding (test with curl)
5. Check that database is initialized (/api/init)

---

Last Updated: 2026-03-22
Status: ✅ All Features Implemented and Ready for Use
