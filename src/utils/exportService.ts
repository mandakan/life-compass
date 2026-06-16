import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/exportImportSchema.json';
import { LifeArea } from '../types/LifeArea';
import { BehavioralExperiment, Goal, Snapshot } from '../types/LifeCompassDocument';

export interface ExportInput {
  lifeAreas: LifeArea[];
  history: Snapshot[];
  goals?: Goal[];
  behavioralExperiments?: BehavioralExperiment[];
}

export function exportData(input?: ExportInput): string {
  // Gather user settings from localStorage (theme/language live outside the store)
  const userSettingsStr = localStorage.getItem('userSettings');
  const userSettings = userSettingsStr
    ? JSON.parse(userSettingsStr)
    : { language: 'en', theme: 'light' };

  // Life areas, history, goals, and behavioralExperiments come from the store
  // (passed in by the caller). Fall back to legacy localStorage keys only when
  // called without input so that existing tests that set localStorage directly
  // continue to work.
  let lifeAreas: LifeArea[];
  let history: Snapshot[];
  let goals: Goal[];
  let behavioralExperiments: BehavioralExperiment[];
  if (input) {
    lifeAreas = input.lifeAreas;
    history = input.history;
    goals = input.goals ?? [];
    behavioralExperiments = input.behavioralExperiments ?? [];
  } else {
    const lifeAreasStr = localStorage.getItem('lifeCompass');
    const historyStr = localStorage.getItem('history');
    lifeAreas = lifeAreasStr ? JSON.parse(lifeAreasStr) : [];
    history = historyStr ? JSON.parse(historyStr) : [];
    goals = [];
    behavioralExperiments = [];
  }

  // Construct export object according to the schema
  const exportJsonObj = {
    metadata: {
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    data: {
      userSettings,
      lifeAreas,
      history,
      goals,
      behavioralExperiments,
    },
  };

  // Validate against the predetermined JSON schema
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(exportJsonObj);
  if (!valid) {
    throw new Error(
      'Export data does not conform to schema: ' +
        JSON.stringify(validate.errors),
    );
  }

  return JSON.stringify(exportJsonObj, null, 2);
}
