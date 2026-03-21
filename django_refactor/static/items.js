// Items API - Django backend
export async function getItems() {
  try {
    const response = await fetch("/api/items/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const items = await response.json();
    return items;
  } catch (err) {
    console.error("Error fetching items:", err);
    throw err;
  }
}
