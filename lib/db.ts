// In-memory database store for IoT Laboratory
// Data persists during server runtime

export interface Participant {
  id: string;
  name: string;
  team_name?: string;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  created_at: string;
  snippets_unlocked?: number;
  violation_count?: number;
  scenario_title?: string;
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
  details: string | null;
  created_at: string;
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
    };
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

export function createParticipant(name: string, id: string, teamName?: string): Participant {
  const store = getStore();
  const participant: Participant = {
    id,
    name,
    team_name: teamName,
    scenario_id: null,
    timer_duration: 3600,
    timer_started_at: null,
    is_active: 0,
    is_locked: 0,
    created_at: new Date().toISOString(),
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
  return getStore().components.get(id);
}

export function getAllComponents(): Component[] {
  return Array.from(getStore().components.values()).sort((a, b) => a.id - b.id);
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
export function logViolation(participantId: string, violationType: string, details?: string): void {
  const store = getStore();
  const violation: Violation = {
    id: store.violations.length + 1,
    participant_id: participantId,
    violation_type: violationType,
    details: details || null,
    created_at: new Date().toISOString(),
  };
  store.violations.push(violation);
  logActivity(participantId, 'violation', `${violationType}: ${details || ''}`);
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
