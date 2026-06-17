export type ImportedData = {
  metadata: {
    exportTimestamp: string; // ISO 8601 format
    version: string;
  };
  data: {
    userSettings: {
      language: string;
      theme: 'light' | 'dark';
      [key: string]: unknown; // allows additional properties
    };
    lifeAreas: {
      id: string;
      name: string;
      description: string;
      importance: number;
      satisfaction: number;
      details: string;
      [key: string]: unknown; // allows additional properties
    }[];
    history: Record<string, unknown>[]; // history items are loosely typed
    goals?: {
      id: string;
      areaId: string;
      title: string;
      createdAt: string;
      steps: {
        id: string;
        text: string;
        done: boolean;
        [key: string]: unknown;
      }[];
      [key: string]: unknown;
    }[]; // optional: older exports without goals default to []
    behavioralExperiments?: {
      id: string;
      areaId?: string;
      title: string;
      createdAt: string;
      outcome: string;
      steps: {
        id: string;
        text: string;
        done: boolean;
        [key: string]: unknown;
      }[];
      [key: string]: unknown;
    }[];
    thoughtRecords?: {
      id: string;
      areaId?: string;
      situation: string;
      thought: string;
      feeling: string;
      feelingBefore?: number;
      supports: string;
      widerView: string;
      kinderView: string;
      feelingAfter?: number;
      createdAt: string;
      [key: string]: unknown;
    }[];
  };
};
