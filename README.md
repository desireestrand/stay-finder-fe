# StayFinder (frontend)

Web frontend for **StayFinder**, an Airbnb-like service where users can list places to stay and book them.
Built with Next.js (App Router), React and TypeScript. It talks to the StayFinder API and has no direct access to the database.

- Backend repository (API and database setup): [Link](https://github.com/desireestrand/stay-finder-be)
- Frontend repository: [Link](https://github.com/desireestrand/stay-finder-fe)

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19
- TypeScript (`strict`)
- [Tailwind CSS](https://tailwindcss.com) 4

## Getting started

### 1. Prerequisites

- Node.js 20 or newer
- The **backend running** on <http://localhost:3000>. Follow the setup in the backend README first (Supabase project, `stayfinder_setup.sql`, `.env`).

### 2. Configure the environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the StayFinder API, for example `http://localhost:3000` |

### 3. Install and run

The backend uses port 3000, so run the frontend on port 3001:

```bash
npm install
npm run dev -- -p 3001
```

Open <http://localhost:3001>.

The port matters. The API only accepts requests (and cookies) from the origin set in `FRONTEND_URL` in the backend `.env`, which defaults to `http://localhost:3001`. If you use another port, change `FRONTEND_URL` to match.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks the whole project) |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Pages

| Route | What it shows | Login |
|---|---|---|
| `/` | All properties with filters, sorting and a search by available dates | no |
| `/properties/kind/[kind]` | Properties of one kind (apartment, villa or cabin) | no |
| `/properties/[propertyId]` | Property details. Book it, or manage it if you are the owner | no (booking needs login) |
| `/properties/[propertyId]/edit` | Edit a property (owner) | yes |
| `/properties/[propertyId]/bookings/[bookingId]/edit` | Edit a booking | yes |
| `/host/properties/new` | List a new property | yes |
| `/profile` | My bookings, my properties and incoming bookings (confirm, cancel, delete) | yes |
| `/auth/login`, `/auth/signup` | Log in, create an account | no |

## How it works

**Authentication.** The API stores the session in an `httpOnly` cookie, so the frontend never sees the token. Every request uses `credentials: "include"` so the browser sends the cookie. `AuthContext` calls `GET /auth/me` on load, which keeps the user logged in after a reload. `UserMenu` and `PageWrapper` use it to change the navigation and to redirect from protected pages.

**Data fetching.**
- The property list and the detail page are server components that call the API with `cache: "no-store"`.
- Forms, the profile page and the filter are client components.
- All API calls live in `src/utils/*Service.ts`. They throw an `Error` on failure.

**Filters and sorting.** The filter form writes to the URL (`?city=...&max_price=...&sort_by=...&start_date=...`). `PropertyList` reads the URL and passes it to the API, so filtering, sorting and the available-dates search all happen in the backend.

**Errors.** `parseErrorResponse` in `src/utils/error.ts` turns any API error (validation errors and rule errors alike) into one text, which `ErrorMessage` shows in the form. Examples: "The property is already booked for the selected dates" or "Number of guests exceeds the maximum capacity of the property".

**Booking form.** It shows the number of nights and a total price while you pick dates. That is only a preview. The real price is calculated and stored by the database when the booking is made, so the lists show the saved `total_price`.

**Rules are not enforced here.** The interface hides actions that are not allowed (for example the Confirm button for guests, or Edit for past bookings), but the real checks are in the API and the database. The frontend only shows the result.

**Images.** Property images use `next/image` with `unoptimized`, so a property can use any image URL.

## Project structure

```
src/
  app/            Routes (App Router): pages, loading.tsx, error.tsx, not-found.tsx
  components/     UI components (forms, cards, filter, menu, profile tabs)
  contexts/       AuthContext: the logged-in user
  utils/          API services (auth, property, booking), error parsing, helpers
  types/          Database types and derived types
```

## Database types

`src/types/database.types.d.ts` is generated from the database. Regenerate it after changing the database (the command is in the backend README).

## Notes

- The frontend has no Supabase key. It only talks to the API.
- Do not commit `.env.local`.