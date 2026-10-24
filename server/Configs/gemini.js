import User from "../Models/user.model.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

// const GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

export const generateGeminiResponse = async ({
  prompt,
  apiKey,
  user,
}) => {
  try {
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt is required.");
    }

    // console.log(apiKey,"API key..")
    if (!apiKey) {
      throw new Error("Gemini API key is missing.");
    }

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
        "Api-Revision": "2026-05-20",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input: prompt.trim(),
      }),
    //   signal: AbortSignal.timeout(120000),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const dbUser = user?._id
        ? await User.findById(user._id)
        : null;

      if (response.status === 401 || response.status === 403) {
        if (dbUser) {
          dbUser.geminiStatus = "invalid";
          await dbUser.save();
        }

        throw new Error("Invalid or unauthorized Gemini API key.");
      }

      if (response.status === 429) {
        if (dbUser) {
          dbUser.geminiStatus = "quota_exceeded";
          await dbUser.save();
        }

        throw new Error(
          "Gemini API quota exceeded. Please try again later."
        );
      }

      throw new Error(
        data?.error?.message ||
          `Gemini API request failed with status ${response.status}.`
      );
    }

    const reply = (data.steps || [])
      .filter((step) => step.type === "model_output")
      .flatMap((step) => step.content || [])
      .filter((content) => content.type === "text")
      .map((content) => content.text || "")
      .join("\n")
      .trim();

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    // Mark the API key as active after a successful response.
    if (user?._id) {
      await User.findByIdAndUpdate(user._id, {
        geminiStatus: "active",
      });
    }

    return reply;
  } catch (error) {
    console.error("Gemini response error:", error.message);
    throw error;
  }
};