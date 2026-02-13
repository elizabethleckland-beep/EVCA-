
export enum Priority {
  NOW = 'Now',
  NEXT = 'Next',
  LATER = 'Later'
}

export enum FixType {
  BRIEF = 'Strategic Initiative (BRIEF)',
  PLAYBOOK = 'Playbook/SOP (OUR BEST WAY)',
  SYSTEM = 'System Upgrade',
  ORG = 'Org Change',
  TRAINING = 'Training'
}

export interface IncidentImpact {
  monetaryValue: string;
  frequency: string;
  kpiImpacted: string;
}

export interface IncidentTags {
  primaryStageId: number;
  layers: string[]; // People, Tech, Policy, Data
}

export interface CascadeNode {
  type: 'upstream' | 'root' | 'downstream';
  stageId: number;
  description: string;
}

export interface StageData {
  id: number;
  name: string;
  functionalId: string;
  today: string;
  targetState: string;
  owners: string;
  systems: string;
  metrics: string;
  broken: string;
  notes: string;
  isActive: boolean;
  strategicMismatch?: string;
}

export interface SupportGaps {
  people: string;
  tech: string;
  governance: string;
  finance: string;
}

export interface Issue {
  id: string;
  stageId: number;
  description: string;
  pillars: string[];
  fixType: FixType;
  priority: Priority;
  owner: string;
  rationale?: string;
  suggestedFix?: string;
  playbook?: string;
  visionAlignment?: string;
}

export interface ProjectState {
  version: string;
  mode: 'incident' | 'advanced';
  orgName: string;
  vision: string;
  persona: string;
  
  // Incident Data
  incidentDescription: string;
  incidentTags: IncidentTags;
  incidentImpact: IncidentImpact;
  cascadeMap: CascadeNode[];
  clarifyingQuestions: string[];
  diagnosticSummary: string;
  
  // Advanced / Secondary Data
  stages: Record<number, StageData>;
  supportGaps: Record<number, SupportGaps>;
  issues: Issue[];
  industryTemplate: string;
}
