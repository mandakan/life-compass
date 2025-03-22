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
    };
  };
  