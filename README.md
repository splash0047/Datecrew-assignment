# The Date Crew - Matchmaker Dashboard MVP

An elite, workflow-driven SaaS Matchmaker Dashboard designed for matchmakers at **The Date Crew**. The application assists matchmakers in daily prioritizing schedules, reviewing client pipelines, evaluating candidates with an **AI Matchmaker Copilot**, and sharing curated match briefs.

Built with **React 18**, **Vite**, **TypeScript**, **Zustand**, and **Tailwind CSS** with **Radix UI** and **Framer Motion** design patterns.

---

## Demo & Walkthrough

- **Live Hosted Application**: [View Live Deployment](https://datecrew-mvp.vercel.app)
- **Walkthrough Video**: [Watch Loom Demo (2-3 minutes walkthrough)](https://www.loom.com/share/PLACEHOLDER_LOOM_ID) <!-- REPLACE with actual Loom share URL after recording -->

---

## Screenshots

| Dashboard Overview | Client Profile & AI Copilot | Match Brief & Email |
|---|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Profile](screenshots/profile-detail.png) | ![Match Brief](screenshots/match-brief.png) |

> **Note**: Screenshots are in the `screenshots/` directory. To add your own, capture the dashboard, a client profile drawer, and the AI match explanation panel, then place them there.

---

## Tech Stack

- **Framework**: React 18 & Vite (TypeScript `.ts`, `.tsx` strict checking)
- **State Store**: Zustand (reactive, single-responsibility stores)
- **Styling**: Tailwind CSS (Warm Premium Minimalist configuration)
- **Animation**: Framer Motion (drawer spring slide, hover lifts, count-ups)
- **Search**: Fuse.js fuzzy search + regex smart filters
- **AI**: Google Gemini 2.5 Flash (with local rule-based fallback)
- **Icons**: Lucide React

---

## Folder Structure

The project follows a modular, feature-centric directory structure closer to production-grade web applications:

```
src/
├── App.tsx                   # Main layout coordinator (Gateway, Login, Dashboard)
├── theme.ts                  # Design system tokens (colors, radius, shadow metrics)
├── types/
│   └── index.ts              # Global TypeScript interfaces
├── config/
│   ├── env.ts                # Environment settings wrapper
│   ├── matchingRules.ts      # Configurable matchmaking weights (as const)
│   └── journeyConfig.ts      # Pipeline journey CRM stages configuration
├── constants/
│   ├── cities.ts
│   ├── languages.ts
│   └── religions.ts
├── data/
│   ├── male.json             # 110 static handcrafted Indian male profiles
│   └── female.json           # 110 static handcrafted Indian female profiles
├── stores/
│   ├── profileStore.ts       # Active selections, profile lists, stage updates
│   ├── matchStore.ts         # Match history CRM log, feedback ratings
│   └── noteStore.ts          # Persistence of meeting notes and outcomes
├── services/
│   ├── matching.ts           # Consolidated Matching Service (Filter + Score + Explain)
│   └── ai/
│       ├── cache.ts          # LocalStorage caching with 24-hr expiration
│       └── gemini.ts         # Gemini API client & local rule fallback generator
├── prompts/
│   ├── compatibility.v1.ts   # Versioned matchmaking prompts
│   └── email.v1.ts           # Versioned email generation prompts
├── hooks/
│   ├── useAI.ts              # Hook managing cached API calls and skeletons
│   └── useDebounce.ts        # Smart search performance debouncer
└── features/
    ├── gateway/
    │   └── WelcomeScreen.tsx # Designed Gateway Splash page
    ├── dashboard/
    │   ├── CopilotPriorities.tsx
    │   ├── SaaSMetrics.tsx
    │   ├── RecentDecisions.tsx
    │   └── ActivityFeed.tsx
    ├── profiles/
    │   ├── DrawerContainer.tsx
    │   ├── JourneyTimeline.tsx
    │   ├── ProfileDetails.tsx
    │   └── RelationshipTimeline.tsx
    └── matching/
        ├── SuggestedMatches.tsx
        ├── MatchBrief.tsx
        └── MatchFeedback.tsx
```

---

## Matching Algorithm Architecture

The matchmaking recommendation engine operates in three distinct, sequential phases:

```
                  [220 Candidate Pool (110M + 110F)]
                           │
                           ▼
  1. Hard Filters ─────────────────► (Excludes incompatible gender,
                           │          caste/age range, child views)
                           ▼
  2. Soft Scoring ─────────────────► (Assigns points based on:
                           │          - Children alignment (30)
                           │          - Career/Income level (20)
                           │          - Lifestyle & diet (15)
                           │          - Education tier (15)
                           │          - Language (10)
                           │          - City Match (10))
                           ▼
                 [Sorted Candidate List]
```

### Exclusions Transparency ("Why Not?" Panel)
Candidates who fail the hard filter phase are categorized with explicit rejection reasons (e.g. `Excluded: Candidate is older than client`) and logged in a collapsible drawer section, ensuring transparency for matchmakers.

---

## AI Prompt Strategy (Versioned)
We manage templates under `src/prompts/` to separate business logic from rendering code:
- **`compatibility.v1.ts`**: Formulates profile comparisons, instructing the LLM to output a JSON payload detailing Strengths, Concerns, a Next-step action, and a narrative summary.
- **`email.v1.ts`**: Generates three distinct email variations—**Professional** (formal), **Friendly** (casual), and **Warm** (family-focused).

---

## Why Gemini Over OpenAI

We chose **Google Gemini 2.5 Flash** over OpenAI's GPT-4o for three deliberate reasons:

1. **Cost efficiency**: Gemini Flash offers significantly lower per-token pricing than GPT-4o, which matters for a matchmaker tool that may generate dozens of compatibility analyses per day per matchmaker. At scale, this keeps operational costs manageable.
2. **Native JSON mode reliability**: Gemini's `responseMimeType: 'application/json'` works consistently without the prompting workarounds sometimes needed with OpenAI's JSON mode. Our prompts return structured JSON with nested fields, and Gemini handles this reliably on the first call.
3. **Generous free tier**: Gemini's free tier allows substantial usage during development and demo phases, meaning the application works fully without requiring a paid API key (via the local fallback engine). This makes the demo self-contained and cost-free for reviewers.

---

## Engineering Decisions & Trade-offs

### Decisions
1. **Static JSON Database**: Handcrafted 220 profiles statically (`male.json` and `female.json`) to guarantee realistic, authentic Indian names and matching variables instead of relying on generic faker libraries.
2. **Configuration-Driven Rules**: Weights are loaded from `matchingRules.ts` so product teams can adjust weights without code changes.
3. **Expiring Cache**: Gemini analysis calls are cached locally with a 24-hour expiration timestamp and version control to minimize token latency.
4. **Local Fallback Engine**: If no `VITE_GEMINI_API_KEY` is set, the application automatically triggers the local fallback system, maintaining fully functional offline compatibility.

### Trade-offs
1. **Client-side State**: Used Zustand + LocalStorage instead of a PostgreSQL or Firestore database to simplify deployment and focus on the UI/UX experience.
2. **Assignment Compliance Disclaimer**: The gender-specific matching rules (e.g. males matching shorter/younger females) were implemented exactly as defined in the exercise requirements. However, the system is architected dynamically to support modern, non-gender-biased matching.

---

## Assumptions Made

1. **Target demographic**: All 220 dummy profiles represent Indian urban professionals (ages 25-37) in metro cities, reflecting The Date Crew's likely primary market. This simplifies language, religion, and cultural attribute modeling.
2. **Matchmaker-as-user**: The primary user is a professional matchmaker managing 15-25 active clients, not the end-client themselves. This shaped the dashboard-first (not mobile-app) design.
3. **AI as copilot, not autopilot**: Gemini-generated compatibility scores and email drafts are suggestions for the matchmaker to review, not automated decisions. The matchmaker always makes the final call.
4. **Hard filters are non-negotiable**: Caste, age-range, and child-view preferences are treated as hard exclusions (not soft preferences) because the brief specifies them as deal-breakers.
5. **Single-session deployment**: The MVP uses client-side state (LocalStorage) rather than a backend database. Data resets on browser clear, which is acceptable for a demo/assignment context.
6. **Gender binary matching**: The system implements male-to-female matching as specified in the brief. The architecture supports expanding to any gender pairing via configuration.

---

## How to Run Locally

1. **Clone & Setup**:
   ```bash
   git clone <repo-url>
   cd Datecrew
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Configure API Key (Optional)**:
   Add a `.env` file in the root to enable live Gemini compatibility analysis:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Without the key, the app uses the local rule-based fallback engine and remains fully functional.
