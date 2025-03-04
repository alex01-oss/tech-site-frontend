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
      const errorText = await response.text();
      const error: any = new Error(`Failed to fetch ${endpoint}`);
      error.status = response.status;
      error.details = errorText;
      
      if (response.status === 401) {
        console.error("Unauthorized: Access token invalid");
      }
      
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}: `, error);
    throw error;
  }
};