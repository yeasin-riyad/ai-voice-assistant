const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const ICONS = {
  chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.1 6.1L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-1.9L12 3Z"/></svg>`,
};

class LumoraAssistant extends HTMLElement {
  constructor(options) {
    super();

    this.userId = options.userId;
    this.apiUrl = options.apiUrl;
    this.assetUrl = options.assetUrl;

    this.config = null;
    this.isOpen = false;
    this.isListening = false;
    this.isSending = false;
    this.recognition = null;
    this.voiceOutputEnabled = true;
    
    this.voiceSettings = {
      rate: 1,
      pitch: 1,
    };

    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.loadConfig();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.stopVoiceRecognition();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  getAvailableVoices() {
    if (!("speechSynthesis" in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  getSpeechLanguage(text) {
    // Bengali Unicode character detection (U+0980 to U+09FF)
    const hasBengali = /[\u0980-\u09FF]/.test(text);
    return hasBengali ? "bn-BD" : "en-US";
  }

  getBestVoice(language) {
    const voices = this.getAvailableVoices();

    // First preference: exact language match
    const exactMatches = voices.filter(
      (voice) => voice.lang.toLowerCase() === language.toLowerCase(),
    );

    // Fallback: language family match, e.g. bn-IN for Bengali
    const languageFamily = language.split("-")[0].toLowerCase();

    const candidates =
      exactMatches.length > 0
        ? exactMatches
        : voices.filter(
            (voice) =>
              voice.lang.split("-")[0].toLowerCase() === languageFamily,
          );

    if (!candidates.length) return null;

    // Browser voice metadata doesn't guarantee gender.
    // Prefer a voice whose name suggests a female voice.
    return (
      candidates.find((voice) =>
        /female|woman|samantha|zira|kore|leda|aoede|laomedeia/i.test(
          voice.name,
        ),
      ) || candidates[0]
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link
        rel="stylesheet"
        href="${escapeHtml(this.assetUrl)}/assistant.css"
      />

      <div class="lumora-widget" data-theme="dark">
        <section
          class="lumora-panel"
          id="panel"
          aria-label="AI assistant"
          aria-hidden="true"
        >
          <header class="lumora-header">
            <div class="lumora-brand">
              <div class="lumora-brand-mark">
                ${ICONS.sparkle}
              </div>

              <div class="lumora-brand-copy">
                <strong id="assistantName">Lumora Assistant</strong>
                <span class="lumora-status">
                  <i class="lumora-status-dot"></i>
                  <span id="statusText">Connecting...</span>
                </span>
              </div>
            </div>

            <button
              class="lumora-icon-button"
              id="closeBtn"
              type="button"
              aria-label="Close assistant"
            >
              ${ICONS.close}
            </button>
          </header>

          <div class="lumora-body">
            <div class="lumora-intro" id="intro">
              <div class="lumora-orb-wrap">
                <div class="lumora-orb" id="orb">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div class="lumora-eyebrow">POWERED BY LUMORA AI</div>
              <h2 id="greeting">How can I help you today?</h2>
              <p id="description">
                Ask me anything about this website.
              </p>
            </div>

            <div
              class="lumora-pages"
              id="pagesSection"
              hidden
            >
              <div class="lumora-section-heading">
                EXPLORE THIS WEBSITE
              </div>
              <div class="lumora-page-list" id="pageList"></div>
            </div>

            <div
              class="lumora-messages"
              id="messages"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            ></div>
          </div>

          <div class="lumora-voice-status" id="voiceStatus" hidden>
            Listening...
          </div>

          <form class="lumora-composer" id="chatForm">
            <button
              class="lumora-mic-button"
              id="micBtn"
              type="button"
              aria-label="Start voice input"
              title="Speak"
            >
              ${ICONS.mic}
            </button>

            <input
              id="messageInput"
              type="text"
              placeholder="Ask me anything..."
              autocomplete="off"
              aria-label="Your message"
              maxlength="4000"
            />

            <button
              class="lumora-send-button"
              id="sendBtn"
              type="submit"
              aria-label="Send message"
            >
              ${ICONS.send}
            </button>
          </form>

          <footer class="lumora-footer">
            <span>Powered by <strong>Lumora AI</strong></span>
            <button
              id="speechToggle"
              type="button"
              class="lumora-speech-toggle"
              aria-pressed="true"
            >
              ${ICONS.volume}
              <span>Voice on</span>
            </button>
          </footer>
        </section>

        <button
          class="lumora-fab"
          id="fab"
          type="button"
          aria-label="Open assistant"
          aria-expanded="false"
        >
          <span class="lumora-fab-chat">${ICONS.chat}</span>
          <span class="lumora-fab-close">${ICONS.close}</span>
          <span class="lumora-fab-ping"></span>
        </button>
      </div>
    `;
  }

  async loadConfig() {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/assistant/config/${encodeURIComponent(this.userId)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to load assistant configuration.",
        );
      }

      const config = data.user || data.data?.user || data.data || data;

      this.config = {
        assistantName: config.assistantName || "Lumora Assistant",
        businessName: config.businessName || "",
        businessDescription: config.businessDescription || "",
        tone: config.tone || "friendly",
        theme: ["light", "dark", "glass", "neon"].includes(config.theme)
          ? config.theme
          : "dark",
        pages: Array.isArray(config.pages) ? config.pages : [],
        enableVoice: config.enableVoice !== false,
        enableNavigation: Boolean(config.enableNavigation),
      };

      this.applyConfig();
      this.setStatus("Online and ready");
    } catch (error) {
      console.error("Lumora AI config error:", error);

      this.setStatus("Connection unavailable");
      this.addMessage(
        "assistant",
        "I'm having trouble connecting right now. Please try again later.",
      );
    }
  }

  applyConfig() {
    const config = this.config;
    const root = this.shadowRoot.querySelector(".lumora-widget");

    root.dataset.theme = config.theme;

    this.shadowRoot.getElementById("assistantName").textContent =
      config.assistantName;

    this.shadowRoot.getElementById("greeting").textContent = this.getGreeting(
      config.tone,
    );

    this.shadowRoot.getElementById("description").textContent =
      config.businessDescription ||
      (config.businessName
        ? `I'm here to help you explore ${config.businessName}.`
        : "Ask me anything about this website.");

    const mic = this.shadowRoot.getElementById("micBtn");
    mic.hidden = !config.enableVoice;

    if (!config.enableVoice) {
      this.shadowRoot.getElementById("voiceStatus").hidden = true;
    }

    const pages = config.enableNavigation
      ? config.pages.filter((page) => page?.name && page?.path)
      : [];

    const section = this.shadowRoot.getElementById("pagesSection");
    const list = this.shadowRoot.getElementById("pageList");

    section.hidden = pages.length === 0;

    list.innerHTML = pages
      .slice(0, 6)
      .map(
        (page) => `
          <a
            class="lumora-page-link"
            href="${escapeHtml(page.path)}"
            data-page-path="${escapeHtml(page.path)}"
          >
            <span>${escapeHtml(page.name)}</span>
            <span class="lumora-page-arrow">↗</span>
          </a>
        `,
      )
      .join("");
  }

  getGreeting(tone) {
    const greetings = {
      friendly: "Hey there! How can I help?",
      professional: "How may I assist you today?",
      sales: "Let's find the right solution for you.",
    };

    return greetings[tone] || greetings.friendly;
  }

  bindEvents() {
    const $ = (id) => this.shadowRoot.getElementById(id);

    $("fab").addEventListener("click", () => {
      this.togglePanel(!this.isOpen);
    });

    $("closeBtn").addEventListener("click", () => {
      this.togglePanel(false);
    });

    $("chatForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      const input = $("messageInput");
      const message = input.value.trim();

      if (!message || this.isSending) return;

      input.value = "";
      await this.sendMessage(message);
    });

    $("micBtn").addEventListener("click", () => {
      this.toggleVoice();
    });

    $("speechToggle").addEventListener("click", () => {
      this.voiceOutputEnabled = this.voiceOutputEnabled === false;

      $("speechToggle").setAttribute(
        "aria-pressed",
        String(this.voiceOutputEnabled),
      );

      $("speechToggle").querySelector("span").textContent = this
        .voiceOutputEnabled
        ? "Voice on"
        : "Voice off";

      if (!this.voiceOutputEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    });
  }

  togglePanel(open) {
    this.isOpen = open;

    const panel = this.shadowRoot.getElementById("panel");
    const fab = this.shadowRoot.getElementById("fab");

    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));

    fab.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", String(open));
    fab.setAttribute("aria-label", open ? "Close assistant" : "Open assistant");

    if (open) {
      this.shadowRoot.getElementById("messageInput").focus();
    } else {
      this.stopVoiceRecognition();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  setStatus(text) {
    const status = this.shadowRoot.getElementById("statusText");
    if (status) status.textContent = text;
  }

  addMessage(role, text) {
    const messages = this.shadowRoot.getElementById("messages");
    const message = document.createElement("div");

    message.className = `lumora-message lumora-message-${role}`;

    const bubble = document.createElement("div");
    bubble.className = "lumora-message-bubble";
    bubble.textContent = text;

    message.appendChild(bubble);

    if (role === "assistant") {
      const speakButton = document.createElement("button");

      speakButton.type = "button";
      speakButton.className = "lumora-message-speak";
      speakButton.setAttribute("aria-label", "Read response aloud");
      speakButton.innerHTML = ICONS.volume;

      speakButton.addEventListener("click", () => {
        this.speakResponse(text);
      });

      message.appendChild(speakButton);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  async sendMessage(message) {
    if (this.isSending) return null;

    this.isSending = true;

    const sendBtn = this.shadowRoot.getElementById("sendBtn");
    const input = this.shadowRoot.getElementById("messageInput");

    sendBtn.disabled = true;
    input.disabled = true;

    this.addMessage("user", message);
    this.setStatus("Thinking...");

    const loading = this.addMessage("assistant", "Thinking...");

    try {
      const response = await fetch(`${this.apiUrl}/api/assistant/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId: this.userId,
          message,
          currentPath: window.location.pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));

      loading.remove();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to get an AI response.");
      }

      if (data.action === "navigate" && data.path) {
        this.addMessage("assistant", data.response || "Opening the page...");

        const destination = new URL(data.path, window.location.origin);

        if (destination.origin !== window.location.origin) {
          throw new Error("The requested navigation path is not allowed.");
        }

        window.location.assign(destination.href);
        return data.response;
      }

      const reply = data.response || "I couldn't generate a response.";

      this.addMessage("assistant", reply);

      if (this.voiceOutputEnabled !== false) {
        this.speakResponse(reply);
      }

      this.setStatus("Online and ready");
      return reply;
    } catch (error) {
      loading.remove();
      console.error("Lumora AI chat error:", error);
      this.addMessage(
        "assistant",
        error.message || "Sorry, something went wrong. Please try again.",
      );
      this.setStatus("Unable to respond");
      return null;
    } finally {
      this.isSending = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  speakResponse(text) {
    if (!text || !("speechSynthesis" in window)) {
      this.setStatus("Speech is not supported in this browser");
      return;
    }

    window.speechSynthesis.cancel();

    const language = this.getSpeechLanguage(text);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language;
    utterance.rate = this.voiceSettings?.rate ?? 1;
    utterance.pitch = this.voiceSettings?.pitch ?? 1;
    utterance.volume = 1;

    const voice = this.getBestVoice(language);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.setStatus("Speaking...");
      this.shadowRoot.getElementById("orb").classList.add("is-speaking");
    };

    utterance.onend = () => {
      this.setStatus("Online and ready");
      this.shadowRoot.getElementById("orb").classList.remove("is-speaking");
    };

    utterance.onerror = (event) => {
      console.warn("Lumora AI speech error:", event.error);
      this.setStatus("Online and ready");
      this.shadowRoot.getElementById("orb").classList.remove("is-speaking");
    };

    window.speechSynthesis.speak(utterance);
  }

  toggleVoice() {
    if (!this.config?.enableVoice) return;

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      this.addMessage(
        "assistant",
        "Voice input is not supported in this browser. Please type your message instead.",
      );
      return;
    }

    if (this.isListening) {
      this.stopVoiceRecognition();
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const recognition = new Recognition();
    this.recognition = recognition;
    
    const docLang = document.documentElement.lang || "en-US";
    recognition.lang = docLang.startsWith("bn") ? "bn-BD" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.isListening = true;
      this.shadowRoot.getElementById("micBtn").classList.add("is-listening");
      this.shadowRoot.getElementById("voiceStatus").hidden = false;
      this.shadowRoot.getElementById("voiceStatus").textContent = "Listening... Speak now.";
      this.setStatus("Listening");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (!transcript) return;

      this.shadowRoot.getElementById("messageInput").value = transcript;
      await this.sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      const status = this.shadowRoot.getElementById("voiceStatus");
      status.hidden = false;
      status.textContent =
        event.error === "not-allowed"
          ? "Please allow microphone access in your browser."
          : "Voice input failed. Please try again.";
      this.setStatus("Online and ready");
    };

    recognition.onend = () => {
      this.isListening = false;
      this.shadowRoot.getElementById("micBtn").classList.remove("is-listening");
      this.shadowRoot.getElementById("voiceStatus").hidden = true;
      this.setStatus("Online and ready");
      this.recognition = null;
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Lumora AI microphone error:", error);
    }
  }

  stopVoiceRecognition() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (_) {}
  }
}

export function initLumoraAssistant(options) {
  if (document.querySelector("lumora-assistant")) return;

  class ConfiguredLumoraAssistant extends LumoraAssistant {
    constructor() {
      super(options);
    }
  }

  if (!customElements.get("lumora-assistant")) {
    customElements.define("lumora-assistant", ConfiguredLumoraAssistant);
  }

  document.body.appendChild(document.createElement("lumora-assistant"));
}