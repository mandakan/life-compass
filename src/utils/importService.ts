import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import exportImportSchema from '../schemas/exportImportSchema.json';
import { ImportedData } from 'types/importExport';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(exportImportSchema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  data?: unknown;
}

export function parseAndValidateJSON(content: string): ValidationResult {
  let jsonData: ImportedData;
  try {
    jsonData = JSON.parse(content);
  } catch (e) {
    return { valid: false, errors: ['Invalid JSON format.'] };
  }

  const isValid = validate(jsonData);
  if (!isValid) {
    const errorMessages = (validate.errors || []).map(err => {
      const path = err.instancePath || '';
      const message = err.message || '';
      return `Fält ${path} ${message}`.trim();
    });
    return { valid: false, errors: errorMessages };
  }

  return { valid: true, data: jsonData };
}
