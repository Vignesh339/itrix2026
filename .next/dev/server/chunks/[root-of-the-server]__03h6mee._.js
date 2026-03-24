module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/component-docs.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const { getComponentDocumentation } = __turbopack_context__.r("[project]/lib/component-docs.ts [app-route] (ecmascript)");
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
        const { getComponentDocumentation } = __turbopack_context__.r("[project]/lib/component-docs.ts [app-route] (ecmascript)");
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
"[project]/lib/seed-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "components",
    ()=>components,
    "scenarios",
    ()=>scenarios,
    "seedDatabase",
    ()=>seedDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
const components = [
    {
        id: 1,
        name: "Micro SD Card (32GB)",
        description: "32GB Micro SD Card for data storage",
        pinout: "Standard SD interface - VCC, GND, MISO, MOSI, SCK, CS",
        category: "Storage",
        quantity: 10,
        code_snippet: `// Micro SD Card with Arduino
#include <SPI.h>
#include <SD.h>

const int chipSelect = 10;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(chipSelect)) {
    Serial.println("Card failed!");
    return;
  }
  Serial.println("Card initialized.");
}

void loop() {
  File dataFile = SD.open("datalog.txt", FILE_WRITE);
  if (dataFile) {
    dataFile.println("Hello World!");
    dataFile.close();
  }
}`
    },
    {
        id: 2,
        name: "Card Reader RDF5 (Transcend) - USB 3.1 Gen 1",
        description: "USB 3.1 Gen 1 Card Reader for SD cards",
        pinout: "USB interface",
        category: "Interface",
        quantity: 10,
        code_snippet: `// USB Card Reader - Used externally with PC
// No Arduino code required - plug into USB port`
    },
    {
        id: 3,
        name: "Small Servo Motor",
        description: "9g micro servo motor for precise angular control",
        pinout: "Orange: Signal (PWM), Red: VCC (5V), Brown: GND",
        category: "Actuator",
        quantity: 10,
        code_snippet: `// Small Servo Motor Control
#include <Servo.h>

Servo myservo;
int pos = 0;

void setup() {
  myservo.attach(9);  // Servo on pin 9
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (pos = 0; pos <= 180; pos += 1) {
    myservo.write(pos);
    delay(15);
  }
  // Sweep back
  for (pos = 180; pos >= 0; pos -= 1) {
    myservo.write(pos);
    delay(15);
  }
}`
    },
    {
        id: 4,
        name: "DC Motor 5V",
        description: "5V DC motor for continuous rotation",
        pinout: "Two terminals: Motor+ and Motor-",
        category: "Actuator",
        quantity: 20,
        code_snippet: `// DC Motor Control with Transistor
const int motorPin = 9;

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  // Motor ON
  analogWrite(motorPin, 200);  // PWM speed control
  delay(2000);
  // Motor OFF
  analogWrite(motorPin, 0);
  delay(1000);
}`
    },
    {
        id: 5,
        name: "Piezo Capsule",
        description: "Piezoelectric buzzer/speaker for sound output",
        pinout: "Positive (+), Negative (-)",
        category: "Output",
        quantity: 20,
        code_snippet: `// Piezo Buzzer Tones
const int buzzerPin = 8;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // Play tone at 1000Hz for 500ms
  tone(buzzerPin, 1000, 500);
  delay(1000);
  // Play tone at 2000Hz for 500ms
  tone(buzzerPin, 2000, 500);
  delay(1000);
}`
    },
    {
        id: 6,
        name: "Photo Resistor LDR",
        description: "Light Dependent Resistor for light sensing",
        pinout: "Two terminals (no polarity) - use with 10K resistor as voltage divider",
        category: "Sensor",
        quantity: 22,
        code_snippet: `// LDR Light Sensor
const int ldrPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(ldrPin);
  Serial.print("Light: ");
  Serial.println(lightValue);
  
  if (lightValue < 300) {
    Serial.println("Dark environment");
  } else {
    Serial.println("Bright environment");
  }
  delay(500);
}`
    },
    {
        id: 7,
        name: "Potentiometer 10 kilohm",
        description: "10K variable resistor for analog input",
        pinout: "Left: GND, Middle: Signal (A0), Right: VCC",
        category: "Input",
        quantity: 15,
        code_snippet: `// Potentiometer Reading
const int potPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(potPin);  // 0-1023
  int mappedValue = map(potValue, 0, 1023, 0, 255);
  
  Serial.print("Raw: ");
  Serial.print(potValue);
  Serial.print(" Mapped: ");
  Serial.println(mappedValue);
  delay(200);
}`
    },
    {
        id: 8,
        name: "Pushbuttons",
        description: "Tactile push button switches",
        pinout: "4 pins - 2 pairs internally connected. Connect one side to GND, other to digital pin with INPUT_PULLUP",
        category: "Input",
        quantity: 35,
        code_snippet: `// Pushbutton with Internal Pull-up
const int buttonPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // LOW when pressed (pull-up configuration)
  if (digitalRead(buttonPin) == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`
    },
    {
        id: 9,
        name: "LED (Bright White)",
        description: "High brightness white LED",
        pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.",
        category: "Output",
        quantity: 50,
        code_snippet: `// White LED Blink
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}`
    },
    {
        id: 10,
        name: "LED (Red)",
        description: "Standard red LED",
        pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.",
        category: "Output",
        quantity: 50,
        code_snippet: `// Red LED with PWM Fade
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in
  for (int i = 0; i <= 255; i++) {
    analogWrite(ledPin, i);
    delay(10);
  }
  // Fade out
  for (int i = 255; i >= 0; i--) {
    analogWrite(ledPin, i);
    delay(10);
  }
}`
    },
    {
        id: 11,
        name: "LED (Green)",
        description: "Standard green LED",
        pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.",
        category: "Output",
        quantity: 50,
        code_snippet: `// Green LED Status Indicator
const int greenLed = 10;

void setup() {
  pinMode(greenLed, OUTPUT);
}

void loop() {
  // Blink pattern: 2 short, 1 long
  for (int i = 0; i < 2; i++) {
    digitalWrite(greenLed, HIGH);
    delay(200);
    digitalWrite(greenLed, LOW);
    delay(200);
  }
  digitalWrite(greenLed, HIGH);
  delay(1000);
  digitalWrite(greenLed, LOW);
  delay(500);
}`
    },
    {
        id: 12,
        name: "LED (Yellow)",
        description: "Standard yellow LED",
        pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.",
        category: "Output",
        quantity: 50,
        code_snippet: `// Yellow LED Warning Signal
const int yellowLed = 11;

void setup() {
  pinMode(yellowLed, OUTPUT);
}

void loop() {
  // Fast warning blink
  digitalWrite(yellowLed, HIGH);
  delay(100);
  digitalWrite(yellowLed, LOW);
  delay(100);
}`
    },
    {
        id: 13,
        name: "Transistor",
        description: "NPN transistor (2N2222 or similar) for switching",
        pinout: "E: Emitter, B: Base (connect via 1K resistor to Arduino), C: Collector",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// NPN Transistor as Switch for Motor
const int basePin = 9;  // PWM pin through 1K resistor to base

void setup() {
  pinMode(basePin, OUTPUT);
}

void loop() {
  // Turn on transistor (motor runs)
  analogWrite(basePin, 200);
  delay(2000);
  // Turn off transistor (motor stops)
  analogWrite(basePin, 0);
  delay(1000);
}`
    },
    {
        id: 14,
        name: "Capacitors 100nF",
        description: "100 nanofarad ceramic capacitor for decoupling",
        pinout: "Non-polarized - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// Capacitor Usage Notes
// 100nF capacitors are used for:
// - Decoupling (place near IC power pins)
// - Noise filtering
// - Debouncing circuits

// No direct Arduino code - hardware component
// Typical usage: Between VCC and GND near ICs`
    },
    {
        id: 15,
        name: "Capacitors 100uF",
        description: "100 microfarad electrolytic capacitor",
        pinout: "Polarized - Long leg/marked stripe side: Positive (+), Short leg: Negative (-)",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// Electrolytic Capacitor Usage Notes
// 100uF capacitors are used for:
// - Power supply smoothing
// - Energy storage
// - Motor noise reduction

// No direct Arduino code - hardware component
// Connect: Positive to VCC, Negative to GND`
    },
    {
        id: 16,
        name: "Capacitors 100pF",
        description: "100 picofarad ceramic capacitor",
        pinout: "Non-polarized - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// Small Capacitor Usage Notes
// 100pF capacitors are used for:
// - High frequency filtering
// - RF applications
// - Crystal oscillator circuits

// No direct Arduino code - hardware component`
    },
    {
        id: 17,
        name: "Diodes IN4007",
        description: "1N4007 rectifier diode for protection",
        pinout: "Band/stripe side: Cathode (-), Other side: Anode (+)",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// Diode Usage for Motor Protection
// Connect diode in reverse parallel with motor:
// - Cathode (stripe) to motor positive
// - Anode to motor negative
// This protects against back-EMF

// No direct Arduino code - hardware protection component`
    },
    {
        id: 18,
        name: "Resistors 220 ohm",
        description: "220 ohm resistor for LED current limiting",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 220 ohm Resistor - LED Current Limiting
// For standard LEDs with 5V supply:
// I = (5V - 2V) / 220 ohm = 13.6mA (safe for LEDs)

// Connect in series with LED:
// Arduino Pin -> 220 ohm -> LED Anode -> LED Cathode -> GND`
    },
    {
        id: 19,
        name: "Resistors 560 ohm",
        description: "560 ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 115,
        code_snippet: `// 560 ohm Resistor Usage
// Typical uses:
// - LED current limiting (lower current than 220 ohm)
// - Voltage dividers
// - Signal conditioning`
    },
    {
        id: 20,
        name: "Resistors 1 kilohm",
        description: "1K ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 1K ohm Resistor - Transistor Base Limiting
// For NPN transistor switching:
// Arduino Pin -> 1K ohm -> Transistor Base

// Also used for pull-down resistors and voltage dividers`
    },
    {
        id: 21,
        name: "Resistors 4.7 kilohm",
        description: "4.7K ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 4.7K ohm Resistor Usage
// Common uses:
// - I2C pull-up resistors
// - Voltage dividers
// - Sensor interfaces`
    },
    {
        id: 22,
        name: "Resistors 10 kilohm",
        description: "10K ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 10K ohm Resistor - LDR Voltage Divider
// Circuit: 5V -> LDR -> A0 -> 10K ohm -> GND
// This creates a voltage divider for light sensing

const int sensorPin = A0;
int lightLevel = analogRead(sensorPin);`
    },
    {
        id: 23,
        name: "Resistors 1 megohm",
        description: "1M ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 1M ohm Resistor Usage
// High resistance applications:
// - Touch sensors
// - High impedance inputs
// - Timing circuits with capacitors`
    },
    {
        id: 24,
        name: "Resistors 10 megohm",
        description: "10M ohm resistor",
        pinout: "No polarity - can be connected either way",
        category: "Electronic",
        quantity: 50,
        code_snippet: `// 10M ohm Resistor Usage
// Very high resistance applications:
// - Electret microphone biasing
// - High impedance buffers
// - Capacitive touch sensing`
    },
    {
        id: 25,
        name: "Analog to Digital Converter (MCP3204)",
        description: "12-bit ADC with SPI interface",
        pinout: "VDD: 5V, VREF: Reference Voltage, AGND: Analog GND, DGND: Digital GND, CLK: SPI Clock, DOUT: Data Out, DIN: Data In, CS: Chip Select, CH0-CH3: Analog Inputs",
        category: "Interface",
        quantity: 20,
        code_snippet: `// MCP3204 12-bit ADC
#include <SPI.h>

const int csPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(csPin, OUTPUT);
  digitalWrite(csPin, HIGH);
  SPI.begin();
}

int readADC(int channel) {
  digitalWrite(csPin, LOW);
  byte command = 0b00000110 | ((channel & 0x04) >> 2);
  byte b1 = SPI.transfer(command);
  byte b2 = SPI.transfer((channel & 0x03) << 6);
  byte b3 = SPI.transfer(0x00);
  digitalWrite(csPin, HIGH);
  return ((b1 & 0x0F) << 8) | b2;
}

void loop() {
  int value = readADC(0);
  Serial.println(value);
  delay(100);
}`
    },
    {
        id: 26,
        name: "Ultrasonic Sensor",
        description: "HC-SR04 ultrasonic distance sensor",
        pinout: "VCC: 5V, Trig: Trigger Pin, Echo: Echo Pin, GND: Ground",
        category: "Sensor",
        quantity: 10,
        code_snippet: `// HC-SR04 Ultrasonic Distance Sensor
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // Send trigger pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read echo
  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(100);
}`
    },
    {
        id: 27,
        name: "PIR Motion Sensor",
        description: "Passive Infrared motion detector",
        pinout: "VCC: 5V, OUT: Digital Output, GND: Ground",
        category: "Sensor",
        quantity: 25,
        code_snippet: `// PIR Motion Sensor
const int pirPin = 2;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  delay(60000);  // Warm-up time (1 min)
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    Serial.println("Motion detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No motion");
    digitalWrite(ledPin, LOW);
  }
  delay(500);
}`
    },
    {
        id: 28,
        name: "Temperature Sensor",
        description: "LM35 analog temperature sensor",
        pinout: "Left: VCC (5V), Middle: Output (A0), Right: GND",
        category: "Sensor",
        quantity: 35,
        code_snippet: `// LM35 Temperature Sensor
const int tempPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(tempPin);
  float voltage = reading * (5.0 / 1024.0);
  float temperature = voltage * 100;  // 10mV per degree
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  delay(1000);
}`
    },
    {
        id: 29,
        name: "DHT11",
        description: "Digital temperature and humidity sensor",
        pinout: "Pin 1: VCC (3.3-5V), Pin 2: Data, Pin 3: NC, Pin 4: GND. Use 10K pull-up on data pin.",
        category: "Sensor",
        quantity: 5,
        code_snippet: `// DHT11 Temperature & Humidity
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("% Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  delay(2000);
}`
    },
    {
        id: 30,
        name: "Relay Module",
        description: "5V relay module for switching high voltage/current loads",
        pinout: "VCC: 5V, GND: Ground, IN: Control Signal, COM: Common, NO: Normally Open, NC: Normally Closed",
        category: "Actuator",
        quantity: 10,
        code_snippet: `// Relay Module Control
const int relayPin = 7;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);  // Relay OFF (active LOW)
}

void loop() {
  // Turn relay ON
  digitalWrite(relayPin, LOW);
  Serial.println("Relay ON");
  delay(3000);
  
  // Turn relay OFF
  digitalWrite(relayPin, HIGH);
  Serial.println("Relay OFF");
  delay(3000);
}`
    },
    {
        id: 31,
        name: "ESP01 WiFi Module (Node MCU)",
        description: "ESP8266 WiFi module for IoT connectivity",
        pinout: "VCC: 3.3V, GND: Ground, TX: Transmit, RX: Receive, CH_PD: Chip Enable, GPIO0, GPIO2, RST: Reset",
        category: "Communication",
        quantity: 13,
        code_snippet: `// ESP01 AT Commands via Software Serial
#include <SoftwareSerial.h>

SoftwareSerial esp(2, 3);  // RX, TX

void setup() {
  Serial.begin(9600);
  esp.begin(115200);
  
  esp.println("AT");
  delay(1000);
  while (esp.available()) {
    Serial.write(esp.read());
  }
}

void loop() {
  if (esp.available()) {
    Serial.write(esp.read());
  }
  if (Serial.available()) {
    esp.write(Serial.read());
  }
}`
    },
    {
        id: 32,
        name: "Soil Moisture Sensor",
        description: "Capacitive or resistive soil moisture sensor",
        pinout: "VCC: 3.3-5V, GND: Ground, AO: Analog Output, DO: Digital Output (threshold)",
        category: "Sensor",
        quantity: 5,
        code_snippet: `// Soil Moisture Sensor
const int moisturePin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int moisture = analogRead(moisturePin);
  int percentage = map(moisture, 1023, 0, 0, 100);
  
  Serial.print("Moisture: ");
  Serial.print(percentage);
  Serial.println("%");
  
  if (percentage < 30) {
    Serial.println("Soil is dry - needs water!");
  }
  delay(1000);
}`
    },
    {
        id: 33,
        name: "IR Sensor",
        description: "Infrared obstacle/proximity sensor",
        pinout: "VCC: 5V, GND: Ground, OUT: Digital Output",
        category: "Sensor",
        quantity: 15,
        code_snippet: `// IR Obstacle Sensor
const int irPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(irPin, INPUT);
}

void loop() {
  if (digitalRead(irPin) == LOW) {
    Serial.println("Obstacle detected!");
  } else {
    Serial.println("No obstacle");
  }
  delay(200);
}`
    },
    {
        id: 34,
        name: "Humidity Sensor",
        description: "Analog humidity sensor module",
        pinout: "VCC: 5V, GND: Ground, OUT: Analog Output",
        category: "Sensor",
        quantity: 5,
        code_snippet: `// Humidity Sensor (Analog)
const int humidityPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawValue = analogRead(humidityPin);
  float humidity = map(rawValue, 0, 1023, 0, 100);
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  delay(1000);
}`
    },
    {
        id: 35,
        name: "PIC Microcontroller 16F877 IC",
        description: "PIC16F877A microcontroller IC",
        pinout: "40-pin DIP: MCLR, RA0-RA5, RE0-RE2, VDD, VSS, OSC1, OSC2, RC0-RC7, RD0-RD7, RB0-RB7",
        category: "Microcontroller",
        quantity: 10,
        code_snippet: `// PIC16F877A is programmed separately
// using MPLAB IDE and a PIC programmer

// Basic blink example (MPLAB C):
/*
#include <xc.h>
#define _XTAL_FREQ 20000000

void main() {
    TRISB = 0x00;
    while(1) {
        PORTB = 0xFF;
        __delay_ms(500);
        PORTB = 0x00;
        __delay_ms(500);
    }
}
*/`
    },
    {
        id: 36,
        name: "GPS NEO6M",
        description: "NEO-6M GPS module with antenna",
        pinout: "VCC: 3.3-5V, GND: Ground, TX: GPS Data Out, RX: GPS Data In",
        category: "Communication",
        quantity: 10,
        code_snippet: `// GPS NEO6M Module
#include <SoftwareSerial.h>

SoftwareSerial gps(4, 3);  // RX, TX

void setup() {
  Serial.begin(9600);
  gps.begin(9600);
}

void loop() {
  while (gps.available()) {
    char c = gps.read();
    Serial.write(c);
    // Parse NMEA sentences for lat/long
  }
}`
    },
    {
        id: 37,
        name: "GSM SIM900A",
        description: "GSM/GPRS module for cellular communication",
        pinout: "VCC: 4.2V (3.4-4.4V), GND: Ground, TXD: Transmit, RXD: Receive, RST: Reset",
        category: "Communication",
        quantity: 5,
        code_snippet: `// GSM SIM900A Module
#include <SoftwareSerial.h>

SoftwareSerial gsm(7, 8);  // RX, TX

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);
  delay(1000);
  
  // Test AT command
  gsm.println("AT");
  delay(500);
}

void sendSMS(String number, String message) {
  gsm.println("AT+CMGF=1");  // Text mode
  delay(500);
  gsm.print("AT+CMGS=\"");
  gsm.print(number);
  gsm.println("\"");
  delay(500);
  gsm.print(message);
  gsm.write(26);  // Ctrl+Z to send
}

void loop() {
  if (gsm.available()) Serial.write(gsm.read());
  if (Serial.available()) gsm.write(Serial.read());
}`
    },
    {
        id: 38,
        name: "RFID Tag",
        description: "13.56MHz RFID tags/cards",
        pinout: "Passive tag - no connections needed",
        category: "Identification",
        quantity: 20,
        code_snippet: `// RFID Tags are passive
// They are read using an RFID reader (RC522)
// Each tag has a unique ID (UID)

// Tag UIDs are typically 4 or 7 bytes
// Example UID: 0x04 0xA3 0x2B 0x1C`
    },
    {
        id: 39,
        name: "RFID Reader",
        description: "RC522 RFID reader module",
        pinout: "SDA: SPI SS, SCK: SPI Clock, MOSI: SPI MOSI, MISO: SPI MISO, IRQ: Interrupt, GND: Ground, RST: Reset, 3.3V: Power",
        category: "Identification",
        quantity: 5,
        code_snippet: `// RFID RC522 Reader
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Scan RFID card...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;
  
  Serial.print("UID: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();
  rfid.PICC_HaltA();
}`
    },
    {
        id: 40,
        name: "Light Sensor LDR",
        description: "Light Dependent Resistor module",
        pinout: "VCC: 5V, GND: Ground, AO: Analog Out, DO: Digital Out (threshold)",
        category: "Sensor",
        quantity: 10,
        code_snippet: `// LDR Light Sensor Module
const int analogPin = A0;
const int digitalPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(digitalPin, INPUT);
}

void loop() {
  int analogValue = analogRead(analogPin);
  int digitalValue = digitalRead(digitalPin);
  
  Serial.print("Analog: ");
  Serial.print(analogValue);
  Serial.print(" Digital: ");
  Serial.println(digitalValue);
  delay(500);
}`
    },
    {
        id: 41,
        name: "MPU-6050 Gyroscope",
        description: "6-axis accelerometer and gyroscope",
        pinout: "VCC: 3.3-5V, GND: Ground, SCL: I2C Clock, SDA: I2C Data, XDA: Aux I2C Data, XCL: Aux I2C Clock, AD0: Address Select, INT: Interrupt",
        category: "Sensor",
        quantity: 5,
        code_snippet: `// MPU-6050 Accelerometer/Gyroscope
#include <Wire.h>

const int MPU = 0x68;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
}

void loop() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true);
  
  int AcX = Wire.read() << 8 | Wire.read();
  int AcY = Wire.read() << 8 | Wire.read();
  int AcZ = Wire.read() << 8 | Wire.read();
  
  Serial.print("X: "); Serial.print(AcX);
  Serial.print(" Y: "); Serial.print(AcY);
  Serial.print(" Z: "); Serial.println(AcZ);
  delay(100);
}`
    },
    {
        id: 42,
        name: "TI Simplelink Sensor Tag Development Kit",
        description: "Texas Instruments CC2650 Sensor Tag",
        pinout: "Complete development kit with sensors",
        category: "Development Kit",
        quantity: 1,
        code_snippet: `// TI Simplelink Sensor Tag
// Programmed using Code Composer Studio
// Supports BLE communication

// Features: Temperature, Humidity, Pressure,
// Accelerometer, Gyroscope, Magnetometer, Light

// Use TI BLE Stack for programming`
    },
    {
        id: 43,
        name: "TI Simplelink Sensor DevPack",
        description: "Sensor expansion pack for TI Simplelink",
        pinout: "Connects to Simplelink boards via headers",
        category: "Development Kit",
        quantity: 1,
        code_snippet: `// TI Simplelink Sensor DevPack
// Extension for Simplelink boards
// Adds additional sensor capabilities

// Programmed via Code Composer Studio`
    },
    {
        id: 44,
        name: "Zigbee Wifi VXBB-02",
        description: "Zigbee WiFi bridge module",
        pinout: "VCC, GND, TX, RX, GPIO pins",
        category: "Communication",
        quantity: 1,
        code_snippet: `// Zigbee VXBB-02 Module
// Configured via AT commands
#include <SoftwareSerial.h>

SoftwareSerial zigbee(2, 3);

void setup() {
  Serial.begin(9600);
  zigbee.begin(9600);
}

void loop() {
  if (zigbee.available()) {
    Serial.write(zigbee.read());
  }
  if (Serial.available()) {
    zigbee.write(Serial.read());
  }
}`
    },
    {
        id: 45,
        name: "Zigbee VXBB-01",
        description: "Zigbee communication module",
        pinout: "VCC: 3.3V, GND: Ground, TX, RX, GPIO pins",
        category: "Communication",
        quantity: 2,
        code_snippet: `// Zigbee VXBB-01 Module
#include <SoftwareSerial.h>

SoftwareSerial zigbee(2, 3);

void setup() {
  Serial.begin(9600);
  zigbee.begin(9600);
}

void sendData(String data) {
  zigbee.println(data);
}

void loop() {
  if (zigbee.available()) {
    Serial.write(zigbee.read());
  }
}`
    },
    {
        id: 46,
        name: "Zigbee Bluetooth VBBB-01",
        description: "Zigbee Bluetooth combo module",
        pinout: "VCC: 3.3V, GND: Ground, TX, RX, BT pins",
        category: "Communication",
        quantity: 2,
        code_snippet: `// Zigbee Bluetooth VBBB-01
#include <SoftwareSerial.h>

SoftwareSerial module(2, 3);

void setup() {
  Serial.begin(9600);
  module.begin(9600);
  // Configure via AT commands
}

void loop() {
  if (module.available()) {
    Serial.write(module.read());
  }
  if (Serial.available()) {
    module.write(Serial.read());
  }
}`
    },
    {
        id: 47,
        name: "Dolphin Capacitive Proximity Switch",
        description: "Capacitive proximity sensor switch",
        pinout: "Brown: VCC (10-30V DC), Blue: GND, Black: Output (NPN)",
        category: "Sensor",
        quantity: 1,
        code_snippet: `// Capacitive Proximity Switch
const int sensorPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(sensorPin) == HIGH) {
    Serial.println("Object detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No object");
    digitalWrite(ledPin, LOW);
  }
  delay(100);
}`
    },
    {
        id: 48,
        name: "Water Solenoid Valve G1/180",
        description: "Electric solenoid valve for water flow control",
        pinout: "Coil terminals (12V DC typical). Use relay module to control.",
        category: "Actuator",
        quantity: 1,
        code_snippet: `// Water Solenoid Valve Control
// Use relay module to switch valve

const int relayPin = 7;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);  // Valve closed
}

void openValve() {
  digitalWrite(relayPin, LOW);
  Serial.println("Valve OPEN");
}

void closeValve() {
  digitalWrite(relayPin, HIGH);
  Serial.println("Valve CLOSED");
}

void loop() {
  openValve();
  delay(5000);
  closeValve();
  delay(5000);
}`
    },
    {
        id: 49,
        name: "Water Flow Sensor - YFS201",
        description: "Hall effect water flow sensor",
        pinout: "Red: VCC (5-24V), Black: GND, Yellow: Pulse Output",
        category: "Sensor",
        quantity: 1,
        code_snippet: `// YFS201 Water Flow Sensor
volatile int flowPulses = 0;
const int flowPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(flowPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(flowPin), countPulse, RISING);
}

void countPulse() {
  flowPulses++;
}

void loop() {
  int pulses = flowPulses;
  flowPulses = 0;
  
  // YFS201: 450 pulses per liter
  float liters = pulses / 450.0;
  float flowRate = liters * 60;  // L/min
  
  Serial.print("Flow: ");
  Serial.print(flowRate);
  Serial.println(" L/min");
  delay(1000);
}`
    }
];
const scenarios = [
    {
        id: 1,
        title: "The Midnight Intruder Alarm",
        team_number: 1,
        situation: "The college lab is locked after 6 PM - but someone has been sneaking in undetected. The warden installs a lock, but it gets bypassed. CCTV is expensive. The warden reaches out to the IoT lab team and says: \"I need something that detects motion in the dark and raises an alarm - but lets me silence it quickly if it's just me checking in.\"",
        what_to_build: "1. Read LDR via analogRead to determine dark/light. When dark, monitor PIR for motion.\n2. Motion detected -> red LED flashes rapidly + piezo alarms.\n3. Pressing the pushbutton within 5 seconds silences the alarm.\n4. If button is NOT pressed within 5 s, alarm continues for a full 20 seconds.\n5. After alarm ends, system re-arms automatically. Use millis() - no delay().",
        components: [
            "Photo Resistor LDR",
            "PIR Motion Sensor",
            "LED (Red)",
            "Piezo Capsule",
            "Pushbuttons"
        ]
    },
    {
        id: 2,
        title: "The Touchless Hospital Dustbin",
        team_number: 2,
        situation: "In the college medical room, bins are constantly being touched by multiple people - spreading germs during flu season. A nursing student raises a concern: \"We need bins that open themselves when you bring your hand close. No touch, no infection.\" The challenge is to make the lid movement smooth and controlled - not a sudden snap.",
        what_to_build: "1. Poll the HC-SR04 every 150 ms. When a hand is detected within 15 cm, smoothly sweep the servo from 0 degrees (closed) to 90 degrees (open) - one degree at a time, 8 ms between steps.\n2. Hold open for 4 seconds, then sweep back to 0 degrees at the same speed.\n3. Green LED stays on while lid is open.\n4. One short beep when opening, two short beeps when closing.\n5. Block re-trigger while lid is already moving or open.",
        components: [
            "Ultrasonic Sensor",
            "Small Servo Motor",
            "LED (Green)",
            "Piezo Capsule",
            "Resistors 220 ohm"
        ]
    },
    {
        id: 3,
        title: "The Seminar Hall Occupancy Counter",
        team_number: 3,
        situation: "The college seminar hall seats 80 people but is never managed properly. Some events are dangerously overcrowded while others are half-empty. The Events Committee asks: \"Can we have a live headcount at the door - something that tells us exactly how many people are inside right now, without cameras or manual counting?\"",
        what_to_build: "1. Mount IR sensor A and B 5 cm apart at the door frame.\n2. Track which sensor triggers first: A then B = entry (count++), B then A = exit (count--).\n3. Allow a 300 ms window to detect the second sensor after the first fires.\n4. Display occupancy on 3 LEDs: green = low (0-3), yellow = medium (4-7), red = high (8+).\n5. A short beep on each valid entry or exit. Count must not go below 0.\n6. Log direction and count to Serial on every change.",
        components: [
            "IR Sensor",
            "IR Sensor",
            "LED (Green)",
            "LED (Yellow)",
            "LED (Red)"
        ]
    },
    {
        id: 4,
        title: "The Smart Staircase Lighting",
        team_number: 4,
        situation: "The hostel staircase is completely dark after 10 PM. A student broke their wrist tripping in the dark last semester - the switch is at the wrong end and nobody bothers to flick it. The hostel warden wants lights that respond automatically, stay on long enough for safe passage, and need no switches at all.",
        what_to_build: "1. Two PIR sensors simulate top and bottom of a staircase.\n2. PIR-top triggers -> green LED on for 20 s; resets timer if motion is detected again within the window.\n3. PIR-bottom triggers -> red LED on for 20 s with the same re-trigger logic.\n4. Both LEDs can be on simultaneously - they operate fully independently.\n5. No blocking code - use millis() for both independent 20 s timers.\n6. Serial-print which PIR triggered and each LED's remaining time every 5 s.",
        components: [
            "PIR Motion Sensor",
            "PIR Motion Sensor",
            "LED (Green)",
            "LED (Red)",
            "Resistors 220 ohm"
        ]
    },
    {
        id: 5,
        title: "The Smart Pedestrian Crossing",
        team_number: 5,
        situation: "A narrow lane through the college campus has become dangerous. Vehicles speed through while pedestrians step out from between parked cars. Two near-misses in the same month forced the administration to act. A proper traffic light system would take months of approval. You have a weekend and five components.",
        what_to_build: "1. Idle state: red LED on (stop), servo at 0 degrees (barrier down).\n2. Pedestrian presses button -> check HC-SR04 for vehicle (distance < 40 cm = vehicle present).\n3. Vehicle present -> red LED flashes fast, deny crossing, recheck every 500 ms for up to 10 s.\n4. No vehicle -> green LED on + servo sweeps to 90 degrees (barrier up). Hold crossing open for 7 s.\n5. Servo sweeps back to 0 degrees, green off, red on.\n6. Serial-log each button press, vehicle detection result, and crossing duration.",
        components: [
            "Pushbuttons",
            "Ultrasonic Sensor",
            "Small Servo Motor",
            "LED (Green)",
            "LED (Red)"
        ]
    },
    {
        id: 6,
        title: "The Malfunctioning Traffic Signal",
        team_number: 6,
        situation: "The traffic signal at the college entrance has broken down. It's stuck on red and hasn't changed in two days. Vehicles are piling up and pedestrians are jaywalking dangerously. The college principal calls the IoT lab team: \"I need a temporary working traffic signal installed by tomorrow morning - one that runs automatically but lets a traffic officer override it manually with a button.\"",
        what_to_build: "1. Normal operation: cycle automatically - white LED on (go) for 8 s -> yellow LED blink 3 times (slow down) -> relay clicks off (stop/red, simulated) -> repeat.\n2. Piezo beeps once at every phase change so people nearby can hear the signal switch.\n3. Pushbutton = officer override: immediately jumps to stop phase (relay OFF, yellow LED off, white LED off) and holds for 15 s before resuming auto-cycle.\n4. During override: yellow LED flashes rapidly to indicate manual control is active.\n5. Use millis() for all phase timing - no delay(). Serial-print current phase and time remaining every second.",
        components: [
            "LED (Yellow)",
            "LED (Bright White)",
            "Pushbuttons",
            "Piezo Capsule",
            "Relay Module"
        ]
    },
    {
        id: 7,
        title: "The Forgotten Classroom Lights",
        team_number: 7,
        situation: "Every evening the college classrooms are left with lights blazing - the last student out never bothers to switch them off. The electricity bill has doubled. The facilities manager is furious: \"I want the lights to turn off automatically when it gets dark outside and nobody is in the room - but I still want a manual override button for when someone genuinely needs to keep them on.\"",
        what_to_build: "1. Read LDR every 1 s using millis(). When ambient light drops below threshold (< 300 ADC) -> relay ON, simulating room lights turning off (or fan stopping).\n2. When light is above threshold (bright, daytime) -> relay stays OFF (lights not needed).\n3. White LED mirrors relay state - on when relay is on.\n4. Yellow LED = system status indicator, always on to show the controller is active.\n5. Pushbutton toggles a manual override flag: when override is ON, relay is forced OFF regardless of LDR (lights stay on). Press again to release override.\n6. Serial-print LDR value, relay state, and override flag every 2 s.",
        components: [
            "Photo Resistor LDR",
            "Relay Module",
            "LED (Yellow)",
            "LED (Bright White)",
            "Pushbuttons"
        ]
    },
    {
        id: 8,
        title: "The Runaway Workshop Fan",
        team_number: 8,
        situation: "The college workshop bench fan has no speed limit. Students routinely crank it to maximum, and last semester the plastic blades cracked under stress, sending a fragment across the room. Nobody was hurt - barely. The HOD has mandated: the fan must not exceed a safe speed, and must slow itself down automatically if a student tries to go too fast.",
        what_to_build: "1. Read potentiometer every 200 ms. Map ADC (0-1023) to PWM (0-255) and drive DC motor via NPN transistor.\n2. Yellow LED = slow zone (PWM < 100). Both LEDs off = medium (100-200). Red LED = fast (> 200).\n3. When PWM > 220 (danger zone): automatically cap PWM at 180 - override the potentiometer input.\n4. Red LED rapid flash + piezo 3000 Hz warning beep every 2 s during override.\n5. When pot is dialled back below 200, restore normal pot control and clear override.\n6. Serial-log pot value, PWM applied, speed zone, and override flag every 500 ms.",
        components: [
            "Potentiometer 10 kilohm",
            "DC Motor 5V",
            "Transistor",
            "LED (Yellow)",
            "LED (Red)"
        ]
    }
];
function seedDatabase() {
    // Initialize the database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeDatabase"])();
    // Check if already seeded
    const existingComponents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllComponents"])();
    if (existingComponents.length > 0) {
        console.log('Database already seeded');
        return;
    }
    // Add all components
    for (const component of components){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addComponent"])(component);
    }
    // Add all scenarios and their component mappings
    for (const scenario of scenarios){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addScenario"])({
            id: scenario.id,
            title: scenario.title,
            situation: scenario.situation,
            what_to_build: scenario.what_to_build,
            team_number: scenario.team_number
        });
        // Find component IDs for this scenario
        const componentIds = scenario.components.map((name)=>components.find((c)=>c.name === name)?.id).filter((id)=>id !== undefined);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setScenarioComponents"])(scenario.id, componentIds);
    }
    console.log('Database seeded successfully');
}
}),
"[project]/app/api/participants/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-data.ts [app-route] (ecmascript)");
;
;
;
function ensureInitialized() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInitialized"])()) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initializeDatabase"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["seedDatabase"])();
    }
}
async function GET(request, { params }) {
    try {
        ensureInitialized();
        const { id } = await params;
        const participant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getParticipant"])(id);
        if (!participant) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Participant not found'
            }, {
                status: 404
            });
        }
        // Get scenario details if assigned
        let scenario = null;
        let components = [];
        if (participant.scenario_id) {
            scenario = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getScenario"])(participant.scenario_id);
            const scenarioComps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getScenarioComponents"])(participant.scenario_id);
            const unlockedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnlockedSnippets"])(id).map((s)=>s.component_id);
            components = scenarioComps.map((c)=>({
                    ...c,
                    is_unlocked: unlockedIds.includes(c.id)
                }));
        }
        // Get unlocked snippets and violations
        const unlockedSnippets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnlockedSnippets"])(id);
        const violations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getViolations"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            participant: {
                ...participant,
                scenario_title: scenario?.title,
                situation: scenario?.situation,
                what_to_build: scenario?.what_to_build,
                snippets_unlocked: unlockedSnippets.length,
                violation_count: violations.length
            },
            components,
            unlockedSnippets
        });
    } catch (error) {
        console.error('Error fetching participant:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch participant'
        }, {
            status: 500
        });
    }
}
async function PATCH(request, { params }) {
    try {
        ensureInitialized();
        const { id } = await params;
        const body = await request.json();
        const participant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getParticipant"])(id);
        if (!participant) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Participant not found'
            }, {
                status: 404
            });
        }
        // Handle different update actions
        if (body.action === 'assign_scenario') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assignScenario"])(id, body.scenarioId);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(id, 'scenario_assigned', `Assigned scenario ID: ${body.scenarioId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'start_timer') {
            const duration = body.duration || 3600;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startTimer"])(id, duration);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'lock') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lockParticipant"])(id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'complete_round2') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateParticipant"])(id, {
                round2_completed: true,
                round2_completed_at: new Date().toISOString(),
                is_locked: 1,
                is_active: 0
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(id, 'round2_completed', 'Round 2 session ended');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'unlock') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unlockParticipant"])(id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'reset') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateParticipant"])(id, {
                timer_started_at: null,
                is_active: 0,
                is_locked: 0
            });
            // Note: In-memory store doesn't support deleting related records in reset
            // This would need additional cleanup functions
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(id, 'reset', 'Participant session reset');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'log_violation') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logViolation"])(id, body.violationType, body.details, {
                severity: body.severity,
                app_name: body.appName
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'log_activity') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(id, body.eventType, body.details);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        if (body.action === 'assign_round') {
            const round = body.assigned_round === 'null' ? null : body.assigned_round;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateParticipant"])(id, {
                assigned_round: round
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(id, 'round_assigned', `Assigned to: ${round || 'unassigned'}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Error updating participant:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update participant'
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        ensureInitialized();
        const { id } = await params;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteParticipant"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Error deleting participant:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete participant'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03h6mee._.js.map