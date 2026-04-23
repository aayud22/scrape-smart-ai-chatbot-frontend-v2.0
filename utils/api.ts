export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFailureResponse = {
  detail?: string;
  message?: string;
};

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function getErrorMessageFromPayload(payload: ApiFailureResponse, fallback: string) {
  return payload.detail || payload.message || fallback;
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string) {
  let payload: T | ApiFailureResponse | null = null;

  try {
    payload = (await response.json()) as T | ApiFailureResponse;
  } catch {
    if (!response.ok) {
      throw new ApiError(fallbackMessage, response.status);
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object"
        ? getErrorMessageFromPayload(payload, fallbackMessage)
        : fallbackMessage;

    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export async function postJson<TResponse>(
  endpoint: string,
  body: Record<string, unknown>,
  fallbackMessage = "Request failed.",
) {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return parseJsonResponse<TResponse>(response, fallbackMessage);
}

export async function getJson<TResponse>(
  endpoint: string,
  fallbackMessage = "Request failed.",
) {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`);

  return parseJsonResponse<TResponse>(response, fallbackMessage);
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
