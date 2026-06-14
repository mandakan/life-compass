import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/exportImportSchema.json';
import { LifeArea } from '../types/LifeArea';
import { Snapshot } from '../types/LifeCompassDocument';

export interface ExportInput {
  lifeAreas: LifeArea[];
  history: Snapshot[];
}

export function exportData(input?: ExportInput): string {
  // Gather user settings from localStorage (theme/language live outside the store)
  const userSettingsStr = localStorage.getItem('userSettings');
  const userSettings = userSettingsStr
    ? JSON.parse(userSettingsStr)
    : { language: 'en', theme: 'light' };

  // Life areas and history come from the store (passed in by the caller).
  // Fall back to legacy localStorage keys only when called without input so
  // that existing tests that set localStorage directly continue to work.
  let lifeAreas: LifeArea[];
  let history: Snapshot[];
  if (input) {
    lifeAreas = input.lifeAreas;
    history = input.history;
  } else {
    const lifeAreasStr = localStorage.getItem('lifeCompass');
    const historyStr = localStorage.getItem('history');
    lifeAreas = lifeAreasStr ? JSON.parse(lifeAreasStr) : [];
    history = historyStr ? JSON.parse(historyStr) : [];
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
