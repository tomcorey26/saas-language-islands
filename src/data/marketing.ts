import { supportedLanguagesArray } from "./supportedLanguages";

// Company Information
export const COMPANY = {
  name: "Speech Islands",
  tagline: "AI-Powered Language Learning",
  description:
    "Master languages through AI-powered flashcards and spaced repetition",
  fullDescription: `Master languages through AI-powered flashcards and spaced repetition. Learn ${supportedLanguagesArray.length}+ languages with contextual phrases that prepare you for real conversations.`,
  domain: "speechislands.com",
  url: "https://speechislands.com",
  foundedYear: 2024,
} as const;

// Contact Information
export const CONTACT = {
  support: "tommycodesapps@gmail.com",
  business: "tommycodesapps@gmail.com",
  legal: "tommycodesapps@gmail.com",
  privacy: "tommycodesapps@gmail.com",
  social: {
    twitter: "@TommyTBop",
    twitterUrl: "https://x.com/TommyTBop",
    // facebook: "https://facebook.com/speechislands",
    linkedin: "https://www.linkedin.com/in/tom-corey-499419170/",
  },
} as const;

// Business Policies
export const POLICIES = {
  freeTokens: 100,
  supportResponseHours: 24,
  reviewTimeHours: 48,
  languageCount: supportedLanguagesArray.length,
  userCount: "10,000+",
  minAge: 13,
  minAgeWithParentalConsent: 18,
} as const;

// Feature Lists
export const FEATURES = {
  core: [
    "AI-powered flashcards",
    "Spaced repetition algorithm",
    "Multiple languages",
  ],
  premium: ["Priority support", "Export flashcards", "Advanced analytics"],
  popular: [
    { text: "Mobile app for iOS and Android", color: "blue" },
    { text: "Audio pronunciation for flashcards", color: "green" },
    { text: "Collaborative learning with friends", color: "purple" },
    { text: "Gamification and achievement system", color: "orange" },
    { text: "Advanced analytics and progress insights", color: "red" },
  ],
} as const;

// FAQ Data
export const FAQ_DATA = {
  refundPolicy: `Due to the high costs involved in powering the advanced AI models for our flashcard generation, we unfortunately cannot offer refunds once tokens have been used. We realize this may not be the ideal scenario for everyone, but this policy helps us to maintain a fair and sustainable service for all of our valued users.`,
  general: [
    {
      question: "What is Speech Islands?",
      answer: `${COMPANY.name} is an AI-powered language learning platform that uses spaced repetition flashcards organized into thematic 'islands.' Instead of learning isolated vocabulary, you learn contextual phrases and sentences that prepare you for real conversations.`,
    },
    {
      question: "How does the token system work?",
      answer:
        "Tokens are used to generate AI-powered flashcards. Each flashcard creation uses one token. You can purchase token packages (no subscription required) and use them whenever you want to create new content. Tokens never expire.",
    },
    {
      question: "Which languages does Speech Islands support?",
      answer: `We support ${POLICIES.languageCount}+ languages including Spanish, French, German, Italian, Portuguese, Japanese, Korean, Mandarin Chinese, Arabic, Hindi, Russian, Dutch, Swedish, and many more. Our AI can create content for virtually any language.`,
    },
    {
      question: "What makes Speech Islands different from other language apps?",
      answer: `Unlike traditional apps that focus on isolated vocabulary, ${COMPANY.name} teaches contextual phrases grouped into thematic 'islands' (like 'Restaurant Conversations' or 'Travel Essentials'). This approach, combined with spaced repetition science, helps you learn practical language skills faster.`,
    },
    {
      question: "Do I need a subscription?",
      answer: `No! ${COMPANY.name} uses a simple token-based system with no recurring subscriptions. Purchase tokens once and use them whenever you're ready to learn. You can buy additional tokens at any time.`,
    },
  ],
  technical: [
    {
      question: "How does spaced repetition work?",
      answer:
        "Spaced repetition is a learning technique that shows you flashcards just before you're about to forget them. Our algorithm tracks your performance and schedules reviews at optimal intervals to maximize retention while minimizing study time.",
    },
    {
      question: "Can I use Speech Islands offline?",
      answer:
        "You need an internet connection to generate new flashcards and sync your progress. However, once downloaded, you can study your existing flashcards offline through your browser cache.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our web application is fully responsive and works great on mobile devices. You can add it to your home screen for an app-like experience. A dedicated mobile app is on our roadmap.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "Your dashboard shows detailed statistics including cards studied, retention rates, and learning streaks. Each card tracks your performance history to optimize future review timing.",
    },
    {
      question: "Can I export my flashcards?",
      answer:
        "Yes! Premium users can export their flashcards to formats like Anki, CSV, or PDF for use in other applications or offline study.",
    },
  ],
  billing: [
    {
      question: "How much do tokens cost?",
      answer: `We offer several token packages: 500 tokens for $1.99, 2,000 tokens for $5.99, and 5,000 tokens for $12.99. All users start with ${POLICIES.freeTokens} free tokens to try the platform.`,
    },
    {
      question: "Do tokens expire?",
      answer:
        "No, tokens never expire. Once you purchase them, they remain in your account until you use them to generate flashcards.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal through our secure payment processor, Stripe.",
    },
    {
      question: "Can I get a refund?",
      answer: `Due to the high costs involved in powering the advanced AI models for our flashcard generation, we unfortunately cannot offer refunds once tokens have been used. We realize this may not be the ideal scenario for everyone, but this policy helps us to maintain a fair and sustainable service for all of our valued users.`,
    },
    // {
    //   question: "Do you offer student discounts?",
    //   answer:
    //     "Yes! We provide special pricing for students, teachers, and educational institutions. Contact us with your .edu email address for more information about our educational discounts.",
    // },
  ],
} as const;

// Common UI Text
export const UI_TEXT = {
  cta: {
    getStarted: "Get Started",
    getStartedFree: "Get Started Free",
    startLearning: "Start Learning Today",
    startLearningFree: "Start Learning Today - It's Free!",
    tryFree: `Start with ${POLICIES.freeTokens} Free Tokens`,
    contactUs: "Contact Us",
    learnMore: "Learn More",
  },
  status: {
    success: "Success!",
    error: "Error",
    loading: "Loading...",
  },
  navigation: {
    home: "Home",
    about: "About",
    pricing: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    featureRequest: "Feature Request",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    dashboard: "Dashboard",
  },
} as const;

// Meta descriptions for SEO
export const META_DESCRIPTIONS = {
  home: COMPANY.fullDescription,
  about: `Learn about ${COMPANY.name} and our mission to revolutionize language learning through AI-powered flashcards and spaced repetition.`,
  pricing:
    "Choose the perfect plan for your language learning journey. Affordable token packages with no subscription required.",
  contact: `Get in touch with the ${COMPANY.name} team. We're here to help with questions about our language learning platform.`,
  faq: `Frequently asked questions about ${COMPANY.name}, our language learning platform, token system, and features.`,
  privacy: `${COMPANY.name} privacy policy. Learn how we collect, use, and protect your personal information.`,
  terms: `${COMPANY.name} terms of service. Read our terms and conditions for using our language learning platform.`,
  featureRequest: `Request new features for ${COMPANY.name}. Help us improve our language learning platform with your suggestions.`,
} as const;
