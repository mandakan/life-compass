import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/exportImportSchema.json';

export function exportData(): string {
  // Gather data from local storage, adjust keys if needed
  const userSettingsStr = localStorage.getItem('userSettings');
  // Previously, life areas were read from a non-existent or wrong key.
  // Life areas are stored under the key "lifeCompass", so we update accordingly.
  const lifeAreasStr = localStorage.getItem('lifeCompass');
  const historyStr = localStorage.getItem('history');

  // Provide default values for userSettings to satisfy the schema requirements
  const userSettings = userSettingsStr
    ? JSON.parse(userSettingsStr)
    : { language: 'en', theme: 'light' };
  const lifeAreas = lifeAreasStr ? JSON.parse(lifeAreasStr) : [];
  const history = historyStr ? JSON.parse(historyStr) : [];

  // Construct export object according to the schema
  const exportJsonObj = {
    metadata: {
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    data: {
      userSettings: userSettings,
      lifeAreas: lifeAreas,
      history: history,
    },
  };

  // Validate against the predetermined JSON schema
  const ajv = new Ajv();
  addFormats(ajv); // ✅ Adds support for "date-time", "email", etc.
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
