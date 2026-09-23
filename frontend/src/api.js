// Frontend API client.

const API_URL = "https://cura-0kt7.onrender.com";

export async function sendMessage(customerId, message) {
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: customerId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with the support server.");
  }

  return response.json();
}