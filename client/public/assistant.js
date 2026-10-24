(function () {
  "use strict";

  const script =
    document.currentScript ||
    document.querySelector('script[data-user-id][src*="assistant.js"]');

  const userId = script?.getAttribute("data-user-id");

  if (!userId) {
    console.error("Lumora AI: Missing data-user-id.");
    return;
  }

  const assetUrl = new URL(
    script.src,
    window.location.href
  ).origin;

  // Your Express backend URL
  // Change this to your production URL (e.g., https://api.lumora.ai) later
  const apiUrl = "https://server-taupe-two-65.vercel.app"; 

  async function initialize() {
    try {
      const module = await import(
        `${assetUrl}/assistant-widget.js`
      );

      module.initLumoraAssistant({
        userId,
        assetUrl,
        apiUrl,
      });
    } catch (error) {
      console.error("Lumora AI: Widget initialization failed.", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true,
    });
  } else {
    initialize();
  }
})();