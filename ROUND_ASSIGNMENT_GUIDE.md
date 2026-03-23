# How to Assign Rounds to Participants

## Overview
Participants can be assigned to either **Round 1** (MCQ-based assessment) or **Round 2** (Hands-on scenario with components). This guide walks you through the process.

---

## Step-by-Step Guide

### Step 1: Access Admin Dashboard
1. Go to the **Admin Panel** in your IoT platform
2. Enter the admin password: **`admin123`**
3. Stay on the admin dashboard (you will no longer be redirected to home)

### Step 2: Navigate to Round 1 Management
In the admin dashboard, you'll see several tabs at the top:
- **Participants**
- **Round 1 - Manage** ← Click this tab
- **Round 1 - Questions**
- Activity Log
- Violations
- Components

Click on the **"Round 1 - Manage"** tab to open the round assignment interface.

### Step 3: View and Assign Participants

#### Option A: Bulk Assign to Round 1
1. In the "Round 1 - Manage" tab, you'll see a list of all participants
2. Each participant row shows:
   - Participant ID (e.g., ABCDEF)
   - Name
   - Team Name
   - Current Round Assignment (if any)
3. Click the **"Assign to Round 1"** button next to any participant
4. The participant is immediately assigned and will see Round 1 when they next log in

#### Option B: Bulk Assign Multiple Participants
1. You can select multiple participants at once using checkboxes
2. Use the bulk action button at the bottom
3. All selected participants will be assigned to Round 1 simultaneously

#### Option C: Assign to Round 2 (Hands-on)
1. Click **"Assign to Round 2"** button if you want them to do the component-based scenario instead
2. These participants will be routed to the hands-on scenario page with a timer

### Step 4: Verify Assignment

After assigning a round:
- The participant's assigned round will update in real-time
- The participant's entry will show their current round status
- If you need to change it, click the opposite button to reassign

---

## What Happens After Assignment

### For Round 1 Participants:
1. When they log in with their Participant ID, they're automatically routed to `/round1/[ID]`
2. They'll see the Round 1 quiz interface with:
   - Multiple choice questions
   - Questions organized in sections (A, B, C, D)
   - Timer counting down
   - Violation tracking (tab switches blocked, etc.)
3. Results are recorded and scored immediately
4. Admin can view their Round 1 scores in the results dashboard

### For Round 2 Participants:
1. When they log in, they're automatically routed to `/participant/[ID]`
2. They'll see the hands-on scenario interface with:
   - Component-based challenges
   - Code snippets to unlock
   - Timer counting down
   - Real-time monitoring

---

## Admin Controls in Round 1 - Manage Tab

### View Participants Status
- **Unassigned**: No round assigned yet - they'll see an error if they try to log in
- **Round 1**: Assigned to MCQ assessment
- **Round 2**: Assigned to hands-on scenario

### Change Assignments Anytime
- You can reassign a participant even after they've started
- Their previous progress is preserved (scores, violations, etc.)
- Only the next login will route them to the new round

### Track Round 1 Results
- View completed Round 1 quizzes in the admin panel
- See scores broken down by section (A, B, C, D)
- View violation history during Round 1

---

## Round 1 - Questions Tab

In this tab, you can:
1. **Create new questions** for Round 1
2. **Manage existing questions** - edit, delete, or view
3. **Organize by section** - Questions are grouped into sections A, B, C, D
4. **Set difficulty levels** - Easy, Medium, Hard (affects scoring)
5. **Specify question types**:
   - MCQ (Multiple Choice)
   - Multi-select (Multiple correct answers)
   - Matching (Pin components to descriptions)
   - Component Matching
   - Logic Questions
   - Simulation (code behavior prediction)

### Creating a Question:
1. Click **"Add New Question"** button
2. Fill in:
   - **Title**: Question text
   - **Scenario**: Brief context
   - **Section**: A, B, C, or D
   - **Type**: Select from question types above
   - **Difficulty**: Easy/Medium/Hard
   - **Score**: Points for correct answer (typically 1-5)
   - **Time Limit**: Seconds per question
   - **Options**: Add answer choices
   - **Correct Answer**: Mark which option(s) are correct
   - **Explanation**: Optional help text for reviewing answers
3. Click **Save** to add to the question bank

---

## Default Behavior

### If No Round is Assigned:
- Participant tries to log in with their ID
- System shows error: "Round assignment pending. Please contact the admin."
- Admin needs to assign a round before they can proceed

### Auto-Routing:
- **Round 1 assigned** → Participant automatically goes to `/round1/[ID]`
- **Round 2 assigned** → Participant automatically goes to `/participant/[ID]`
- If scenario is not yet assigned in Round 2, timer doesn't start until scenario is selected

---

## Tips & Best Practices

1. **Assign all participants before competition starts** - This prevents confusion
2. **Group participants** - Assign all Round 1 first, then Round 2, to keep batches consistent
3. **Test the system** - Create a test participant and verify routing works before real event
4. **Monitor violations** - Round 1 automatically tracks:
   - Tab switches (CRITICAL violation)
   - Window blur events (WARNING)
   - Browser shortcuts like Ctrl+T (CRITICAL)
5. **View scores** - Check Round 1 results tab to see who completed and their scores
6. **Change passwords** - Click the key icon in admin header to change the admin password securely

---

## Troubleshooting

**Problem**: Participant can't see their assigned round
- **Solution**: Refresh the admin page to ensure latest data is loaded

**Problem**: Participant went to wrong round
- **Solution**: Reassign them in the "Round 1 - Manage" tab - their previous progress is preserved

**Problem**: Round 1 questions not appearing
- **Solution**: Go to "Round 1 - Questions" tab and create questions first

**Problem**: Admin password not working
- **Solution**: Password is case-sensitive. Default is `admin123`

---

## Quick Reference

| Action | Location | Steps |
|--------|----------|-------|
| Assign to Round 1 | Round 1 - Manage Tab | Click "Assign to Round 1" button |
| Assign to Round 2 | Round 1 - Manage Tab | Click "Assign to Round 2" button |
| Create Questions | Round 1 - Questions Tab | Click "Add New Question" |
| View Results | Round 1 - Questions Tab | See completed quizzes section |
| Change Password | Admin Header | Click key icon, enter old & new password |
| Change Timer Duration | Admin Header | Use clock dropdown, select new time |

