const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8080/api";

export const fetchMenuData = async () => {
  try {
    const response = await fetch(`${apiUrl}/menu`);
    if (!response.ok) {
      throw new Error("Failed to fetch menu data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const fetchProductsData = async (
  page: number = 1,
  query: string = "",
  searchType: string = "name"
) => {
  try {
    const response = await fetch(
      `${apiUrl}/catalog?search=${encodeURIComponent(query)}&search_type=${searchType}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
