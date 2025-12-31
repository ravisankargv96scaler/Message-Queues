export enum TabId {
  CONCEPT = 'concept',
  DECOUPLING = 'decoupling',
  LOAD_LEVELING = 'load-leveling',
  PATTERNS = 'patterns',
  GUARANTEES = 'guarantees',
  QUIZ = 'quiz',
}

export interface Message {
  id: string;
  payload: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
}

export enum WorkerMode {
  WORKER = 'Worker Queue',
  PUBSUB = 'Pub/Sub',
}
