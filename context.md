# The House Always Loses — Hackathon Context

## The idea

A casino app that turns itself inside out. Players experience a fully functional slot machine, but every psychological trick being used on them is exposed in real time. The "superhero" angle: we took the casino — a tool of manipulation — and bent it into a tool of awareness.

**One-liner for the pitch:** "Every other casino app is designed to keep you in the dark. We built one that forces you into the light."

**The real problem it solves:** Gambling products are legally required to display odds, but nobody understands them. We make the manipulation visceral and personal — not a warning label, but a live demonstration happening to you.

---

## Scope

### In scope (MVP — must ship)
- Slot machine with authentic feel (animated reels, win sounds, balance tracking)
- Real RTP of ~85% baked into the probability engine
- Truth panel (sidebar) with progressive reveal — starts empty, layers unlock over time
- Five psychological tricks detected and flagged: near-miss, loss disguised as win (LDW), variable reward schedule, asymmetric sound design, sunk cost nudges
- End screen with full session summary, lifetime projection, and support links

### Out of scope (cut if time is tight)
- Multiple game types (roulette, blackjack) — slots only for MVP
- User accounts / saved sessions
- Backend / database — everything runs client-side
- Mobile responsiveness — desktop-first, polish later

### Stretch goals (only if MVP is solid by hour 18)
- Roulette wheel as second game
- Shareable end screen image (screenshot-to-card)
- Sound toggle with explanation of why the sounds are designed the way they are

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast setup, both familiar |
| Styling | Standard CSS | No config overhead, full control |
| Animation | Framer Motion | Reel spin + truth card fade-ins |
| Charts | Recharts | Probability graph in truth panel |
| State | React useState / useReducer | No backend, no need for Redux |
| Hosting | Vercel | One command deploy |

---

## How the progressive reveal works

The truth panel is intentionally empty at the start. Layers unlock based on spin count:

| Spin | What unlocks |
|---|---|
| 1–5 | Nothing. Let the manipulation work first. |
| 6 | Payout rate card + first near-miss notification |
| 10 | Near-miss counter card |
| Any LDW | LDW card (triggers on first loss-disguised-as-win) |
| 20 | Lifetime projection card + net loss sub-label |
| End | Full summary screen with all stats |

---

## Component structure

```
src/
├── components/
│   ├── SlotMachine/
│   │   ├── SlotMachine.jsx       # Parent: manages game state
│   │   ├── Reels.jsx             # Three animated reel columns
│   │   ├── SpinButton.jsx        # Bet controls + spin trigger
│   │   └── ResultMessage.jsx     # Win/loss message display
│   ├── TruthPanel/
│   │   ├── TruthPanel.jsx        # Parent: manages reveal state
│   │   ├── StatCard.jsx          # Reusable metric card
│   │   ├── TrickCard.jsx         # Trick reveal card w/ fade-in
│   │   └── Notification.jsx      # Single bottom toast
│   ├── EndScreen/
│   │   ├── EndScreen.jsx         # Full summary screen
│   │   ├── TrickList.jsx         # Breakdown of all tricks used
│   │   └── LifetimeProjection.jsx# Projection table
│   └── Layout.jsx                # Two-column grid wrapper
├── hooks/
│   ├── useGameEngine.js          # Core probability + spin logic
│   ├── useTrickDetector.js       # Near-miss, LDW detection
│   └── useRevealState.js         # Controls truth panel unlock timing
├── utils/
│   ├── probability.js            # Weighted random, RTP maths
│   └── projections.js            # Lifetime loss calculations
└── App.jsx
```

---

## Work split

Both of you are full-stack. Split is by component ownership, not by discipline. Each person owns a feature end-to-end — logic, UI, and state — on their own branch, merging at the checkpoints below.

### Branching convention

```
main
├── feature/slot-machine        # You
├── feature/truth-panel         # Dan
├── feature/end-screen          # You
└── feature/layout-and-shared   # Dan
```

PRs into main at each integration checkpoint. No direct pushes to main.

---

### You — `feature/slot-machine` + `feature/end-screen`

Full ownership of the slot machine and the end screen — logic and UI both.

**Slot machine**
- [ ] `useGameEngine.js` — weighted random, RTP logic, balance tracking
- [ ] `useTrickDetector.js` — near-miss detection, LDW detection, sunk cost nudge trigger
- [ ] `probability.js` + `projections.js` — all maths utilities
- [ ] `Reels.jsx` — reel animation (Framer Motion), symbol mapping
- [ ] `SpinButton.jsx` — bet controls, disabled states
- [ ] `ResultMessage.jsx` — win/loss/LDW message display

**End screen**
- [ ] `EndScreen.jsx` — full session summary layout
- [ ] `TrickList.jsx` — breakdown of all tricks detected
- [ ] `LifetimeProjection.jsx` — projection table with computed values
- [ ] Wire `sessionData` out of game engine into end screen

---

### Dan — `feature/truth-panel` + `feature/layout-and-shared`

Full ownership of the truth panel and all shared scaffolding.

**Truth panel**
- [ ] `useRevealState.js` — spin-count-based unlock logic
- [ ] `TruthPanel.jsx` — parent, manages which cards are visible
- [ ] `StatCard.jsx` — reusable metric card component
- [ ] `TrickCard.jsx` — trick reveal card with fade-in transition
- [ ] `Notification.jsx` — single bottom toast, queue system, auto-dismiss
- [ ] Recharts integration for probability graph

**Shared scaffolding**
- [ ] `Layout.jsx` — two-column grid wrapper
- [ ] CSS files + global styles (`index.css`, component-level `.module.css`)
- [ ] Sound design — win sounds loud, loss silent
- [ ] Vercel deploy setup

---

## Coordination

- [ ] **Hour 0–1:** Before splitting, agree the shared interface in writing. Specifically: what does `sessionData` look like, and what props does `TruthPanel` expect. Commit a `contracts.js` file to main with these as plain JS objects — both branches import from it.
- [ ] **Hour 6:** First merge checkpoint. Slot machine spins and emits `sessionData`. Truth panel renders with dummy data. Integration doesn't need to be wired yet — just confirm both compile cleanly together.
- [ ] **Hour 14:** Feature freeze. Both branches merge to main. No new features after this — only fixes.
- [ ] **Hour 20–22:** Polish + bug fixes on main together.
- [ ] **Hour 22–24:** Demo script, presentation prep, Vercel deploy.

---

## The pitch structure (3 min)

1. **Hook (20s):** Open the app. Spin a few times. Let it look like a normal casino.
2. **The reveal (60s):** Keep spinning. Show the truth panel waking up. Point out the near-miss notification, the LDW card.
3. **End screen (40s):** Trigger the summary. Let the lifetime projection land.
4. **The argument (60s):** "This is what every casino already knows about you. We just showed you."
5. **Close (20s):** The bending spoons angle — we took the tool of manipulation and bent it into a tool of awareness.

---

## Key design rules (do not compromise these)

- Truth panel tone is **clinical, not preachy**. Numbers over adjectives. "73p per £1 bet" not "you're being manipulated."
- **One notification at a time.** Never two truth cards appearing simultaneously.
- The game stays **full size at all times**. Truth panel is a sidebar, never an overlay.
- **Progressive reveal is sacred.** Spins 1–5 must feel like a normal casino. The betrayal only lands if you trusted it first.
