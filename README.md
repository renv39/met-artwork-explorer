# Met Artwork Explorer

A full stack web application for searching, browsing, and saving artwork from the Metropolitan Museum of Art's public collection. Features user registration and login with JWT authentication, persistent favourites and search history per user, advanced search with multiple filters, and deployment to Vercel.

## Demo

![The Metropolitan Museum of Art](https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg/1280px-Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg)

> **Live:** [met-artwork-explorer.vercel.app](https://met-artwork-explorer.vercel.app/)

**Register** an account, **log in**, then try the **navbar search** (e.g. *"monet"*) or **Advanced Search** to filter by medium, location, and more. **Save favourites** and revisit past queries from your **history**.

## Learning Outcomes

- Building and consuming a **third-party public API** (Metropolitan Museum of Art Collection API)
- Designing a **secure REST API** with JWT authentication using Passport.js
- Implementing **user registration and login** with password validation and token management
- Managing **shared application state** across components using **Jotai** (atomic state management)
- Persisting **user-specific data** (favourites, search history) in MongoDB via authenticated API calls
- Creating a **route guard** component to protect pages from unauthenticated access
- Building **reusable React components** for artwork display, shared across multiple views
- Implementing **paginated search results** by chunking API data into a 2D array
- Using **React Hook Form** for complex query construction with validation
- Filtering API results against a **valid object ID list** (480,000+ IDs) to eliminate bad data
- **Deploying** a Node.js API and Next.js app to cloud platforms

## Technologies

- React / Next.js (Pages Router)
- Node.js / Express
- MongoDB Atlas / Mongoose
- JWT (jsonwebtoken) / Passport.js / passport-jwt
- Jotai (state management)
- SWR (data fetching)
- React Hook Form
- React-Bootstrap / Bootstrap 5
- Vercel (deployment)
- Metropolitan Museum of Art Collection API

## My Responsibilities

### Search & Display

- Built the **navbar search** — form submission constructs a query string and redirects to `/artwork?title=true&q=...`
- Implemented **ArtworkCard** component — fetches individual artwork data via SWR, displays image with placeholder fallback, title, date, classification, medium, and links to detail view
- Implemented **ArtworkCardDetail** component — extended card with artist name, credit line, dimensions, and Wikidata link
- Built the **Artwork page** — parses query strings from the URL, passes them to the Met API, chunks returned objectIDs into pages of 12, and renders a paginated grid of artwork cards
- Built the **Advanced Search page** with React Hook Form — fields for search query (required, validated), search by category, geo location, medium, on view, and highlight filters
- Built the **Home page** with museum image and description
- Built **dynamic route** (`/artwork/[objectID]`) for individual artwork detail views

### State Management

- Created `favouritesAtom` and `searchHistoryAtom` in a shared Jotai store
- **Favourites system:** toggle button on ArtworkCardDetail to add/remove artwork, dedicated `/favourites` page displaying all saved artwork as cards
- **Search history system:** both navbar and advanced search record queries to the history atom, `/history` page parses stored queries into readable key-value pairs, supports click-to-rerun and delete
- Used CSS Modules for component-scoped hover styling on history list items

### Data Integrity & UX Fixes

- **Fixed invalid objectID problem** — downloaded the full valid ID list (480,000+ entries) from the Met API and filtered search results by computing the intersection before rendering
- **Fixed mobile navbar** — added `isExpanded` state to programmatically collapse the navbar on link clicks, form submissions, and toggle interactions
- **Fixed navbar active state** — used `router.pathname` to correctly highlight the current page

### Authentication (User API — Backend)

- Created a **MongoDB database** on Atlas for user data
- Configured **Passport.js** with a JWT strategy using environment-variable secrets
- Implemented **`POST /api/user/login`** — validates credentials, signs a JWT payload with `_id` and `userName`, returns token
- **Protected 6 routes** with `passport.authenticate()` middleware for favourites and history CRUD

### Authentication (Next.js — Frontend)

- Created the **authenticate library** (`lib/authenticate.js`) — `setToken`, `getToken`, `removeToken`, `readToken`, `isAuthenticated`, `authenticateUser`, `registerUser`
- Created the **userData library** (`lib/userData.js`) — 6 async functions for favourites and history CRUD, each sending authenticated requests with JWT Authorization headers
- Built **Login page** — form with error alerts, hydrates Jotai atoms from the API on successful login
- Built **Register page** — form with password confirmation, redirects to login on success
- Implemented **RouteGuard component** — checks auth on every route change, redirects unauthenticated users to `/login`, hydrates atoms from API on mount (fixes data loss on page refresh)
- Updated **navbar** to conditionally render based on auth state: logged in shows search, dropdown with favourites/history/logout; logged out shows register and login links
- Updated all favourites and history interactions to use **persistent API calls** instead of local-only state

### Deployment

- Deployed the User API to a cloud hosting platform with environment variables configured
- Deployed the Next.js app to **Vercel** with production environment variables

## Development Progression

This app was built incrementally across three development phases:

1. **Search & Display** — Next.js app consuming the Met Museum API with paginated artwork cards, detail views, and advanced search with React Hook Form
2. **State Management** — Added Jotai for global favourites and search history, fixed data integrity issues with invalid objectIDs, improved mobile UX
3. **Authentication & Deployment** — Built a JWT-secured User API, added registration/login, persisted user data in MongoDB, implemented route guards, deployed to Vercel

## Provided Code

- `user-api.zip` — Express server starter with user-service module and route stubs (authentication logic and JWT signing were my responsibility)
- Advanced Search form JSX template (HTML structure only — all logic was mine)
- Valid objectID list JSON from the Met API (downloaded as a static file)
- React-Bootstrap, SWR, Jotai, Passport.js, and jsonwebtoken libraries
- Metropolitan Museum of Art Collection API (public, no auth required)
- Course notes with JWT patterns and RouteGuard examples

## User API

The backend JWT authentication API is in a separate repository: [users-api repo](https://github.com/renv39/users-api)

---

*Built as part of coursework at Seneca Polytechnic — Computer Programming & Analysis*
