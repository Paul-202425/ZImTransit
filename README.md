# ZimTransit — Smart Bus Ticketing System (Prototype)

A web-based **digital prototype** for Zimbabwe’s public transport: commuters use **smart travel cards**, **conductors** collect fares on board, **hub agents** register cards and sell tickets at stations, and **administrators** view network analytics. This repository supports coursework submission: it includes **clear setup instructions**, pointers for **SRS alignment**, and the **submission links** below.

---

## Submission links

| Item | Link |
|------|------|
| **GitHub repository** (public) | [https://github.com/Paul-202425/ZImTransit](https://github.com/Paul-202425/ZImTransit) |
| **README on GitHub** | [https://github.com/Paul-202425/ZImTransit/blob/main/README.md](https://github.com/Paul-202425/ZImTransit/blob/main/README.md) |
| **SRS document** | [Open SRS (Google Doc)](https://docs.google.com/document/d/1M9UvcJ2zxrMLRYsDdIiQJnnSlhJlVQt67pltBzZ0AYs/edit?tab=t.0#heading=h.gjdgxs) |
| **Google Doc** (summative: `PaulMasamvu_[Summative]_[03/29/2026]`) | [Open summative Google Doc](https://docs.google.com/document/d/1JKJIv2ixVR82bTEWlAR2xLgBnmD86Wd9gGy2h91q7XQ/edit?usp=sharing) — **video**, **repo**, **SRS**, and **live app** links here per instructions |
| **Self-recorded video** (5–10 minutes) | [Watch on YouTube](https://youtu.be/xlko26RZ-hM) — also link [summative Google Doc](https://docs.google.com/document/d/1JKJIv2ixVR82bTEWlAR2xLgBnmD86Wd9gGy2h91q7XQ/edit?usp=sharing) per course instructions |
| **Local app (development only)** | [http://localhost:3000/](http://localhost:3000/) — use after `npm run dev` on your machine |
| **Publicly accessible app URL** (for grading) | **Add after deployment** — e.g. Vercel/Netlify (see [§12](#12-public-url-deployment--coursework-requirement)). `localhost` only works on **your** computer and is **not** reachable from the internet, so it does **not** satisfy the “public URL” requirement by itself. |

> **Important:** Set sharing on the **Google Doc** and **SRS** so anyone with the link can **view**. Broken or permission-locked links may receive **0** for link-related criteria.

---

## 1. Description of the system

**ZimTransit** is a **single-page application (SPA)** built with **React**, **TypeScript**, and **Vite**. It simulates a smart ticketing ecosystem branded **“Go Zimbabwe”**:

- **Passengers** hold a virtual smart card: they can register a card, top up, simulate **tap-to-pay** on a bus, and see recent activity.
- **Conductors** use a **card scanner simulation** to deduct a fare for a selected card and see same-day passenger and revenue stats for their bus.
- **Hub agents** register new commuters, search for cards, process top-ups, sell route-based **cash tickets**, and see recent hub transactions.
- **Administrators** see aggregate metrics (revenue, passengers, cards, top-ups), a transaction log, and **route-level** usage indicators.

Data is stored **in the browser** (via **Zustand** + **localStorage** under the key `smart-bus-storage`). There is **no real server or payment gateway** in this prototype; it is suitable for **demonstration and usability** evaluation, not production payments.

---

## 2. Problem statement

Public bus systems often rely on **cash fares**, which slows boarding, increases **revenue leakage**, and makes **reporting** difficult. Commuters may lack a **single, reusable** way to pay, and operators lack **timely visibility** into usage across routes and hubs.

---

## 3. Why is it a problem?

- **Operational:** Counting cash on moving vehicles is error-prone and time-consuming.
- **Financial:** Without digital records, **reconciliation** and **fraud detection** are harder.
- **User experience:** Carrying exact change and queuing to pay delays trips.
- **Planning:** Without structured transaction data, **route performance** and demand are hard to analyze.

---

## 4. Proposed solution

This prototype implements a **unified digital workflow**:

| Idea | How the prototype reflects it |
|------|-------------------------------|
| **Stored-value smart cards** | Cards have balances; fares reduce balance; top-ups increase it. |
| **Role-based interfaces** | Separate screens for Passenger, Conductor, Hub Agent, and Admin. |
| **Auditable transactions** | Each action creates a record (top-up, fare, ticket) with type, amount, and context (e.g. route where applicable). |
| **Operational insight** | Admin dashboard aggregates revenue, passenger/ticket counts, and route-related activity. |

The design maps to typical **SRS** actors (commuter, conductor, agent, admin) and **system design** processes (registration, top-up, fare collection, ticket sale, reporting).

---

## 5. Actors and main processes (for SRS / system design alignment)

| Actor | Primary processes in the app |
|-------|------------------------------|
| **Passenger / Commuter** | Create digital card; choose active card when multiple exist; quick top-up; tap-to-pay simulation; view recent trips. |
| **Conductor** | Select card; simulate NFC scan; deduct fare; view today’s passengers and revenue for the simulated bus. |
| **Hub agent** | Register new card; search card by ID or name; process top-up; sell tickets by route; view recent hub sales. |
| **Administrator** | View dashboard KPIs; browse system transaction log; view route performance indicators. |

**Entry / navigation:** Open `/auth` for a **landing screen** with shortcuts to Passenger, Agent, Conductor, and Admin. The app also uses a **sidebar / bottom nav** on other pages for routing.

---

## 6. Alignment with prototype requirements (checklist for your demo video)

Use this checklist when recording your **5–10 minute** video:

- [ ] **Describe** the system and **who** it is for.
- [ ] State the **problem** and **why** it matters.
- [ ] Explain the **proposed solution** at a high level.
- [ ] **Walk through the demo:** Auth entry → Passenger → Hub Agent → Conductor → Admin (or an order that matches your SRS).
- [ ] Show that the prototype reflects **SRS** requirements and **system design** actors/processes **as implemented** (call out anything intentionally out of scope, e.g. no real bank API).
- [ ] Mention **login/signup** if your SRS requires them: this build uses a **role picker** on `/auth` rather than real authentication; adjust your SRS wording or extend the app if your document mandates full auth.

---

## 7. Technology stack

- **React 19**, **TypeScript**
- **Vite 5** (dev server and build)
- **React Router** (client-side routes)
- **Zustand** (state) + **persist** to `localStorage`
- **Tailwind CSS** + **shadcn/ui** (UI components)
- **Sonner** (toasts), **Framer Motion** (light animations)

---

## 8. Prerequisites

Install **Node.js** (LTS recommended). This project is tested with **npm**.

Optional: **Bun** is listed as `packageManager` in `package.json`; **npm** is sufficient for all commands below.

---

## 9. Local setup — follow every step

### Step 1 — Get the code

- Clone your **public** GitHub repository, **or** unzip the project folder.

```bash
git clone https://github.com/Paul-202425/ZImTransit.git
cd ZImTransit
```

### Step 2 — Install dependencies

From the **project root** (the folder that contains `package.json`):

```bash
npm install
```

Wait until the command finishes with no errors.

### Step 3 — Start the development server

```bash
npm run dev
```

You should see Vite report a **local URL**. By default this project runs on **port 3000**.

### Step 4 — Open the app in a browser

- **Local:** [http://localhost:3000](http://localhost:3000)
- **On your LAN:** Vite is started with `--host 0.0.0.0`, so another device on the same network may use the “Network” URL printed in the terminal (useful for phone demos).

### Step 5 — Suggested click path (verify everything works)

1. Go to [http://localhost:3000/auth](http://localhost:3000/auth) (or use navigation).
2. **Passenger:** create or select a card, top up, **Tap to pay**.
3. **Hub agent:** register a card, search, top up, sell a **ticket** on a route.
4. **Conductor:** pick a card, run **Tap Card Now**.
5. **Admin:** confirm metrics and the **system log** update.

Data persists in the browser until you clear site data or remove the `smart-bus-storage` key.

---

## 10. Other useful commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally (after `build`) |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |

---

## 11. Troubleshooting

| Issue | What to try |
|-------|-------------|
| **Port 3000 already in use** | Stop the other app, or run Vite on another port: `npx vite --host 0.0.0.0 --port 5173` |
| **`npm` errors after clone** | Delete `node_modules` and run `npm install` again. Use a current LTS Node.js. |
| **Stale or confusing data** | Clear site data for `localhost` or remove **Local Storage** key `smart-bus-storage`. |
| **Windows PowerShell** | Use the commands as written; this README’s `dev` script uses `vite --port 3000` (no Unix-style `PORT=3000`). |

---

## 12. Public URL (deployment) — coursework requirement

Graders expect a **publicly accessible** URL for web projects. Typical options:

1. **Vercel** or **Netlify:** Connect the GitHub repo; set **build command** `npm run build` and **output directory** `dist`.
2. **GitHub Pages:** Requires base-path configuration if the app is not served from the domain root; SPA redirects may need a `_redirects` or `404.html` workaround.

After deployment, put the **production URL** in your Google Doc and in the **Submission links** table at the top of this README.

---

## 13. Project structure (overview)

```
src/
  App.tsx              # Routes and layout
  main.tsx             # Entry
  pages/               # Passenger, Conductor, HubAgent, Admin, Auth
  store/useStore.ts    # Global state + persistence
  lib/types.ts         # Domain types (cards, transactions, routes, tickets)
  lib/mockData.ts      # Initial routes and sample data
  components/          # Navigation, UI primitives
```

---

## 14. Academic integrity and attribution

This prototype was developed as part of a **software development lifecycle** summative. If you use this README template, **replace** placeholder links and **ensure** your video, SRS, and deployed app match what you submit on **Canvas** by the due date (**28 March 2026** per your brief).

---

## License

Specify your license here (e.g. MIT) or your institution’s requirements.
