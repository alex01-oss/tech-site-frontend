import { useStore } from "../store/useStore"; // або інший шлях

interface FetchError extends Error {
  status?: number;
  details?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8080/api";

export const fetchData = async (
  endpoint: string,
  method: string = "GET",
  body: object | null = null
) => {
  try {
    const { accessToken } = useStore.getState();

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(`${apiUrl}/${endpoint}`, options);

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const responseData = isJson ? await response.json() : null;

    if (!response.ok) {
      const error: FetchError = new Error(responseData?.error || "Request failed");
      error.status = response.status;
      error.details = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(`Fetch failed: ${endpoint}`, fetchError);
    throw fetchError;
  }
};
