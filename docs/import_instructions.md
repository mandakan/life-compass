# Import Data from JSON - Instructions and Troubleshooting

## Overview

This document provides instructions for importing data into the Life Compass application using a JSON file. The JSON file must adhere to a predefined schema. During the import process, the system validates the file and displays errors if it does not meet the schema requirements. Once validated, a preview is shown for confirmation before the data is imported.

## JSON Schema Expectations

The JSON file must have the following structure:

- **metadata** (object):
  - `exportTimestamp` (string, date-time): The timestamp when the data was exported.
  - `version` (string): The version of the exported data.
- **data** (object):
  - **userSettings** (object):
    - `language` (string): The language setting.
    - `theme` (string): Either "light" or "dark".
  - **lifeAreas** (array): An array of life area objects. Each object must include:
    - `id` (string)
    - `name` (string)
    - `description` (string)
    - `importance` (number)
    - `satisfaction` (number)
    - `details` (string)
  - **history** (array): An array of history objects. This can be empty if no history exists.

Any missing required fields or additional invalid properties will cause the import to fail. Errors will be reported to the user with clear messages indicating the nature of the problem.

## Import Process

1. Click the **Importera** button to open a file selection dialog.
2. Select a JSON file. The file type is verified and the content is read.
3. The JSON is parsed and validated against the schema.
4. If errors occur, an error message is displayed (e.g., "Ogiltigt JSON-format." or field-specific errors).
5. If validation is successful, a preview modal displays a summary of the imported data, including:
   - Export timestamp
   - Data version
   - Number of life areas
   - Number of history entries
6. Confirm the preview to proceed with the import, replacing the current data or merging as necessary.
7. If the import is successful, a success message is displayed.

## Troubleshooting

- **File Not Importing:** Make sure you are selecting a valid JSON file with a `.json` extension.
- **Validation Errors:** Read the error messages carefully; they indicate which fields are missing or invalid.
- **Preview Not Displaying:** Verify that your JSON adheres to the schema exactly. The file input is cleared after each import, so re-selecting the same file is allowed.
- **Repeated Imports Problems:** The file input is reset after each import. If you encounter issues on subsequent imports, ensure the file is not corrupted and meets the schema requirements.

## Testing

The import functionality is covered by unit tests in `src/tests/importService.test.ts`. These tests verify:
- Valid JSON string handling.
- Detection of invalid JSON formatting.
- Schema validation errors when required properties are missing.

Keep this document updated if the import schema changes or if further troubleshooting tips become relevant.
