class DailyDesignQuote {
  constructor() {
    // Configuration
    this.config = {
      storageKeys: {
        theme: "ddq-theme",
        muteStatus: "ddq-mute-status",
        selectedVoice: "ddq-selected-voice",
      },
      animations: {
        fadeInDuration: 800,
        slideInDelay: 200,
      },
    }

    // State
    this.state = {
      currentQuote: null,
      voices: [],
      selectedVoice: null,
      isMuted: false,
      isLoading: true,
      isSpeaking: false,
      speechSynthesis: null,
    }

    // DOM Elements
    this.elements = {}

    // Initialize the application
    this.init()
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.initializeElements()
      this.initializeTheme()
      this.initializeSpeechSynthesis()
      this.initializeEventListeners()

      await this.loadQuotes()
      this.displayTodaysQuote()
      this.hideLoading()

      // Auto-read quote if not muted
      if (!this.state.isMuted) {
        setTimeout(() => this.speakQuote(), 1000)
      }
    } catch (error) {
      console.error("Failed to initialize application:", error)
      this.showError()
    }
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.elements = {
      // Content elements
      quoteText: document.getElementById("quoteText"),
      quoteAuthor: document.getElementById("quoteAuthor"),
      quoteDate: document.getElementById("quoteDate"),

      // Control elements
      readAgainBtn: document.getElementById("readAgainBtn"),
      muteToggle: document.getElementById("muteToggle"),
      themeToggle: document.getElementById("themeToggle"),
      voiceSelect: document.getElementById("voiceSelect"),

      // UI elements
      loading: document.getElementById("loading"),
      errorMessage: document.getElementById("errorMessage"),
      audioIndicator: document.getElementById("audioIndicator"),
    }

    // Validate all elements exist
    for (const [key, element] of Object.entries(this.elements)) {
      if (!element) {
        throw new Error(`Required element not found: ${key}`)
      }
    }
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem(this.config.storageKeys.theme)
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    this.setTheme(isDark ? "dark" : "light")
    this.elements.themeToggle.checked = isDark

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(this.config.storageKeys.theme)) {
        this.setTheme(e.matches ? "dark" : "light")
        this.elements.themeToggle.checked = e.matches
      }
    })
  }

  /**
   * Initialize Speech Synthesis
   */
  initializeSpeechSynthesis() {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis not supported")
      this.elements.readAgainBtn.disabled = true
      this.elements.voiceSelect.disabled = true
      return
    }

    this.state.speechSynthesis = window.speechSynthesis

    // Load mute status
    this.state.isMuted = localStorage.getItem(this.config.storageKeys.muteStatus) === "true"
    this.updateMuteButton()

    // Load voices
    this.loadVoices()

    // Voices might load asynchronously
    if (this.state.speechSynthesis.onvoiceschanged !== undefined) {
      this.state.speechSynthesis.onvoiceschanged = () => this.loadVoices()
    }
  }

  /**
   * Load available voices
   */
  loadVoices() {
    this.state.voices = this.state.speechSynthesis.getVoices()

    if (this.state.voices.length === 0) {
      // Voices not loaded yet, try again later
      setTimeout(() => this.loadVoices(), 100)
      return
    }

    this.populateVoiceSelect()
    this.loadSelectedVoice()
  }

  /**
   * Populate voice selection dropdown
   */
  populateVoiceSelect() {
    this.elements.voiceSelect.innerHTML = ""

    // Add default option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Default Voice"
    this.elements.voiceSelect.appendChild(defaultOption)

    // Add available voices
    this.state.voices.forEach((voice, index) => {
      const option = document.createElement("option")
      option.value = index
      option.textContent = `${voice.name} (${voice.lang})`
      this.elements.voiceSelect.appendChild(option)
    })
  }

  /**
   * Load selected voice from storage
   */
  loadSelectedVoice() {
    const savedVoiceIndex = localStorage.getItem(this.config.storageKeys.selectedVoice)
    if (savedVoiceIndex && this.state.voices[savedVoiceIndex]) {
      this.state.selectedVoice = this.state.voices[savedVoiceIndex]
      this.elements.voiceSelect.value = savedVoiceIndex
    }
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Theme toggle
    this.elements.themeToggle.addEventListener("change", (e) => {
      this.setTheme(e.target.checked ? "dark" : "light")
    })

    // Mute toggle
    this.elements.muteToggle.addEventListener("click", () => {
      this.toggleMute()
    })

    // Read again button
    this.elements.readAgainBtn.addEventListener("click", () => {
      this.speakQuote()
    })

    // Voice selection
    this.elements.voiceSelect.addEventListener("change", (e) => {
      const voiceIndex = e.target.value
      this.state.selectedVoice = voiceIndex ? this.state.voices[voiceIndex] : null
      localStorage.setItem(this.config.storageKeys.selectedVoice, voiceIndex)
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault()
        this.speakQuote()
      } else if (e.key === "m" && e.ctrlKey) {
        e.preventDefault()
        this.toggleMute()
      }
    })

    // Handle speech synthesis events
    if (this.state.speechSynthesis) {
      // Note: These events are attached to individual utterances, not the synthesis object
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(this.config.storageKeys.theme, theme)
  }

  /**
   * Toggle mute status
   */
  toggleMute() {
    this.state.isMuted = !this.state.isMuted
    localStorage.setItem(this.config.storageKeys.muteStatus, this.state.isMuted.toString())
    this.updateMuteButton()

    // Stop current speech if muting
    if (this.state.isMuted && this.state.isSpeaking) {
      this.state.speechSynthesis.cancel()
    }
  }

  /**
   * Update mute button appearance
   */
  updateMuteButton() {
    this.elements.muteToggle.classList.toggle("muted", this.state.isMuted)
    this.elements.muteToggle.setAttribute("aria-label", this.state.isMuted ? "Unmute auto-read" : "Mute auto-read")
  }

  /**
   * Load quotes data
   */
  async loadQuotes() {
    // Since we can't load external JSON in this environment, we'll define quotes inline
    this.quotes = [
      {
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
      },
      {
        text: "Good design is obvious. Great design is transparent.",
        author: "Joe Sparano",
      },
      {
        text: "Design is thinking made visual.",
        author: "Saul Bass",
      },
      {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
      },
      {
        text: "Design creates culture. Culture shapes values. Values determine the future.",
        author: "Robert L. Peters",
      },
      {
        text: "The details are not the details. They make the design.",
        author: "Charles Eames",
      },
      {
        text: "Design is a solution to a problem. Art is a question to a problem.",
        author: "John Maeda",
      },
      {
        text: "Good design is as little design as possible.",
        author: "Dieter Rams",
      },
      {
        text: "Design is where science and art break even.",
        author: "Robin Mathew",
      },
      {
        text: "A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.",
        author: "Antoine de Saint-Exupéry",
      },
      {
        text: "Design is intelligence made visible.",
        author: "Alina Wheeler",
      },
      {
        text: "The function of design is letting design function.",
        author: "Micha Commeren",
      },
      {
        text: "Design is not for philosophy it's for life.",
        author: "Issey Miyake",
      },
      {
        text: "Everything is designed. Few things are designed well.",
        author: "Brian Reed",
      },
      {
        text: "Design is the conscious effort to impose a meaningful order.",
        author: "Victor Papanek",
      },
      {
        text: "Creativity is intelligence having fun.",
        author: "Albert Einstein",
      },
      {
        text: "Design is about making things good (and then better) and right (and fantastic) for the people who use and encounter them.",
        author: "Matt Beale",
      },
      {
        text: "The best design is the simplest one that works.",
        author: "Albert Einstein",
      },
      {
        text: "Design is the method of putting form and content together.",
        author: "Paul Rand",
      },
      {
        text: "Good design is good business.",
        author: "Thomas Watson Jr.",
      },
      {
        text: "Design is not just what it looks like and feels like — design is how it works.",
        author: "Steve Jobs",
      },
      {
        text: "The alternative to good design is always bad design. There is no such thing as no design.",
        author: "Adam Judge",
      },
      {
        text: "Design is a funny word. Some people think design means how it looks. But of course, if you dig deeper, it's really how it works.",
        author: "Steve Jobs",
      },
      {
        text: "You can't use up creativity. The more you use, the more you have.",
        author: "Maya Angelou",
      },
      {
        text: "Design is the fundamental soul of a man-made creation that ends up expressing itself in successive outer layers.",
        author: "Steve Jobs",
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
      },
      {
        text: "The life of a designer is a life of fight: fight against the ugliness.",
        author: "Massimo Vignelli",
      },
      {
        text: "Design is so simple, that's why it is so complicated.",
        author: "Paul Rand",
      },
      {
        text: "Content precedes design. Design in the absence of content is not design, it's decoration.",
        author: "Jeffrey Zeldman",
      },
      {
        text: "Design is a plan for arranging elements in such a way as best to accomplish a particular purpose.",
        author: "Charles Eames",
      },
      {
        text: "Recognizing the need is the primary condition for design.",
        author: "Charles Eames",
      },
      {
        text: "Design is the conscious effort to impose a meaningful order.",
        author: "Victor Papanek",
      },
      {
        text: "The public is more familiar with bad design than good design.",
        author: "Paul Rand",
      },
      {
        text: "Design must reflect the practical and aesthetic in business but above all... good design must primarily serve people.",
        author: "Thomas Watson Jr.",
      },
      {
        text: "Graphic design is the paradise of individuality, eccentricity, heresy, abnormality, hobbies and humors.",
        author: "George Santayana",
      },
      {
        text: "Design is the intermediary between information and understanding.",
        author: "Hans Hofmann",
      },
      {
        text: "Art is to console those who are broken by life.",
        author: "Vincent van Gogh",
      },
      {
        text: "Inspiration exists, but it has to find you working.",
        author: "Pablo Picasso",
      },
      {
        text: "The secret to creativity is knowing how to hide your sources.",
        author: "Einstein",
      },
      {
        text: "Design is not making beauty, beauty emerges from selection, affinities, integration, love.",
        author: "Louis Kahn",
      },
      {
        text: "Have no fear of perfection - you'll never reach it.",
        author: "Salvador Dalí",
      },
      {
        text: "The best way to predict the future is to design it.",
        author: "Buckminster Fuller",
      },
      {
        text: "Design is a response to social change.",
        author: "George Nelson",
      },
      {
        text: "Every great design begins with an even better story.",
        author: "Lorinda Mamo",
      },
      {
        text: "Design is the silent ambassador of your brand.",
        author: "Paul Rand",
      },
      {
        text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
        author: "Antoine de Saint-Exupéry",
      },
      {
        text: "Design is about point of view, and there should be some sort of woman or lifestyle or attitude in one's head as a designer.",
        author: "Vera Wang",
      },
      {
        text: "To design is to communicate clearly by whatever means you can control or master.",
        author: "Milton Glaser",
      },
      {
        text: "Design is the search for a magical balance between business and art; art and craft; intuition and reason; concept and detail; playfulness and formality; client and designer; designer and user; function and form.",
        author: "Valerie Pettis",
      },
      {
        text: "The role of the designer is that of a good, thoughtful host anticipating the needs of his guests.",
        author: "Charles Eames",
      },
      {
        text: "Design is as much an act of spacing as an act of marking.",
        author: "Ellen Lupton",
      },
    ]
  }

  /**
   * Get today's quote based on date
   */
  getTodaysQuote() {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    const quoteIndex = dayOfYear % this.quotes.length
    return this.quotes[quoteIndex]
  }

  /**
   * Display today's quote
   */
  displayTodaysQuote() {
    this.state.currentQuote = this.getTodaysQuote()

    // Update quote text with animation
    this.elements.quoteText.style.opacity = "0"
    this.elements.quoteAuthor.style.opacity = "0"

    setTimeout(() => {
      this.elements.quoteText.textContent = this.state.currentQuote.text
      this.elements.quoteAuthor.textContent = this.state.currentQuote.author

      // Animate in
      this.elements.quoteText.style.opacity = "1"
      setTimeout(() => {
        this.elements.quoteAuthor.style.opacity = "1"
      }, this.config.animations.slideInDelay)
    }, 100)

    // Update date
    const today = new Date()
    this.elements.quoteDate.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  /**
   * Speak the current quote
   */
  speakQuote() {
    if (!this.state.speechSynthesis || !this.state.currentQuote || this.state.isMuted) {
      return
    }

    // Cancel any ongoing speech
    this.state.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(
      `${this.state.currentQuote.text} — ${this.state.currentQuote.author}`,
    )

    // Configure utterance
    if (this.state.selectedVoice) {
      utterance.voice = this.state.selectedVoice
    }

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Event handlers
    utterance.onstart = () => {
      this.state.isSpeaking = true
      this.elements.readAgainBtn.disabled = true
      this.showAudioIndicator()
    }

    utterance.onend = () => {
      this.state.isSpeaking = false
      this.elements.readAgainBtn.disabled = false
      this.hideAudioIndicator()
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      this.state.isSpeaking = false
      this.elements.readAgainBtn.disabled = false
      this.hideAudioIndicator()
    }

    // Speak the utterance
    this.state.speechSynthesis.speak(utterance)
  }

  /**
   * Show audio indicator
   */
  showAudioIndicator() {
    this.elements.audioIndicator.classList.add("active")
  }

  /**
   * Hide audio indicator
   */
  hideAudioIndicator() {
    this.elements.audioIndicator.classList.remove("active")
  }

  /**
   * Hide loading screen
   */
  hideLoading() {
    this.state.isLoading = false
    this.elements.loading.classList.add("hidden")
  }

  /**
   * Show error message
   */
  showError() {
    this.elements.loading.style.display = "none"
    this.elements.errorMessage.style.display = "block"
  }
}

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DailyDesignQuote()
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
})
