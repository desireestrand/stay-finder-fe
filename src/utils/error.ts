export async function parseErrorResponse(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const data = await response.json();

    if (!data) return defaultMessage;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const formattedErrors = data.errors
        .map((err: unknown) => {
          if (Array.isArray(err) && err.length >= 2) {
            const [field, message] = err;
            return `${field}: ${message}`;
          }
          if (typeof err === "string") return err;
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
