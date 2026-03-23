// In-memory database store for IoT Laboratory
// Data persists during server runtime

export interface Participant {
  id: string;
  name: string;
  team_name?: string;
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
  round2_score?: number;
  round2_completed?: boolean;
  round2_completed_at?: string;
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
export type QuestionType = 'mcq' | 'multi-select' | 'matching' | 'component-matching' | 'logic' | 'simulation';

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
}

// Global store that persists during server runtime
declare global {
  // eslint-disable-next-line no-var
  var __iotStore: DataStore | undefined;
}

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
      global_timer_duration: 7200, // 120 minutes in seconds
      whitelisted_apps: new Set(["Arduino IDE", "Visual Studio Code", "Notepad++", "Code::Blocks"]),
      round1Questions: new Map(),
      round1Responses: [],
      round1Results: new Map(),
    };
  }
  
  // Ensure all required fields exist (safety check)
  if (!global.__iotStore.admin_password) {
    global.__iotStore.admin_password = "admin123";
  }
  if (!global.__iotStore.password_history) {
    global.__iotStore.password_history = [];
  }
  if (!global.__iotStore.global_timer_duration) {
    global.__iotStore.global_timer_duration = 7200;
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
  
  return global.__iotStore;
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
    return {
      ...p,
      team_name: p.team_name,
      scenario_title: scenario?.title,
      snippets_unlocked: snippetsUnlocked,
      violation_count: violationCount,
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createParticipant(name: string, id: string, teamName?: string, assignedRound?: 'round1' | 'round2'): Participant {
  const store = getStore();
  const participant: Participant = {
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
    round2_completed: false,
  };
  store.participants.set(id, participant);
  return participant;
}

export function assignScenario(participantId: string, scenarioId: number): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.scenario_id = scenarioId;
    store.participants.set(participantId, participant);
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
  }
}

export function unlockParticipant(participantId: string): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    participant.is_locked = 0;
    store.participants.set(participantId, participant);
    logActivity(participantId, 'unlocked', 'Dashboard unlocked by admin');
  }
}

export function updateParticipant(participantId: string, updates: Partial<Participant>): void {
  const store = getStore();
  const participant = store.participants.get(participantId);
  if (participant) {
    Object.assign(participant, updates);
    store.participants.set(participantId, participant);
  }
}

export function deleteParticipant(participantId: string): void {
  const store = getStore();
  store.participants.delete(participantId);
  store.snippetUnlocks = store.snippetUnlocks.filter(s => s.participant_id !== participantId);
  store.activityLogs = store.activityLogs.filter(a => a.participant_id !== participantId);
  store.violations = store.violations.filter(v => v.participant_id !== participantId);
}

// Scenario functions
export function getScenario(id: number): Scenario | undefined {
  return getStore().scenarios.get(id);
}

export function getAllScenarios(): Scenario[] {
  return Array.from(getStore().scenarios.values());
}

export function addScenario(scenario: Scenario): void {
  getStore().scenarios.set(scenario.id, scenario);
}

export function setScenarioComponents(scenarioId: number, componentIds: number[]): void {
  getStore().scenarioComponents.set(scenarioId, componentIds);
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
}

export function getScenarioComponents(scenarioId: number): Component[] {
  const store = getStore();
  const componentIds = store.scenarioComponents.get(scenarioId) || [];
  return componentIds.map(id => store.components.get(id)).filter(Boolean) as Component[];
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
  logActivity(participantId, 'snippet_unlock', `Unlocked component ID: ${componentId}`);
  
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
    totalScenarios: store.scenarios.size,
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
  return newQuestion;
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
  
  let isCorrect = false;
  let scoreObtained = 0;
  
  if (question.type === 'mcq' || question.type === 'logic') {
    isCorrect = answer === question.correctAnswer;
  } else if (question.type === 'multi-select') {
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    isCorrect = JSON.stringify(Array.isArray(answer) ? answer.sort() : [answer]) ===
               JSON.stringify(correctAnswers.sort());
  } else if (question.type === 'matching' || question.type === 'component-matching') {
    isCorrect = JSON.stringify(answer) === JSON.stringify(question.correctAnswer);
  } else if (question.type === 'simulation') {
    isCorrect = answer === question.correctAnswer;
  }
  
  if (isCorrect) {
    scoreObtained = question.score;
  }
  
  const response: Round1Response = {
    id: store.round1Responses.length + 1,
    participant_id: participantId,
    question_id: questionId,
    answer,
    is_correct: isCorrect,
    score_obtained: scoreObtained,
    time_taken: timeTaken,
    answered_at: new Date().toISOString(),
  };
  
  store.round1Responses.push(response);
  logActivity(participantId, 'round1_response', `Question ${questionId}: ${isCorrect ? 'Correct' : 'Incorrect'} (${scoreObtained}/${question.score} points)`);
  
  return response;
}

export function getRound1Responses(participantId: string): Round1Response[] {
  return getStore().round1Responses.filter(r => r.participant_id === participantId);
}

// Round 1 Result Management
export function createRound1Result(participantId: string): Round1Result {
  const store = getStore();
  
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
    total_questions: store.round1Questions.size,
    correct_answers: responses.filter(r => r.is_correct).length,
    completion_status: 'completed',
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    tab_switches: 0,
    violations: 0,
  };
  
  store.round1Results.set(participantId, result);
  
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
  
  return true;
}
