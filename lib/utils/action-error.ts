/**
 * Parses the action error object and returns a formatted error message.
 * Client-safe version without server dependencies.
 *
 * @param error - The action error object.
 * @returns The formatted error message.
 */
export const parseActionError = (error: {
  serverError?: string;
  validationErrors?: {
    _errors?: string[];
    id?: {
      _errors?: string[];
    };
  };
  bindArgsValidationErrors?: readonly [];
  fetchError?: string;
}): string => {
  let errorMessage = "";

  if (error.serverError) {
    errorMessage += `Server Error: ${error.serverError}\n`;
  }

  if (error.validationErrors) {
    if (
      error.validationErrors._errors &&
      error.validationErrors._errors.length > 0
    ) {
      errorMessage += `Validation Errors: ${error.validationErrors._errors.join(
        ", "
      )}\n`;
    }

    if (
      error.validationErrors.id?._errors &&
      error.validationErrors.id._errors.length > 0
    ) {
      errorMessage += `Validation Errors for ID: ${error.validationErrors.id._errors.join(
        ", "
      )}\n`;
    }
  }

  if (
    error.bindArgsValidationErrors &&
    error.bindArgsValidationErrors.length > 0
  ) {
    errorMessage += `Bind Args Validation Errors: ${error.bindArgsValidationErrors.join(
      ", "
    )}\n`;
  }

  if (error.fetchError) {
    errorMessage += `Fetch Error: ${error.fetchError}\n`;
  }

  return errorMessage.trim();
};