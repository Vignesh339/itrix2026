# Participant Round Assignment & Question Management Guide

## Overview
The system now supports instant round assignment during participant creation and AI-powered question generation with custom filtering for each participant.

## Part 1: Create Participant with Round Assignment

### Step-by-Step Process

1. **Login to Admin Panel**
   - Password: `admin123`

2. **Go to Participants Tab**
   - Click "Add Participant" button

3. **Fill Participant Details**
   - **Name**: Participant's full name (required)
   - **Team Name**: Optional team affiliation
   - **Custom ID**: Leave blank for auto-generation or enter custom 6-character code
   - **Assign to Round**: Select from dropdown (NEW!)
     - **Round 1 - MCQ Quiz**: Participant takes MCQ-based assessment
     - **Round 2 - Hands-on Scenario**: Participant works on IoT scenario

4. **Click "Create Participant"**
   - System immediately assigns the round
   - If Round 2: Auto-assigns a scenario
   - If Round 1: No scenario needed, ready for question assignment

5. **Confirm Creation**
   - View participant ID and assigned round
   - Participant can now login with their ID

### What Happens After Creation

**Round 1 Participant:**
- Routes to `/round1/[ID]` on login
- Takes MCQ questions
- Score tracked automatically
- Can skip to next question

**Round 2 Participant:**
- Routes to `/participant/[ID]` on login
- Works on assigned IoT scenario
- Timer starts automatically
- Violations tracked

---

## Part 2: AI-Powered Question Generation

### Generate Questions with AI

1. **Go to Round 1 - Questions Tab**
   - Click "AI Generate Questions" button (Sparkles icon)

2. **Configure Generation Settings**
   - **Topic/Concept**: Enter what you want questions about
     - Example: "Arduino Digital I/O", "Sensor Integration", "PWM Control"
   - **Section**: Choose section (A, B, C, or D)
   - **Difficulty**: Select level
     - Easy (1 point)
     - Medium (2 points)
     - Hard (3 points)
   - **Count**: Number of questions to generate (1-20)

3. **Click "Generate Questions"**
   - AI generates questions with multiple choice options
   - Marked with difficulty and point value
   - Ready to review

4. **Review Generated Questions**
   - Each question shows in a card with:
     - Title
     - Section badge
     - Difficulty badge
     - Point value
   - Scroll through all generated questions

5. **Import to Question Bank**
   - **Generate More**: Create additional questions with different topics
   - **Import to Questions**: Add selected questions to your question bank

---

## Part 3: Filter & Assign Questions to Participants

### Create Custom Question Sets

1. **Go to Round 1 - Questions Tab**
   - Click "Assign to Participants" button (Filter icon)

2. **Select Questions Tab**
   - Use filters to narrow down:
     - **Filter by Section**: A, B, C, or D
     - **Filter by Difficulty**: Easy, Medium, or Hard
   - Click "Select All Filtered" to select matching questions
   - Or click individual questions to select them
   - **Current count shows at bottom**

3. **Switch to Participants Tab**
   - See all Round 1 participants
   - Click participant checkboxes to select
   - Can select multiple participants
   - Shows participant name and ID

4. **Assign Questions**
   - Click "Assign [X] Questions"
   - Confirmation shows which participants get which questions
   - Different participants can get different question sets!

### Example Scenarios

**Scenario A: Same questions for all**
1. Generate 20 questions on topic "Sensors"
2. Select all 20 questions
3. Select all participants
4. Assign

**Scenario B: Different difficulty levels**
1. Generate questions (Easy section)
2. Generate questions (Hard section)
3. Assign Easy to newer participants
4. Assign Hard to advanced participants

**Scenario C: Targeted content**
1. Generate 5 questions on "Arduino"
2. Generate 5 questions on "IoT"
3. Assign Arduino questions to Group 1
4. Assign IoT questions to Group 2

---

## Part 4: Workflow Overview

```
1. Create Participants
   ├─ Name, Team, ID
   └─ Select Round at creation ← NEW!

2. For Round 1 Only:
   ├─ Generate Questions with AI
   │  ├─ Specify topic & difficulty
   │  └─ Review & import
   │
   ├─ Create Additional Questions Manually
   │  └─ Or add more via AI
   │
   └─ Assign Question Sets
      ├─ Filter by section/difficulty
      └─ Each participant gets custom set

3. Participants Login
   ├─ Round 1 → Quiz Interface
   └─ Round 2 → Scenario Interface
```

---

## Part 5: Advanced Features

### Participant Viewing Scores
- Round 1 participants don't see violation count (hidden)
- Only admins can see violations

### Question Banking
- Questions stored in database
- Can be reused across multiple rounds
- Version control through timestamps

### Customization Per Participant
- Each participant can have unique question set
- Different difficulty levels
- Different content areas
- Tracked independently

### Admin Controls
- View all questions with filters
- Delete questions if needed
- Edit question properties
- Export question sets for backup

---

## Key Differences from Previous System

| Feature | Before | Now |
|---------|--------|-----|
| Round Assignment | Manual after creation | At creation time |
| Question Generation | Manual entry only | AI-powered |
| Question Filtering | None | By section & difficulty |
| Participant Questions | Same for all | Customizable per participant |
| Question Reuse | Limited | Full database support |

---

## Troubleshooting

**Q: What if I don't assign a round?**
- Default is Round 2 (scenarios)
- Change anytime via admin panel

**Q: Can I change a participant's round later?**
- Yes, go to participants list and reassign
- Previous progress not affected

**Q: How many questions should I assign?**
- Minimum 1, maximum unlimited
- Recommended: 20-50 per participant

**Q: What if AI generates poor questions?**
- Review and delete bad questions
- Generate new set with different topic
- Mix AI questions with manual ones

**Q: Can two participants have identical question sets?**
- Yes, select same questions for multiple participants
- Or select different sets

---

## Best Practices

1. **Generate in batches**: Create 20+ questions, review, select best ones
2. **Mix difficulty levels**: Not all Easy or all Hard
3. **Distribute fairly**: Similar difficulty for similar skill levels
4. **Review before assigning**: Check generated questions are appropriate
5. **Track assignments**: Document which participant got which set
