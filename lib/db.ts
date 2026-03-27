// In-memory database store for IoT Laboratory
// Data persists during server runtime
import { evaluateConnections, mapAnswerToEdges } from '@/lib/connection-evaluator';
import { evaluateSnippetAnswer, parseRequiredKeywords } from '@/lib/snippet-evaluator';

export interface Participant {
  id: string;
  name: string;
  member1_name?: string;
  member1_phone?: string;
  member1_email?: string;
  member1_college?: string;
  member1_department?: string;
  member1_year?: string;
  member2_name?: string;
  member2_phone?: string;
  member2_email?: string;
  member2_college?: string;
  member2_department?: string;
  member2_year?: string;
  member3_name?: string;
  member3_phone?: string;
  member3_email?: string;
  member3_college?: string;
  member3_department?: string;
  member3_year?: string;
  team_name?: string;
  college?: string;
  department?: string;
  phone?: string;
  email?: string;
  year?: string;
  assigned_round: 'round1' | 'round2' | null;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  created_at: string;
  snippets_unlocked?: number;
  violation_count?: number;
  scenario_title?: string;
  round1_score?: number;
  round1_completed?: boolean;
  round1_completed_at?: string;
  round1_answered?: number;
  round1_total_questions?: number;
  round1_unlocked_section?: number;
  round2_score?: number;
  round2_completed?: boolean;
  round2_completed_at?: string;
  round2_hint_count?: number;
  round2_hint_penalty?: number;
}

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  what_to_build: string;
  team_number: number | null;
}

export interface Component {
  id: number;
  name: string;
  description: string;
  pinout: string;
  category: string;
  quantity: number;
  code_snippet: string;
  setup_instructions?: string;
  default_pins?: Record<string, number>;
  connection_diagram?: string;
  warnings?: string[];
  required_libraries?: string[];
  estimated_setup_time?: number;
  complexity_level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SnippetUnlock {
  id: number;
  participant_id: string;
  component_id: number;
  unlocked_at: string;
  component_name?: string;
}

export interface ActivityLog {
  id: number;
  participant_id: string;
  event_type: string;
  details: string | null;
  created_at: string;
}

export interface Violation {
  id: number;
  participant_id: string;
  violation_type: string;
  severity?: 'permitted' | 'warning' | 'critical';
  details: string | null;
  app_name?: string;
  is_approved?: boolean;
  created_at: string;
}

export interface PasswordChange {
  id: number;
  old_password: string;
  new_password: string;
  changed_at: string;
  changed_by?: string;
}

// Round 1 Question Types
export type QuestionType = 'mcq' | 'multi-select' | 'matching' | 'component-matching' | 'logic' | 'simulation' | 'scenario-mcq' | 'connection-evaluation' | 'snippet-coding';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Round1Question {
  id: number;
  type: QuestionType;
  title: string;
  scenario: string;
  section: 'A' | 'B' | 'C' | 'D';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  timeLimit: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  matchingPairs?: MatchingPair[];
  scenario_group?: string;
  codeSnippet?: string;
  sourceNodes?: string[];
  targetNodes?: string[];
  imageUrl?: string;
  expectedConnections?: Array<{
    from: string;
    to: string;
  }>;
  explanation?: string;
  created_at: string;
}

export interface Round1Response {
  id: number;
  participant_id: string;
  question_id: number;
  answer: string | string[];
  is_correct: boolean;
  score_obtained: number;
  time_taken: number;
  answered_at: string;
}

export interface Round1ResponseReviewItem {
  question_id: number;
  title: string;
  scenario: string;
  section: 'A' | 'B' | 'C' | 'D';
  type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  answer?: string | string[];
  correct_answer?: string | string[];
  is_correct: boolean;
  score_obtained: number;
  answered_at?: string;
}

export interface Round1Result {
  id: number;
  participant_id: string;
  total_score: number;
  section_scores: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  total_questions: number;
  correct_answers: number;
  completion_status: 'pending' | 'in-progress' | 'completed';
  started_at: string;
  completed_at?: string;
  tab_switches: number;
  violations: number;
}

export interface Round1Session {
  participant_id: string;
  question_ids: number[];
  started_at: string;
  expires_at: string;
  submitted: boolean;
}

export interface Round2ComponentPenalty {
  componentId: number;
  componentName: string;
  penalty: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Round2HintSummary {
  baseScore: number;
  maxPenalty: number;
  totalPenalty: number;
  finalScore: number;
  hintsUsedCount: number;
  totalComponents: number;
  components: Round2ComponentPenalty[];
}

// In-memory data store
interface DataStore {
  participants: Map<string, Participant>;
  scenarios: Map<number, Scenario>;
  components: Map<number, Component>;
  scenarioComponents: Map<number, number[]>;
  snippetUnlocks: SnippetUnlock[];
  activityLogs: ActivityLog[];
  violations: Violation[];
  initialized: boolean;
  admin_password: string;
  password_history: PasswordChange[];
  global_timer_duration: number;
  whitelisted_apps: Set<string>;
  round1Questions: Map<number, Round1Question>;
  round1Responses: Round1Response[];
  round1Results: Map<string, Round1Result>;
  round1Sessions: Map<string, Round1Session>;
  round1SectionAccess: Map<string, number>;
  leaderboard_public_enabled: boolean;
}

// Global store that persists during server runtime
declare global {
  // eslint-disable-next-line no-var
  var __iotStore: DataStore | undefined;
  // eslint-disable-next-line no-var
  var __iotStoreLoaded: boolean;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

function getStore(): DataStore {
  if (!global.__iotStore) {
    global.__iotStore = {
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
      global_timer_duration: 5400, // 90 minutes in seconds
      whitelisted_apps: new Set(["Arduino IDE", "Visual Studio Code", "Notepad++", "Code::Blocks"]),
      round1Questions: new Map(),
      round1Responses: [],
      round1Results: new Map(),
      round1Sessions: new Map(),
      round1SectionAccess: new Map(),
      leaderboard_public_enabled: false,
    };
    
    // Auto-load persisted data on first access
    if (!global.__iotStoreLoaded && !IS_TEST_ENV) {
      loadPersistedData();
      global.__iotStoreLoaded = true;
    }
  }
  
  // Ensure all required fields exist (safety check)
  if (!global.__iotStore.admin_password) {
    global.__iotStore.admin_password = "admin123";
  }
  if (!global.__iotStore.password_history) {
    global.__iotStore.password_history = [];
  }
  if (!global.__iotStore.global_timer_duration) {
    global.__iotStore.global_timer_duration = 5400;
  }
  if (!global.__iotStore.whitelisted_apps) {
    global.__iotStore.whitelisted_apps = new Set(["Arduino IDE", "Visual Studio Code", "Notepad++", "Code::Blocks"]);
  }
  if (!global.__iotStore.round1Questions) {
    global.__iotStore.round1Questions = new Map();
  }
  if (!global.__iotStore.round1Responses) {
    global.__iotStore.round1Responses = [];
  }
  if (!global.__iotStore.round1Results) {
    global.__iotStore.round1Results = new Map();
  }
  if (!global.__iotStore.round1Sessions) {
    global.__iotStore.round1Sessions = new Map();
  }
  if (!global.__iotStore.round1SectionAccess) {
    global.__iotStore.round1SectionAccess = new Map();
  }
  if (global.__iotStore.leaderboard_public_enabled === undefined) {
    global.__iotStore.leaderboard_public_enabled = false;
  }

  return global.__iotStore;
}

// Persistence functions  
function loadPersistedData(): void {
  if (IS_TEST_ENV) {
    return;
  }
  try {
    const { resolve } = require('path');
    const dataDir = resolve(process.cwd(), '.data');
    const persistenceFile = resolve(dataDir, 'store.json');
    
    const fs = require('fs');
    if (fs.existsSync(persistenceFile)) {
      const data = fs.readFileSync(persistenceFile, 'utf-8');
      const parsed = JSON.parse(data);
      const store = global.__iotStore!;
      
      if (parsed.participants && Array.isArray(parsed.participants)) {
        store.participants = new Map(parsed.participants);
      }
      if (parsed.scenarios && Array.isArray(parsed.scenarios)) {
        store.scenarios = new Map(parsed.scenarios);
      }
      if (parsed.components && Array.isArray(parsed.components)) {
        store.components = new Map(parsed.components);
      }
      if (parsed.scenarioComponents && Array.isArray(parsed.scenarioComponents)) {
        store.scenarioComponents = new Map(parsed.scenarioComponents);
      }
      if (parsed.round1Questions && Array.isArray(parsed.round1Questions)) {
        store.round1Questions = new Map(parsed.round1Questions);
        // Migration: enforce correct scoring rules on load
        store.round1Questions.forEach((q, id) => {
          let correctScore: number;
          if (q.section === 'D' && q.matchingPairs) {
            correctScore = q.matchingPairs.length;
          } else if (q.section === 'A' || q.section === 'B' || q.section === 'C') {
            correctScore = 1;
          } else {
            return;
          }
          if (q.score !== correctScore) {
            store.round1Questions.set(id, { ...q, score: correctScore });
          }
        });
      }
      if (parsed.round1Results && Array.isArray(parsed.round1Results)) {
        store.round1Results = new Map(parsed.round1Results);
      }
      if (parsed.round1Sessions && Array.isArray(parsed.round1Sessions)) {
        store.round1Sessions = new Map(parsed.round1Sessions);
      }
      if (parsed.round1SectionAccess && Array.isArray(parsed.round1SectionAccess)) {
        store.round1SectionAccess = new Map(parsed.round1SectionAccess);
      }
      if (parsed.snippetUnlocks) store.snippetUnlocks = parsed.snippetUnlocks;
      if (parsed.activityLogs) store.activityLogs = parsed.activityLogs;
      if (parsed.violations) store.violations = parsed.violations;
      if (parsed.password_history) store.password_history = parsed.password_history;
      if (parsed.round1Responses) store.round1Responses = parsed.round1Responses;
      if (parsed.initialized !== undefined) store.initialized = parsed.initialized;
      if (parsed.admin_password) store.admin_password = parsed.admin_password;
      if (parsed.global_timer_duration !== undefined) store.global_timer_duration = parsed.global_timer_duration;
      if (parsed.whitelisted_apps && Array.isArray(parsed.whitelisted_apps)) {
        store.whitelisted_apps = new Set(parsed.whitelisted_apps);
      }
      if (parsed.leaderboard_public_enabled !== undefined) {
        store.leaderboard_public_enabled = Boolean(parsed.leaderboard_public_enabled);
      }
    }
  } catch (error) {
    // Silently fail on first run
  }
}

function persistStore(): void {
  if (IS_TEST_ENV) {
    return;
  }
  try {
    const { resolve } = require('path');
    const store = getStore();
    const dataDir = resolve(process.cwd(), '.data');
    const fs = require('fs');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const persistenceFile = resolve(dataDir, 'store.json');
    const data = {
      participants: Array.from(store.participants.entries()),
      scenarios: Array.from(store.scenarios.entries()),
      components: Array.from(store.components.entries()),
      scenarioComponents: Array.from(store.scenarioComponents.entries()),
      snippetUnlocks: store.snippetUnlocks,
      activityLogs: store.activityLogs,
      violations: store.violations,
      initialized: store.initialized,
      admin_password: store.admin_password,
      password_history: store.password_history,
      global_timer_duration: store.global_timer_duration,
      whitelisted_apps: Array.from(store.whitelisted_apps),
      round1Questions: Array.from(store.round1Questions.entries()),
      round1Responses: store.round1Responses,
      round1Results: Array.from(store.round1Results.entries()),
      round1Sessions: Array.from(store.round1Sessions.entries()),
      round1SectionAccess: Array.from(store.round1SectionAccess.entries()),
      leaderboard_public_enabled: store.leaderboard_public_enabled,
    };
    
    fs.writeFileSync(persistenceFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Silently fail
  }
}

const ROUND2_BASE_SCORE = 100;
const ROUND2_MAX_HINT_PENALTY = 30;
const ROUND2_CANONICAL_TEAMS = new Set([1, 2, 3, 4, 5, 6, 7, 8]);

function isCanonicalRound2Scenario(scenario: Scenario | undefined): scenario is Scenario {
  if (!scenario) {
    return false;
  }
  return typeof scenario.team_number === 'number' && ROUND2_CANONICAL_TEAMS.has(scenario.team_number);
}

function getRound2ScenarioContext(participantId: string): { scenario: Scenario; componentIds: number[] } {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (!participant) {
    throw new Error('Participant not found');
  }
  if (!participant.scenario_id) {
    throw new Error('Scenario not assigned');
  }

  const scenario = store.scenarios.get(participant.scenario_id);
  if (!isCanonicalRound2Scenario(scenario)) {
    throw new Error('Scenario not found');
  }

  const componentIds = store.scenarioComponents.get(scenario.id) || [];
  if (componentIds.length === 0) {
    throw new Error('Scenario has no components');
  }

  return { scenario, componentIds };
}

function getComponentPenaltyMap(componentIds: number[]): Map<number, number> {
  const sorted = [...componentIds].sort((a, b) => a - b);
  const count = sorted.length;
  const penaltyMap = new Map<number, number>();
  if (count === 0) {
    return penaltyMap;
  }

  const even = Math.floor(ROUND2_MAX_HINT_PENALTY / count);
  const remainder = ROUND2_MAX_HINT_PENALTY - even * count;

  sorted.forEach((componentId, index) => {
    penaltyMap.set(componentId, even + (index < remainder ? 1 : 0));
  });
  return penaltyMap;
}

export function getRound2HintSummary(participantId: string): Round2HintSummary {
  const store = getStore();
  const { scenario, componentIds } = getRound2ScenarioContext(participantId);
  const penaltyMap = getComponentPenaltyMap(componentIds);
  const unlocks = store.snippetUnlocks.filter(
    (unlock) => unlock.participant_id === participantId && componentIds.includes(unlock.component_id)
  );
  const unlockedByComponent = new Map<number, SnippetUnlock>();
  unlocks.forEach((unlock) => {
    if (!unlockedByComponent.has(unlock.component_id)) {
      unlockedByComponent.set(unlock.component_id, unlock);
    }
  });

  const components: Round2ComponentPenalty[] = [...componentIds]
    .sort((a, b) => a - b)
    .map((componentId) => {
      const component = store.components.get(componentId);
      const unlocked = unlockedByComponent.get(componentId);
      return {
        componentId,
        componentName: component?.name || `Component ${componentId}`,
        penalty: penaltyMap.get(componentId) || 0,
        unlocked: Boolean(unlocked),
        unlockedAt: unlocked?.unlocked_at,
      };
    });

  const totalPenalty = components
    .filter((component) => component.unlocked)
    .reduce((sum, component) => sum + component.penalty, 0);
  const boundedPenalty = Math.min(ROUND2_MAX_HINT_PENALTY, totalPenalty);
  const finalScore = Math.max(0, ROUND2_BASE_SCORE - boundedPenalty);

  return {
    baseScore: ROUND2_BASE_SCORE,
    maxPenalty: ROUND2_MAX_HINT_PENALTY,
    totalPenalty: boundedPenalty,
    finalScore,
    hintsUsedCount: components.filter((component) => component.unlocked).length,
    totalComponents: components.length,
    components,
  };
}

export function isInitialized(): boolean {
  return getStore().initialized;
}

export function initializeDatabase(): void {
  const store = getStore();
  if (!store.initialized) {
    store.initialized = true;
  }
}

// Participant functions
export function getParticipant(id: string): Participant | undefined {
  return getStore().participants.get(id);
}

export function getAllParticipants(): Participant[] {
  const store = getStore();
  return Array.from(store.participants.values()).map(p => {
    const scenario = p.scenario_id ? store.scenarios.get(p.scenario_id) : null;
    const snippetsUnlocked = store.snippetUnlocks.filter(s => s.participant_id === p.id).length;
    const violationCount = store.violations.filter(v => v.participant_id === p.id).length;
    const round1Answered = store.round1Responses.filter(r => r.participant_id === p.id).length;
    const round1Session = store.round1Sessions.get(p.id);
    const round1Result = store.round1Results.get(p.id);
    const round1TotalQuestions = round1Result?.total_questions || round1Session?.question_ids.length || 0;
    const round1UnlockedSection = store.round1SectionAccess.get(p.id) ?? 0;

    let round2HintCount = 0;
    let round2HintPenalty = 0;
    if (p.scenario_id) {
      try {
        const summary = getRound2HintSummary(p.id);
        round2HintCount = summary.hintsUsedCount;
        round2HintPenalty = summary.totalPenalty;
      } catch {
        round2HintPenalty = 0;
      }
    }

    return {
      ...p,
      team_name: p.team_name,
      scenario_title: scenario?.title,
      snippets_unlocked: snippetsUnlocked,
      violation_count: violationCount,
      round1_answered: round1Answered,
      round1_total_questions: round1TotalQuestions,
      round1_unlocked_section: round1UnlockedSection,
      round2_hint_count: round2HintCount,
      round2_hint_penalty: round2HintPenalty,
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createParticipant(
  name: string,
  id: string,
  teamName?: string,
  assignedRound?: 'round1' | 'round2',
  phone?: string,
  email?: string,
  year?: string,
  college?: string,
  department?: string,
  member2Name?: string,
  member3Name?: string,
  member2Phone?: string,
  member2Email?: string,
  member2Year?: string,
  member2College?: string,
  member2Department?: string,
  member3Phone?: string,
  member3Email?: string,
  member3Year?: string,
  member3College?: string,
  member3Department?: string
): Participant {
  const store = getStore();
  const participant: Participant = {
    id,
    name,
    member1_name: name,
    member1_phone: phone,
    member1_email: email,
    member1_college: college,
    member1_department: department,
    member1_year: year,
    member2_name: member2Name,
    member2_phone: member2Phone,
    member2_email: member2Email,
    member2_college: member2College,
    member2_department: member2Department,
    member2_year: member2Year,
    member3_name: member3Name,
    member3_phone: member3Phone,
    member3_email: member3Email,
    member3_college: member3College,
    member3_department: member3Department,
    member3_year: member3Year,
    team_name: teamName,
    college,
    department,
    phone,
    email,
    year,
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
    round2_completed: false,
  };
  store.participants.set(id, participant);
    persistStore();
  return participant;
}

export function assignScenario(participantId: string, scenarioId: number): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.scenario_id = scenarioId;
    store.participants.set(participantId, participant);
    persistStore();
  }
}

export function startTimer(participantId: string, duration: number = 3600): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.timer_started_at = new Date().toISOString();
    participant.timer_duration = duration;
    participant.is_active = 1;
    store.participants.set(participantId, participant);
    logActivity(participantId, 'timer_start', `Timer started: ${duration} seconds`);
    persistStore();
  }
}

export function lockParticipant(participantId: string): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.is_locked = 1;
    participant.is_active = 0;
    store.participants.set(participantId, participant);
    logActivity(participantId, 'locked', 'Dashboard locked - time expired');
    persistStore();
  }
}

export function unlockParticipant(participantId: string): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.is_locked = 0;
    store.participants.set(participantId, participant);
    logActivity(participantId, 'unlocked', 'Dashboard unlocked by admin');
    persistStore();
  }
}

export function updateParticipant(participantId: string, updates: Partial<Participant>): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    Object.assign(participant, updates);
    store.participants.set(participantId, participant);
      persistStore();
  }
}

export function deleteParticipant(participantId: string): void {
  const store = getStore();
  store.participants.delete(participantId);
  store.snippetUnlocks = store.snippetUnlocks.filter(s => s.participant_id !== participantId);
  store.activityLogs = store.activityLogs.filter(a => a.participant_id !== participantId);
  store.violations = store.violations.filter(v => v.participant_id !== participantId);
    persistStore();
}

// Scenario functions
export function getScenario(id: number): Scenario | undefined {
  const scenario = getStore().scenarios.get(id);
  return isCanonicalRound2Scenario(scenario) ? scenario : undefined;
}

export function getAllScenarios(): Scenario[] {
  return Array.from(getStore().scenarios.values())
    .filter((scenario) => isCanonicalRound2Scenario(scenario))
    .sort((a, b) => (a.team_number || 0) - (b.team_number || 0));
}

export function addScenario(scenario: Scenario): void {
  getStore().scenarios.set(scenario.id, scenario);
  persistStore();
}

export function setScenarioComponents(scenarioId: number, componentIds: number[]): void {
  getStore().scenarioComponents.set(scenarioId, componentIds);
  persistStore();
}

// Component functions
export function getComponent(id: number): Component | undefined {
  const component = getStore().components.get(id);
  if (!component) return undefined;

  // Import and merge with documentation if available
  try {
    // Dynamically import component docs
    const { getComponentDocumentation } = require('./component-docs');
    const docs = getComponentDocumentation(id);
    if (docs) {
      return { ...component, ...docs };
    }
  } catch (e) {
    // If component-docs not available, return basic component
  }

  return component;
}

export function getAllComponents(): Component[] {
  const components = Array.from(getStore().components.values()).sort(
    (a, b) => a.id - b.id
  );

  // Try to merge with documentation
  try {
    const { getComponentDocumentation } = require('./component-docs');
    return components.map((comp) => {
      const docs = getComponentDocumentation(comp.id);
      return docs ? { ...comp, ...docs } : comp;
    });
  } catch (e) {
    // If component-docs not available, return components as-is
    return components;
  }
}

export function addComponent(component: Component): void {
  getStore().components.set(component.id, component);
  persistStore();
}

export function getScenarioComponents(scenarioId: number): Component[] {
  const store = getStore();
  const componentIds = store.scenarioComponents.get(scenarioId) || [];
  return componentIds.map((id) => getComponent(id)).filter(Boolean) as Component[];
}

// Snippet unlock functions
export function getUnlockedSnippets(participantId: string): SnippetUnlock[] {
  const store = getStore();
  return store.snippetUnlocks
    .filter(s => s.participant_id === participantId)
    .map(s => {
      const component = store.components.get(s.component_id);
      return {
        ...s,
        component_name: component?.name,
      };
    })
    .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime());
}

export function unlockSnippet(participantId: string, componentId: number): { success: boolean; message?: string } {
  const store = getStore();
  
  // Check if already unlocked
  const existing = store.snippetUnlocks.find(
    s => s.participant_id === participantId && s.component_id === componentId
  );
  
  if (existing) {
    return { success: false, message: 'Already unlocked' };
  }
  
  const unlock: SnippetUnlock = {
    id: store.snippetUnlocks.length + 1,
    participant_id: participantId,
    component_id: componentId,
    unlocked_at: new Date().toISOString(),
  };
  
  store.snippetUnlocks.push(unlock);
  try {
    const summary = getRound2HintSummary(participantId);
    const componentPenalty = summary.components.find((c) => c.componentId === componentId)?.penalty || 0;
    logActivity(
      participantId,
      'snippet_unlock',
      `Unlocked component ID: ${componentId}; penalty +${componentPenalty}; total penalty ${summary.totalPenalty}/${summary.maxPenalty}; score ${summary.finalScore}`
    );
  } catch {
    logActivity(participantId, 'snippet_unlock', `Unlocked component ID: ${componentId}`);
  }
  persistStore();
  
  return { success: true };
}

// Activity log functions
export function logActivity(participantId: string, eventType: string, details?: string): void {
  const store = getStore();
  const log: ActivityLog = {
    id: store.activityLogs.length + 1,
    participant_id: participantId,
    event_type: eventType,
    details: details || null,
    created_at: new Date().toISOString(),
  };
  store.activityLogs.push(log);
  persistStore();
}

export function getActivityLogs(participantId?: string): ActivityLog[] {
  const store = getStore();
  let logs = store.activityLogs;
  if (participantId) {
    logs = logs.filter(l => l.participant_id === participantId);
  }
  return logs
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 200);
}

// Violation functions
export function logViolation(
  participantId: string,
  violationType: string,
  details?: string,
  options?: {
    severity?: 'permitted' | 'warning' | 'critical';
    app_name?: string;
    is_approved?: boolean;
  }
): void {
  const store = getStore();
  
  // Determine severity based on violation type and context
  let severity: 'permitted' | 'warning' | 'critical' = options?.severity || 'warning';
  
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

  const violation: Violation = {
    id: store.violations.length + 1,
    participant_id: participantId,
    violation_type: violationType,
    severity,
    details: details || null,
    app_name: options?.app_name,
    is_approved: options?.is_approved || (severity === 'permitted'),
    created_at: new Date().toISOString(),
  };
  
  store.violations.push(violation);
  logActivity(participantId, 'violation', `${violationType}${options?.app_name ? ` (${options.app_name})` : ''}: ${details || ''}`);
  persistStore();
}

export function getViolations(participantId?: string): Violation[] {
  const store = getStore();
  let violations = store.violations;
  if (participantId) {
    violations = violations.filter(v => v.participant_id === participantId);
  }
  return violations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 100);
}

// Statistics
export function getStats() {
  const store = getStore();
  const participants = Array.from(store.participants.values());
  return {
    totalParticipants: participants.length,
    activeParticipants: participants.filter(p => p.is_active === 1).length,
    lockedParticipants: participants.filter(p => p.is_locked === 1).length,
    totalComponents: store.components.size,
    totalScenarios: getAllScenarios().length,
    totalViolations: store.violations.length,
    totalSnippetUnlocks: store.snippetUnlocks.length,
  };
}

// Password management functions
export function verifyAdminPassword(password: string): boolean {
  const store = getStore();
  return password === store.admin_password;
}

export function changeAdminPassword(currentPassword: string, newPassword: string): boolean {
  const store = getStore();
  if (currentPassword !== store.admin_password) {
    return false;
  }
  
  // Add to history (keep last 5)
  store.password_history.push({
    id: store.password_history.length + 1,
    old_password: store.admin_password,
    new_password: newPassword,
    changed_at: new Date().toISOString(),
  });
  
  if (store.password_history.length > 5) {
    store.password_history.shift();
  }
  
  store.admin_password = newPassword;
  return true;
}

export function getPasswordHistory(): PasswordChange[] {
  return getStore().password_history;
}

// Timer management functions
export function setGlobalTimerDuration(duration: number): void {
  getStore().global_timer_duration = duration;
}

export function getGlobalTimerDuration(): number {
  return getStore().global_timer_duration;
}

// Whitelist management functions
export function getWhitelistedApps(): string[] {
  return Array.from(getStore().whitelisted_apps);
}

export function addWhitelistedApp(appName: string): void {
  getStore().whitelisted_apps.add(appName);
}

export function removeWhitelistedApp(appName: string): void {
  getStore().whitelisted_apps.delete(appName);
}

export function isAppWhitelisted(appName: string): boolean {
  return getStore().whitelisted_apps.has(appName);
}

// Round 1 Question Management
export function createRound1Question(question: Omit<Round1Question, 'id' | 'created_at'>): Round1Question {
  const store = getStore();
  const id = Math.max(...Array.from(store.round1Questions.keys()), 0) + 1;
  const newQuestion: Round1Question = {
    ...question,
    id,
    created_at: new Date().toISOString(),
  };
  store.round1Questions.set(id, newQuestion);
  persistStore();
  return newQuestion;
}

export function clearRound1Questions(): void {
  const store = getStore();
  store.round1Questions.clear();
  store.round1Responses = [];
  store.round1Results.clear();
  store.round1Sessions.clear();
  store.round1SectionAccess.clear();
  persistStore();
}

export function getRound1Questions(section?: string): Round1Question[] {
  const store = getStore();
  const questions = Array.from(store.round1Questions.values());
  if (section) {
    return questions.filter(q => q.section === section);
  }
  return questions;
}

export function getRound1Question(id: number): Round1Question | undefined {
  return getStore().round1Questions.get(id);
}

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function questionOrderByTitle(a: Round1Question, b: Round1Question): number {
  const numA = Number((a.title.match(/Q(\d+)$/i) || [])[1] || 0);
  const numB = Number((b.title.match(/Q(\d+)$/i) || [])[1] || 0);
  return numA - numB;
}

export function startOrGetRound1Session(participantId: string, perParticipantQuestionCount = 12): Round1Session {
  const store = getStore();
  const existing = store.round1Sessions.get(participantId);
  if (existing) {
    const assignedQuestions = existing.question_ids
      .map((id) => store.round1Questions.get(id))
      .filter(Boolean) as Round1Question[];
    const assignedValidCount = assignedQuestions.length;
    const hasSectionDQuestions = assignedQuestions.some((q) => q.section === 'D');
    const isUsableSession =
      !existing.submitted &&
      existing.question_ids.length > 0 &&
      assignedValidCount === existing.question_ids.length &&
      hasSectionDQuestions;

    if (isUsableSession) {
      if (!store.round1SectionAccess.has(participantId)) {
        store.round1SectionAccess.set(participantId, 0);
      }
      return existing;
    }

    // Recover from stale/empty sessions created before the curated pool fix.
    store.round1Sessions.delete(participantId);
  }

  const all = Array.from(store.round1Questions.values());

  // Required structure:
  // Section A: 20 MCQ (10 Easy + 10 Hard)
  // Section B: 2 scenario groups x 10 questions each = 20 total
  // Section C: 20 image-based circuit MCQs (2 circuits x 10)
  // Section D: 6 interactive challenge questions
  const easyMcq = shuffled(all.filter((q) => q.type === 'mcq' && q.difficulty === 'Easy'));
  const hardMcq = shuffled(all.filter((q) => q.type === 'mcq' && q.difficulty === 'Hard'));
  const selectedMcq = shuffled([...easyMcq.slice(0, 10), ...hardMcq.slice(0, 10)]);

  if (selectedMcq.length < 20) {
    const selectedIds = new Set(selectedMcq.map((q) => q.id));
    const fallbackMcq = shuffled(
      all.filter((q) => q.type === 'mcq' && !selectedIds.has(q.id))
    ).slice(0, 20 - selectedMcq.length);
    selectedMcq.push(...fallbackMcq);
  }

  const scenarioQuestions = all.filter((q) => q.section === 'B' && Boolean(q.scenario_group));
  const groupedScenarios = new Map<string, Round1Question[]>();
  scenarioQuestions.forEach((q) => {
    const key = q.scenario_group as string;
    if (!groupedScenarios.has(key)) {
      groupedScenarios.set(key, []);
    }
    groupedScenarios.get(key)!.push(q);
  });

  const selectedScenarioGroups = shuffled(Array.from(groupedScenarios.keys())).slice(0, 2);
  const selectedScenarioQuestions: Round1Question[] = [];
  selectedScenarioGroups.forEach((groupId) => {
    selectedScenarioQuestions.push(...(groupedScenarios.get(groupId) || []).sort(questionOrderByTitle));
  });

  if (selectedScenarioQuestions.length < 20) {
    const selectedIds = new Set(selectedScenarioQuestions.map((q) => q.id));
    const fallbackScenario = shuffled(
      scenarioQuestions.filter((q) => !selectedIds.has(q.id))
    ).slice(0, 20 - selectedScenarioQuestions.length);
    selectedScenarioQuestions.push(...fallbackScenario);
  }

  const circuitQuestions = all.filter((q) => q.section === 'C' && Boolean(q.scenario_group));
  const groupedCircuits = new Map<string, Round1Question[]>();
  circuitQuestions.forEach((q) => {
    const key = q.scenario_group as string;
    if (!groupedCircuits.has(key)) {
      groupedCircuits.set(key, []);
    }
    groupedCircuits.get(key)!.push(q);
  });

  const selectedCircuitGroups = shuffled(Array.from(groupedCircuits.keys())).slice(0, 2);
  const selectedCircuitQuestions: Round1Question[] = [];
  selectedCircuitGroups.forEach((groupId) => {
    selectedCircuitQuestions.push(...(groupedCircuits.get(groupId) || []).sort(questionOrderByTitle).slice(0, 10));
  });

  if (selectedCircuitQuestions.length < 20) {
    const selectedIds = new Set(selectedCircuitQuestions.map((q) => q.id));
    const fallbackCircuit = shuffled(
      circuitQuestions.filter((q) => !selectedIds.has(q.id))
    ).slice(0, 20 - selectedCircuitQuestions.length);
    selectedCircuitQuestions.push(...fallbackCircuit);
  }

  const sectionDQuestions = shuffled(
    all.filter((q) => q.section === 'D')
  ).slice(0, 6);

  const questions = [
    ...selectedMcq.slice(0, 20),
    ...selectedScenarioQuestions.slice(0, 20),
    ...selectedCircuitQuestions.slice(0, 20),
    ...sectionDQuestions,
  ];

  if (questions.length === 0) {
    const fallbackCount = Math.min(
      perParticipantQuestionCount > 0 ? perParticipantQuestionCount : 66,
      all.length
    );
    const fallback = shuffled(all).slice(0, fallbackCount);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

    const session: Round1Session = {
      participant_id: participantId,
      question_ids: fallback.map((q) => q.id),
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      submitted: false,
    };
    store.round1Sessions.set(participantId, session);
    if (!store.round1SectionAccess.has(participantId)) {
      store.round1SectionAccess.set(participantId, 0);
    }
    logActivity(participantId, 'round1_started', `Round 1 started with ${session.question_ids.length} questions`);
    return session;
  }

  const requestedCount = Math.min(
    perParticipantQuestionCount > 0 ? perParticipantQuestionCount : 66,
    questions.length
  );
  const finalQuestions = questions.slice(0, requestedCount);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

  const session: Round1Session = {
    participant_id: participantId,
    question_ids: finalQuestions.map((q) => q.id),
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    submitted: false,
  };
  store.round1Sessions.set(participantId, session);
  if (!store.round1SectionAccess.has(participantId)) {
    store.round1SectionAccess.set(participantId, 0);
  }
  logActivity(participantId, "round1_started", `Round 1 started with ${session.question_ids.length} questions`);
  return session;
}

export function getRound1UnlockedSection(participantId: string): number {
  const store = getStore();
  const value = store.round1SectionAccess.get(participantId);
  if (typeof value !== 'number') {
    store.round1SectionAccess.set(participantId, 0);
    return 0;
  }
  return Math.max(0, Math.min(3, value));
}

export function setRound1UnlockedSection(participantId: string, sectionIndex: number): number {
  const store = getStore();
  const next = Math.max(0, Math.min(3, sectionIndex));
  store.round1SectionAccess.set(participantId, next);
  logActivity(participantId, 'round1_section_override', `Round 1 section set to ${next}`);
  return next;
}

export function advanceRound1Section(participantId: string): number {
  const current = getRound1UnlockedSection(participantId);
  const next = Math.min(3, current + 1);
  return setRound1UnlockedSection(participantId, next);
}

export function getRound1Session(participantId: string): Round1Session | undefined {
  return getStore().round1Sessions.get(participantId);
}

export function isRound1SessionExpired(participantId: string): boolean {
  const session = getStore().round1Sessions.get(participantId);
  if (!session) return false;
  return Date.now() >= new Date(session.expires_at).getTime();
}

export function getRound1AssignedQuestions(participantId: string): Round1Question[] {
  const store = getStore();
  const session = store.round1Sessions.get(participantId);
  if (!session) return [];
  return session.question_ids
    .map((id) => store.round1Questions.get(id))
    .filter(Boolean) as Round1Question[];
}

export function updateRound1Question(id: number, updates: Partial<Round1Question>): boolean {
  const store = getStore();
  const question = store.round1Questions.get(id);
  if (!question) return false;
  
  Object.assign(question, updates);
  store.round1Questions.set(id, question);
  return true;
}

export function deleteRound1Question(id: number): boolean {
  return getStore().round1Questions.delete(id);
}

// Round 1 Response Recording
export function recordRound1Response(
  participantId: string,
  questionId: number,
  answer: string | string[],
  timeTaken: number
): Round1Response {
  const store = getStore();
  const question = store.round1Questions.get(questionId);
  if (!question) throw new Error('Question not found');
  const session = store.round1Sessions.get(participantId);
  if (!session) throw new Error('Round 1 session not started');
  if (session.submitted) throw new Error('Round 1 session already submitted');
  if (!session.question_ids.includes(questionId)) throw new Error('Question not assigned to participant');
  
  let isCorrect = false;
  let scoreObtained = 0;
  
  if (question.type === 'mcq' || question.type === 'logic' || question.type === 'scenario-mcq') {
    isCorrect = answer === question.correctAnswer;
  } else if (question.type === 'multi-select') {
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    isCorrect = JSON.stringify(Array.isArray(answer) ? answer.sort() : [answer]) ===
               JSON.stringify(correctAnswers.sort());
  } else if (question.type === 'matching' || question.type === 'component-matching') {
    const parseMatchObj = (value: unknown): Record<string, string> => {
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return {}; }
      }
      if (typeof value === 'object' && value !== null) return value as Record<string, string>;
      return {};
    };
    const submittedObj = parseMatchObj(answer);
    const expectedObj = parseMatchObj(question.correctAnswer);
    const expectedKeys = Object.keys(expectedObj);
    let correctPairs = 0;
    expectedKeys.forEach((key) => {
      if (submittedObj[key] !== undefined && submittedObj[key] === expectedObj[key]) {
        correctPairs++;
      }
    });
    const totalPairs = expectedKeys.length;
    isCorrect = totalPairs > 0 && correctPairs === totalPairs;
    scoreObtained = correctPairs;
  } else if (question.type === 'simulation') {
    isCorrect = answer === question.correctAnswer;
  } else if (question.type === 'connection-evaluation') {
    try {
      const expected = question.expectedConnections || [];
      const submittedMap = typeof answer === 'string' ? JSON.parse(answer) : answer;
      const submitted = mapAnswerToEdges(submittedMap as Record<string, string>);
      const evaluation = evaluateConnections(expected, submitted);
      isCorrect = evaluation.isCorrect;
      if (!isCorrect) {
        scoreObtained = Math.round(question.score * evaluation.scoreRatio);
      }
    } catch {
      isCorrect = false;
    }
  } else if (question.type === 'snippet-coding') {
    const rawAnswer = Array.isArray(answer) ? answer.join('\n') : String(answer || '');
    const requiredTokens = parseRequiredKeywords(question.correctAnswer);
    const evaluation = evaluateSnippetAnswer(rawAnswer, requiredTokens, 0.75);
    isCorrect = evaluation.isCorrect;
    if (!isCorrect) {
      scoreObtained = Math.round(question.score * evaluation.scoreRatio);
    }
  }
  
  if (question.section === 'D') {
    // Section D (matching/component-matching): scoreObtained is already set to correctly matched pairs count (1 per pair)
  } else {
    // Sections A, B, C: 1 mark per question, all-or-nothing
    scoreObtained = isCorrect ? 1 : 0;
  }
  
  const existingIdx = store.round1Responses.findIndex(
    (r) => r.participant_id === participantId && r.question_id === questionId
  );
  const response: Round1Response = {
    id: existingIdx >= 0 ? store.round1Responses[existingIdx].id : store.round1Responses.length + 1,
    participant_id: participantId,
    question_id: questionId,
    answer,
    is_correct: isCorrect,
    score_obtained: scoreObtained,
    time_taken: timeTaken,
    answered_at: new Date().toISOString(),
  };
  if (existingIdx >= 0) {
    store.round1Responses[existingIdx] = response;
  } else {
    store.round1Responses.push(response);
  }
  logActivity(participantId, 'round1_response', `Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'} (${scoreObtained}/${question.score} points)`);
  persistStore();
  
  return response;
}

export function getRound1Responses(participantId: string): Round1Response[] {
  return getStore().round1Responses.filter(r => r.participant_id === participantId);
}

export function getRound1ResponseReview(participantId: string): Round1ResponseReviewItem[] {
  const store = getStore();
  const session = store.round1Sessions.get(participantId);
  const responses = store.round1Responses.filter((r) => r.participant_id === participantId);
  const responseMap = new Map<number, Round1Response>();
  responses.forEach((response) => {
    responseMap.set(response.question_id, response);
  });

  const assignedQuestionIds = session?.question_ids || Array.from(responseMap.keys());

  return assignedQuestionIds
    .map((questionId) => {
      const question = store.round1Questions.get(questionId);
      if (!question) {
        return null;
      }

      const response = responseMap.get(questionId);
      return {
        question_id: question.id,
        title: question.title,
        scenario: question.scenario,
        section: question.section,
        type: question.type,
        difficulty: question.difficulty,
        score: question.score,
        answer: response?.answer,
        correct_answer: question.correctAnswer,
        is_correct: response?.is_correct || false,
        score_obtained: response?.score_obtained || 0,
        answered_at: response?.answered_at,
      };
    })
    .filter((item): item is Round1ResponseReviewItem => item !== null);
}

// Round 1 Result Management
export function createRound1Result(participantId: string): Round1Result {
  const store = getStore();
  const session = store.round1Sessions.get(participantId);
  if (!session) {
    throw new Error('Round 1 session not found');
  }
  
  const responses = store.round1Responses.filter(r => r.participant_id === participantId);
  const totalScore = responses.reduce((sum, r) => sum + r.score_obtained, 0);
  
  const sectionScores = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };
  
  responses.forEach(response => {
    const question = store.round1Questions.get(response.question_id);
    if (question) {
      sectionScores[question.section] += response.score_obtained;
    }
  });
  
  const result: Round1Result = {
    id: Math.max(...Array.from(store.round1Results.keys()).map(k => parseInt(k)), 0) + 1,
    participant_id: participantId,
    total_score: totalScore,
    section_scores: sectionScores,
    total_questions: session.question_ids.length,
    correct_answers: responses.filter(r => r.is_correct).length,
    completion_status: 'completed',
    started_at: session.started_at,
    completed_at: new Date().toISOString(),
    tab_switches: 0,
    violations: 0,
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
  persistStore();
  
  return result;
}

export function getRound1Result(participantId: string): Round1Result | undefined {
  return getStore().round1Results.get(participantId);
}

export function updateParticipantAssignedRound(participantId: string, round: 'round1' | 'round2'): boolean {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (!participant) return false;
  
  participant.assigned_round = round;
  store.participants.set(participantId, participant);
  logActivity(participantId, 'round_assigned', `Assigned to ${round}`);
  persistStore();
  
  return true;
}

export function isLeaderboardPublicEnabled(): boolean {
  return getStore().leaderboard_public_enabled;
}

export function setLeaderboardPublicEnabled(enabled: boolean): void {
  const store = getStore();
  store.leaderboard_public_enabled = enabled;
  persistStore();
}

export interface LeaderboardEntry {
  rank: number;
  team_name: string;
  avg_score: number;
  members: number;
  completed_members: number;
}

export function getPublicLeaderboard(): LeaderboardEntry[] {
  const participants = getAllParticipants().filter((participant) => participant.team_name);
  const teamMap = new Map<string, Participant[]>();

  participants.forEach((participant) => {
    const key = (participant.team_name || '').trim();
    if (!key) return;
    if (!teamMap.has(key)) {
      teamMap.set(key, []);
    }
    teamMap.get(key)!.push(participant);
  });

  const rows = Array.from(teamMap.entries()).map(([teamName, members]) => {
    const completed = members.filter((member) => member.round1_completed);
    const avg = completed.length
      ? completed.reduce((sum, member) => sum + (member.round1_score || 0), 0) / completed.length
      : 0;

    return {
      team_name: teamName,
      avg_score: avg,
      members: members.length,
      completed_members: completed.length,
    };
  });

  return rows
    .sort((a, b) => b.avg_score - a.avg_score)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}
