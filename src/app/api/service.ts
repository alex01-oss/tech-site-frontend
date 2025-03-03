const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8080/api";

export const fetchData = async (
  endpoint: string,
  method: string = "GET",
  body: object | null = null
) => {
  try {
    const token = localStorage.getItem("accessToken")
    
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(`${apiUrl}/${endpoint}`, options);
    if (!response.ok) {
      if (response.status === 401) {
        console.error("unauthorized: to access token")
      }
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}: `, error);
    throw error;
  }
};
