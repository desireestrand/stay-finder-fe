export async function parseErrorResponse(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const data = await response.json();

    if (!data) return defaultMessage;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const formattedErrors = data.errors
        .map((error: unknown) => {
          if (Array.isArray(error) && error.length >= 2) {
            const [, message] = error;
            return typeof message === "string" ? message : null;
          }
          if (typeof error === "string") return error;
          return null;
        })
        .filter(Boolean);

      if (formattedErrors.length > 0) {
        return formattedErrors.join(", ");
      }
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data.error === "object" && data.error?.message) {
      return String(data.error.message);
    }
  } catch {}

  return defaultMessage;
}
