import Ajv from "ajv";
import exportImportSchema from "../schemas/exportImportSchema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(exportImportSchema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  data?: any;
}

export function parseAndValidateJSON(content: string): ValidationResult {
  let jsonData: any;
  try {
    jsonData = JSON.parse(content);
  } catch (e) {
    return { valid: false, errors: ["Ogiltigt JSON-format."] };
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
