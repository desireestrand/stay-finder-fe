export async function parseErrorResponse(response: Response, defaultMessage: string): Promise<string> {
  const errorData = await response.json().catch(() => null);
  if (!errorData) return defaultMessage;

  if (errorData.message) return errorData.message;
  if (errorData.error) return errorData.error;

  if (errorData.errors && Array.isArray(errorData.errors)) {
    return errorData.errors
      .map(([field, msg]: [string, string]) => `${field}: ${msg}`)
      .join(", ");
  }

  return defaultMessage;
}