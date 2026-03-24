module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/component-docs.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Component documentation and setup instructions
// This file contains detailed setup information for each component
__turbopack_context__.s([
    "componentDocumentation",
    ()=>componentDocumentation,
    "getAllComponentDocumentation",
    ()=>getAllComponentDocumentation,
    "getComponentDocumentation",
    ()=>getComponentDocumentation
]);
const componentDocumentation = {
    // 1. Micro SD Card
    1: {
        complexity_level: 'Intermediate',
        estimated_setup_time: 15,
        setup_instructions: `1. Insert Micro SD Card into SD Card reader
2. Connect SD Card Module to Arduino:
   - VCC → Arduino 5V
   - GND → Arduino GND
   - MOSI → Arduino Pin 11
   - MISO → Arduino Pin 12
   - SCK → Arduino Pin 13
   - CS → Arduino Pin 10
3. Format SD Card as FAT32 if needed
4. Load SD library example in Arduino IDE
5. Verify CS pin matches your setup
6. Test with basic file read/write operations`,
        default_pins: {
            'VCC': 5,
            'GND': 0,
            'MOSI': 11,
            'MISO': 12,
            'SCK': 13,
            'CS': 10
        },
        connection_diagram: 'SD Module → SPI Bus (Pins 10-13) with 5V supply',
        warnings: [
            'Use 3.3V regulator if SD module operates at 3.3V',
            'Maximum SPI frequency: 4 MHz',
            'Ensure CS pin is always pulled high before communication'
        ],
        required_libraries: [
            'SD.h',
            'SPI.h'
        ]
    },
    // 2. Card Reader USB
    2: {
        complexity_level: 'Beginner',
        estimated_setup_time: 5,
        setup_instructions: `1. No Arduino connection required
2. Use standard USB port on development PC
3. Connect USB 3.1 Gen 1 Cable from Card Reader to PC
4. Insert SD/MicroSD Card into reader slot
5. Card appears as mass storage device
6. Use system file manager for file access`,
        connection_diagram: 'Direct USB connection to computer',
        warnings: [
            'Ensure USB 3.1 compatibility with your system',
            'Do not hot-swap cards while active',
            'Close all file access before ejecting card'
        ],
        required_libraries: []
    },
    // 3. Small Servo Motor
    3: {
        complexity_level: 'Beginner',
        estimated_setup_time: 10,
        setup_instructions: `1. Identify servo connections:
   - Orange: Signal (PWM)
   - Red: Power (5V)
   - Brown: Ground
2. Connect to Arduino:
   - Signal → Arduino Pin 9 (PWM pin)
   - Power → Arduino 5V
   - Ground → Arduino GND
3. Include Servo library
4. Create Servo object and attach to pin
5. Use servo.write(angle) to set position (0-180 degrees)
6. Test sweep motion before integration`,
        default_pins: {
            'Signal': 9,
            'Power': 5,
            'Ground': 0
        },
        connection_diagram: 'Three-wire servo connector to Arduino PWM pin 9, 5V, and GND',
        warnings: [
            'Use PWM-capable pins only (3, 5, 6, 9, 10, 11)',
            'Servo stalls at full torque - protect from over-load',
            'Position updates less than 20ms may cause jitter'
        ],
        required_libraries: [
            'Servo.h'
        ]
    },
    // 4. DC Motor
    4: {
        complexity_level: 'Intermediate',
        estimated_setup_time: 20,
        setup_instructions: `1. Use motor driver module (L298N recommended)
2. Connect Motor Driver to Arduino:
   - IN1 → Arduino Pin 8
   - IN2 → Arduino Pin 9
   - EN → Arduino Pin 5 (PWM for speed)
   - GND → Arduino GND
3. Connect motor power from external supply:
   - Motor+ → OUT1 (Motor Driver)
   - Motor- → OUT2 (Motor Driver)
4. Use analogWrite() for speed control (0-255)
5. Digital pins control direction
6. Test under no-load first`,
        default_pins: {
            'IN1': 8,
            'IN2': 9,
            'Enable': 5
        },
        connection_diagram: 'DC Motor ↔ L298N Motor Driver ↔ Arduino + External Power Supply',
        warnings: [
            'Use external power supply for motor (do not use Arduino 5V alone)',
            'Add flyback diode across motor terminals',
            'Keep motor current separate from Arduino circuit',
            'Test motor direction before securing in place'
        ],
        required_libraries: []
    },
    // 5. Piezo Capsule
    5: {
        complexity_level: 'Beginner',
        estimated_setup_time: 5,
        setup_instructions: `1. Connect Piezo to Arduino:
   - Positive (+) → Arduino Pin 8
   - Negative (-) → Arduino GND
2. Use tone() function for beeping
3. Syntax: tone(pin, frequency, duration)
4. Frequency range: 20Hz to 20,000Hz
5. Test with simple melody patterns
6. Add capacitor (0.1µF) across terminals if noise occurs`,
        default_pins: {
            'Positive': 8,
            'Negative': 0
        },
        connection_diagram: 'Piezo Capsule directly to digital pin with 220Ω resistor (optional)',
        warnings: [
            'Limit volume - can be loud (>80dB)',
            'Best frequency range: 2000Hz - 5000Hz',
            'Do not exceed duty cycle limits to prevent damage'
        ],
        required_libraries: []
    },
    // 6. LDR (Photo Resistor)
    6: {
        complexity_level: 'Beginner',
        estimated_setup_time: 10,
        setup_instructions: `1. Create voltage divider circuit:
   - LDR one terminal → Arduino 5V
   - LDR other terminal → 10K resistor → Arduino GND
   - Analog input → Arduino A0 (from junction between LDR and resistor)
2. In Arduino code:
   - Read with analogRead(A0)
   - Returns 0-1023 based on light intensity
3. Calibrate thresholds for your lighting conditions
4. Values: Dark <300, Dim 300-600, Bright >600 (typical)
5. Add delay between readings to reduce noise`,
        default_pins: {
            'Signal': 'A0',
            'VCC': 5,
            'GND': 0
        },
        connection_diagram: 'LDR in voltage divider with 10K resistor to Arduino analog pin',
        warnings: [
            'LDR sensitivity varies with light spectrum',
            'Use consistent lighting conditions for calibration',
            'Add capacitor (0.1µF) for noise filtering if needed'
        ],
        required_libraries: []
    },
    // 7. Potentiometer
    7: {
        complexity_level: 'Beginner',
        estimated_setup_time: 5,
        setup_instructions: `1. Connect Potentiometer to Arduino:
   - Left pin → Arduino GND
   - Middle pin → Arduino A0
   - Right pin → Arduino 5V
2. Read with analogRead(A0)
3. Value range: 0-1023 (low to high resistance)
4. Map values with map() function if needed
5. Use map(value, 0, 1023, minOut, maxOut) for scaling
6. Test full rotation for consistency`,
        default_pins: {
            'GND': 0,
            'Signal': 'A0',
            'VCC': 5
        },
        connection_diagram: 'Potentiometer middle pin to analog input, outer pins to power/ground',
        warnings: [
            'Never exceed 5V on analog inputs',
            'Add 0.1µF capacitor to signal pin for noise reduction',
            'Check potentiometer range (usually 0-270°)'
        ],
        required_libraries: []
    }
};
function getComponentDocumentation(componentId) {
    return componentDocumentation[componentId] || null;
}
function getAllComponentDocumentation() {
    return componentDocumentation;
}
}),
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// In-memory database store for IoT Laboratory
// Data persists during server runtime
__turbopack_context__.s([
    "addComponent",
    ()=>addComponent,
    "addScenario",
    ()=>addScenario,
    "addWhitelistedApp",
    ()=>addWhitelistedApp,
    "assignScenario",
    ()=>assignScenario,
    "changeAdminPassword",
    ()=>changeAdminPassword,
    "clearRound1Questions",
    ()=>clearRound1Questions,
    "createParticipant",
    ()=>createParticipant,
    "createRound1Question",
    ()=>createRound1Question,
    "createRound1Result",
    ()=>createRound1Result,
    "deleteParticipant",
    ()=>deleteParticipant,
    "deleteRound1Question",
    ()=>deleteRound1Question,
    "getActivityLogs",
    ()=>getActivityLogs,
    "getAllComponents",
    ()=>getAllComponents,
    "getAllParticipants",
    ()=>getAllParticipants,
    "getAllScenarios",
    ()=>getAllScenarios,
    "getComponent",
    ()=>getComponent,
    "getGlobalTimerDuration",
    ()=>getGlobalTimerDuration,
    "getParticipant",
    ()=>getParticipant,
    "getPasswordHistory",
    ()=>getPasswordHistory,
    "getRound1AssignedQuestions",
    ()=>getRound1AssignedQuestions,
    "getRound1Question",
    ()=>getRound1Question,
    "getRound1Questions",
    ()=>getRound1Questions,
    "getRound1Responses",
    ()=>getRound1Responses,
    "getRound1Result",
    ()=>getRound1Result,
    "getRound1Session",
    ()=>getRound1Session,
    "getScenario",
    ()=>getScenario,
    "getScenarioComponents",
    ()=>getScenarioComponents,
    "getStats",
    ()=>getStats,
    "getUnlockedSnippets",
    ()=>getUnlockedSnippets,
    "getViolations",
    ()=>getViolations,
    "getWhitelistedApps",
    ()=>getWhitelistedApps,
    "initializeDatabase",
    ()=>initializeDatabase,
    "isAppWhitelisted",
    ()=>isAppWhitelisted,
    "isInitialized",
    ()=>isInitialized,
    "isRound1SessionExpired",
    ()=>isRound1SessionExpired,
    "lockParticipant",
    ()=>lockParticipant,
    "logActivity",
    ()=>logActivity,
    "logViolation",
    ()=>logViolation,
    "recordRound1Response",
    ()=>recordRound1Response,
    "removeWhitelistedApp",
    ()=>removeWhitelistedApp,
    "setGlobalTimerDuration",
    ()=>setGlobalTimerDuration,
    "setScenarioComponents",
    ()=>setScenarioComponents,
    "startOrGetRound1Session",
    ()=>startOrGetRound1Session,
    "startTimer",
    ()=>startTimer,
    "unlockParticipant",
    ()=>unlockParticipant,
    "unlockSnippet",
    ()=>unlockSnippet,
    "updateParticipant",
    ()=>updateParticipant,
    "updateParticipantAssignedRound",
    ()=>updateParticipantAssignedRound,
    "updateRound1Question",
    ()=>updateRound1Question,
    "verifyAdminPassword",
    ()=>verifyAdminPassword
]);
function getStore() {
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore = {
            participants: new Map(),
            scenarios: new Map(),
            components: new Map(),
            scenarioComponents: new Map(),
            snippetUnlocks: [],
            activityLogs: [],
            violations: [],
            initialized: false,
            admin_password: "admin123",
            password_history: [],
            global_timer_duration: 7200,
            whitelisted_apps: new Set([
                "Arduino IDE",
                "Visual Studio Code",
                "Notepad++",
                "Code::Blocks"
            ]),
            round1Questions: new Map(),
            round1Responses: [],
            round1Results: new Map(),
            round1Sessions: new Map()
        };
    }
    // Ensure all required fields exist (safety check)
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.admin_password) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.admin_password = "admin123";
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.password_history) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.password_history = [];
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.global_timer_duration) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.global_timer_duration = 7200;
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.whitelisted_apps) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.whitelisted_apps = new Set([
            "Arduino IDE",
            "Visual Studio Code",
            "Notepad++",
            "Code::Blocks"
        ]);
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Questions) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Questions = new Map();
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Responses) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Responses = [];
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Results) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Results = new Map();
    }
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Sessions) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore.round1Sessions = new Map();
    }
    return /*TURBOPACK member replacement*/ __turbopack_context__.g.__iotStore;
}
function isInitialized() {
    return getStore().initialized;
}
function initializeDatabase() {
    const store = getStore();
    if (!store.initialized) {
        store.initialized = true;
    }
}
function getParticipant(id) {
    return getStore().participants.get(id);
}
function getAllParticipants() {
    const store = getStore();
    return Array.from(store.participants.values()).map((p)=>{
        const scenario = p.scenario_id ? store.scenarios.get(p.scenario_id) : null;
        const snippetsUnlocked = store.snippetUnlocks.filter((s)=>s.participant_id === p.id).length;
        const violationCount = store.violations.filter((v)=>v.participant_id === p.id).length;
        return {
            ...p,
            team_name: p.team_name,
            scenario_title: scenario?.title,
            snippets_unlocked: snippetsUnlocked,
            violation_count: violationCount
        };
    }).sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
function createParticipant(name, id, teamName, assignedRound) {
    const store = getStore();
    const participant = {
        id,
        name,
        team_name: teamName,
        assigned_round: assignedRound || null,
        scenario_id: null,
        timer_duration: store.global_timer_duration,
        timer_started_at: null,
        is_active: 0,
        is_locked: 0,
        created_at: new Date().toISOString(),
        round1_score: 0,
        round1_completed: false,
        round2_score: 0,
        round2_completed: false
    };
    store.participants.set(id, participant);
    return participant;
}
function assignScenario(participantId, scenarioId) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (participant) {
        participant.scenario_id = scenarioId;
        store.participants.set(participantId, participant);
    }
}
function startTimer(participantId, duration = 3600) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (participant) {
        participant.timer_started_at = new Date().toISOString();
        participant.timer_duration = duration;
        participant.is_active = 1;
        store.participants.set(participantId, participant);
        logActivity(participantId, 'timer_start', `Timer started: ${duration} seconds`);
    }
}
function lockParticipant(participantId) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (participant) {
        participant.is_locked = 1;
        participant.is_active = 0;
        store.participants.set(participantId, participant);
        logActivity(participantId, 'locked', 'Dashboard locked - time expired');
    }
}
function unlockParticipant(participantId) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (participant) {
        participant.is_locked = 0;
        store.participants.set(participantId, participant);
        logActivity(participantId, 'unlocked', 'Dashboard unlocked by admin');
    }
}
function updateParticipant(participantId, updates) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (participant) {
        Object.assign(participant, updates);
        store.participants.set(participantId, participant);
    }
}
function deleteParticipant(participantId) {
    const store = getStore();
    store.participants.delete(participantId);
    store.snippetUnlocks = store.snippetUnlocks.filter((s)=>s.participant_id !== participantId);
    store.activityLogs = store.activityLogs.filter((a)=>a.participant_id !== participantId);
    store.violations = store.violations.filter((v)=>v.participant_id !== participantId);
}
function getScenario(id) {
    return getStore().scenarios.get(id);
}
function getAllScenarios() {
    return Array.from(getStore().scenarios.values());
}
function addScenario(scenario) {
    getStore().scenarios.set(scenario.id, scenario);
}
function setScenarioComponents(scenarioId, componentIds) {
    getStore().scenarioComponents.set(scenarioId, componentIds);
}
function getComponent(id) {
    const component = getStore().components.get(id);
    if (!component) return undefined;
    // Import and merge with documentation if available
    try {
        // Dynamically import component docs
        const { getComponentDocumentation } = __turbopack_context__.r("[project]/lib/component-docs.ts [app-rsc] (ecmascript)");
        const docs = getComponentDocumentation(id);
        if (docs) {
            return {
                ...component,
                ...docs
            };
        }
    } catch (e) {
    // If component-docs not available, return basic component
    }
    return component;
}
function getAllComponents() {
    const components = Array.from(getStore().components.values()).sort((a, b)=>a.id - b.id);
    // Try to merge with documentation
    try {
        const { getComponentDocumentation } = __turbopack_context__.r("[project]/lib/component-docs.ts [app-rsc] (ecmascript)");
        return components.map((comp)=>{
            const docs = getComponentDocumentation(comp.id);
            return docs ? {
                ...comp,
                ...docs
            } : comp;
        });
    } catch (e) {
        // If component-docs not available, return components as-is
        return components;
    }
}
function addComponent(component) {
    getStore().components.set(component.id, component);
}
function getScenarioComponents(scenarioId) {
    const store = getStore();
    const componentIds = store.scenarioComponents.get(scenarioId) || [];
    return componentIds.map((id)=>store.components.get(id)).filter(Boolean);
}
function getUnlockedSnippets(participantId) {
    const store = getStore();
    return store.snippetUnlocks.filter((s)=>s.participant_id === participantId).map((s)=>{
        const component = store.components.get(s.component_id);
        return {
            ...s,
            component_name: component?.name
        };
    }).sort((a, b)=>new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime());
}
function unlockSnippet(participantId, componentId) {
    const store = getStore();
    // Check if already unlocked
    const existing = store.snippetUnlocks.find((s)=>s.participant_id === participantId && s.component_id === componentId);
    if (existing) {
        return {
            success: false,
            message: 'Already unlocked'
        };
    }
    const unlock = {
        id: store.snippetUnlocks.length + 1,
        participant_id: participantId,
        component_id: componentId,
        unlocked_at: new Date().toISOString()
    };
    store.snippetUnlocks.push(unlock);
    logActivity(participantId, 'snippet_unlock', `Unlocked component ID: ${componentId}`);
    return {
        success: true
    };
}
function logActivity(participantId, eventType, details) {
    const store = getStore();
    const log = {
        id: store.activityLogs.length + 1,
        participant_id: participantId,
        event_type: eventType,
        details: details || null,
        created_at: new Date().toISOString()
    };
    store.activityLogs.push(log);
}
function getActivityLogs(participantId) {
    const store = getStore();
    let logs = store.activityLogs;
    if (participantId) {
        logs = logs.filter((l)=>l.participant_id === participantId);
    }
    return logs.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 200);
}
function logViolation(participantId, violationType, details, options) {
    const store = getStore();
    // Determine severity based on violation type and context
    let severity = options?.severity || 'warning';
    // Auto-categorize if not provided
    if (!options?.severity) {
        if (violationType === 'local_app_access') {
            severity = 'permitted';
        } else if (violationType === 'tab_switch' || violationType === 'chat_interface') {
            severity = 'critical';
        } else if (violationType === 'window_blur') {
            severity = 'warning';
        }
    }
    const violation = {
        id: store.violations.length + 1,
        participant_id: participantId,
        violation_type: violationType,
        severity,
        details: details || null,
        app_name: options?.app_name,
        is_approved: options?.is_approved || severity === 'permitted',
        created_at: new Date().toISOString()
    };
    store.violations.push(violation);
    logActivity(participantId, 'violation', `${violationType}${options?.app_name ? ` (${options.app_name})` : ''}: ${details || ''}`);
}
function getViolations(participantId) {
    const store = getStore();
    let violations = store.violations;
    if (participantId) {
        violations = violations.filter((v)=>v.participant_id === participantId);
    }
    return violations.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 100);
}
function getStats() {
    const store = getStore();
    const participants = Array.from(store.participants.values());
    return {
        totalParticipants: participants.length,
        activeParticipants: participants.filter((p)=>p.is_active === 1).length,
        lockedParticipants: participants.filter((p)=>p.is_locked === 1).length,
        totalComponents: store.components.size,
        totalScenarios: store.scenarios.size,
        totalViolations: store.violations.length,
        totalSnippetUnlocks: store.snippetUnlocks.length
    };
}
function verifyAdminPassword(password) {
    const store = getStore();
    return password === store.admin_password;
}
function changeAdminPassword(currentPassword, newPassword) {
    const store = getStore();
    if (currentPassword !== store.admin_password) {
        return false;
    }
    // Add to history (keep last 5)
    store.password_history.push({
        id: store.password_history.length + 1,
        old_password: store.admin_password,
        new_password: newPassword,
        changed_at: new Date().toISOString()
    });
    if (store.password_history.length > 5) {
        store.password_history.shift();
    }
    store.admin_password = newPassword;
    return true;
}
function getPasswordHistory() {
    return getStore().password_history;
}
function setGlobalTimerDuration(duration) {
    getStore().global_timer_duration = duration;
}
function getGlobalTimerDuration() {
    return getStore().global_timer_duration;
}
function getWhitelistedApps() {
    return Array.from(getStore().whitelisted_apps);
}
function addWhitelistedApp(appName) {
    getStore().whitelisted_apps.add(appName);
}
function removeWhitelistedApp(appName) {
    getStore().whitelisted_apps.delete(appName);
}
function isAppWhitelisted(appName) {
    return getStore().whitelisted_apps.has(appName);
}
function createRound1Question(question) {
    const store = getStore();
    const id = Math.max(...Array.from(store.round1Questions.keys()), 0) + 1;
    const newQuestion = {
        ...question,
        id,
        created_at: new Date().toISOString()
    };
    store.round1Questions.set(id, newQuestion);
    return newQuestion;
}
function clearRound1Questions() {
    const store = getStore();
    store.round1Questions.clear();
    store.round1Responses = [];
    store.round1Results.clear();
    store.round1Sessions.clear();
}
function getRound1Questions(section) {
    const store = getStore();
    const questions = Array.from(store.round1Questions.values());
    if (section) {
        return questions.filter((q)=>q.section === section);
    }
    return questions;
}
function getRound1Question(id) {
    return getStore().round1Questions.get(id);
}
function shuffled(items) {
    return [
        ...items
    ].sort(()=>Math.random() - 0.5);
}
function startOrGetRound1Session(participantId, perParticipantQuestionCount = 12) {
    const store = getStore();
    const existing = store.round1Sessions.get(participantId);
    if (existing) return existing;
    const all = Array.from(store.round1Questions.values());
    const requestedCount = Math.min(perParticipantQuestionCount, all.length);
    // Keep an exact per-type mix when possible, and randomize order within each section.
    const targetByType = {
        mcq: 10,
        matching: 5,
        "component-matching": 5,
        simulation: 10
    };
    const selected = [];
    Object.keys(targetByType).forEach((type)=>{
        const typeQuestions = shuffled(all.filter((q)=>q.type === type));
        const take = Math.min(targetByType[type] || 0, typeQuestions.length);
        selected.push(...typeQuestions.slice(0, take));
    });
    if (selected.length < requestedCount) {
        const selectedIds = new Set(selected.map((q)=>q.id));
        const remaining = shuffled(all.filter((q)=>!selectedIds.has(q.id)));
        selected.push(...remaining.slice(0, requestedCount - selected.length));
    }
    const orderByType = [
        "mcq",
        "matching",
        "component-matching",
        "simulation"
    ];
    const questions = orderByType.flatMap((type)=>shuffled(selected.filter((q)=>q.type === type)));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    const session = {
        participant_id: participantId,
        question_ids: questions.map((q)=>q.id),
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        submitted: false
    };
    store.round1Sessions.set(participantId, session);
    logActivity(participantId, "round1_started", `Round 1 started with ${session.question_ids.length} questions`);
    return session;
}
function getRound1Session(participantId) {
    return getStore().round1Sessions.get(participantId);
}
function isRound1SessionExpired(participantId) {
    const session = getStore().round1Sessions.get(participantId);
    if (!session) return false;
    return Date.now() >= new Date(session.expires_at).getTime();
}
function getRound1AssignedQuestions(participantId) {
    const store = getStore();
    const session = store.round1Sessions.get(participantId);
    if (!session) return [];
    return session.question_ids.map((id)=>store.round1Questions.get(id)).filter(Boolean);
}
function updateRound1Question(id, updates) {
    const store = getStore();
    const question = store.round1Questions.get(id);
    if (!question) return false;
    Object.assign(question, updates);
    store.round1Questions.set(id, question);
    return true;
}
function deleteRound1Question(id) {
    return getStore().round1Questions.delete(id);
}
function recordRound1Response(participantId, questionId, answer, timeTaken) {
    const store = getStore();
    const question = store.round1Questions.get(questionId);
    if (!question) throw new Error('Question not found');
    const session = store.round1Sessions.get(participantId);
    if (!session) throw new Error('Round 1 session not started');
    if (session.submitted) throw new Error('Round 1 session already submitted');
    if (!session.question_ids.includes(questionId)) throw new Error('Question not assigned to participant');
    let isCorrect = false;
    let scoreObtained = 0;
    if (question.type === 'mcq' || question.type === 'logic') {
        isCorrect = answer === question.correctAnswer;
    } else if (question.type === 'multi-select') {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [
            question.correctAnswer
        ];
        isCorrect = JSON.stringify(Array.isArray(answer) ? answer.sort() : [
            answer
        ]) === JSON.stringify(correctAnswers.sort());
    } else if (question.type === 'matching' || question.type === 'component-matching') {
        const normalize = (value)=>{
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return JSON.stringify(parsed);
                } catch  {
                    return value;
                }
            }
            return JSON.stringify(value);
        };
        isCorrect = normalize(answer) === normalize(question.correctAnswer);
    } else if (question.type === 'simulation') {
        isCorrect = answer === question.correctAnswer;
    }
    if (isCorrect) {
        scoreObtained = question.score;
    }
    const existingIdx = store.round1Responses.findIndex((r)=>r.participant_id === participantId && r.question_id === questionId);
    const response = {
        id: existingIdx >= 0 ? store.round1Responses[existingIdx].id : store.round1Responses.length + 1,
        participant_id: participantId,
        question_id: questionId,
        answer,
        is_correct: isCorrect,
        score_obtained: scoreObtained,
        time_taken: timeTaken,
        answered_at: new Date().toISOString()
    };
    if (existingIdx >= 0) {
        store.round1Responses[existingIdx] = response;
    } else {
        store.round1Responses.push(response);
    }
    logActivity(participantId, 'round1_response', `Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'} (${scoreObtained}/${question.score} points)`);
    return response;
}
function getRound1Responses(participantId) {
    return getStore().round1Responses.filter((r)=>r.participant_id === participantId);
}
function createRound1Result(participantId) {
    const store = getStore();
    const session = store.round1Sessions.get(participantId);
    if (!session) {
        throw new Error('Round 1 session not found');
    }
    const responses = store.round1Responses.filter((r)=>r.participant_id === participantId);
    const totalScore = responses.reduce((sum, r)=>sum + r.score_obtained, 0);
    const sectionScores = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };
    responses.forEach((response)=>{
        const question = store.round1Questions.get(response.question_id);
        if (question) {
            sectionScores[question.section] += response.score_obtained;
        }
    });
    const result = {
        id: Math.max(...Array.from(store.round1Results.keys()).map((k)=>parseInt(k)), 0) + 1,
        participant_id: participantId,
        total_score: totalScore,
        section_scores: sectionScores,
        total_questions: session.question_ids.length,
        correct_answers: responses.filter((r)=>r.is_correct).length,
        completion_status: 'completed',
        started_at: session.started_at,
        completed_at: new Date().toISOString(),
        tab_switches: 0,
        violations: 0
    };
    store.round1Results.set(participantId, result);
    session.submitted = true;
    store.round1Sessions.set(participantId, session);
    // Update participant scores
    const participant = store.participants.get(participantId);
    if (participant) {
        participant.round1_score = totalScore;
        participant.round1_completed = true;
        participant.round1_completed_at = new Date().toISOString();
        store.participants.set(participantId, participant);
    }
    logActivity(participantId, 'round1_completed', `Round 1 completed with score: ${totalScore}`);
    return result;
}
function getRound1Result(participantId) {
    return getStore().round1Results.get(participantId);
}
function updateParticipantAssignedRound(participantId, round) {
    const store = getStore();
    const participant = store.participants.get(participantId);
    if (!participant) return false;
    participant.assigned_round = round;
    store.participants.set(participantId, participant);
    logActivity(participantId, 'round_assigned', `Assigned to ${round}`);
    return true;
}
}),
"[project]/app/home-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomePageClient",
    ()=>HomePageClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HomePageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HomePageClient() from the server but HomePageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/home-client.tsx <module evaluation>", "HomePageClient");
}),
"[project]/app/home-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HomePageClient",
    ()=>HomePageClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HomePageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HomePageClient() from the server but HomePageClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/home-client.tsx", "HomePageClient");
}),
"[project]/app/home-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$home$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/home-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$home$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/home-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$home$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$home$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/home-client.tsx [app-rsc] (ecmascript)");
;
;
;
function HomePage() {
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isInitialized"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$home$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HomePageClient"], {
        serverInitialized: initialized
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12gqz4~._.js.map