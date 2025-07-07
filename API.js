export async function getChatResponse(prompt) {
  const OPENROUTER_API_KEY =
    "ENTER_YOUR_API_KEY_HERE";

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) throw new Error("API failed");

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response received.";
  } catch (error) {
    console.error("API Error:", error);
    const fallbackResponses = [
      "This is a fallback reply since the main API failed.",
      "Your chatbot UI is working. Try again later.",
      "It seems the free API limit was hit. Try again soon.",
    ];
    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  }
}
