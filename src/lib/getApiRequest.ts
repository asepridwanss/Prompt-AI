export async function getPedomanApiRequest() {
  const response = await fetch(`${process.env.REQUEST_API_URL}/api/pedoman`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pedoman");
  }

  return response.json();
}

