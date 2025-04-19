# Meco Turborepo

This is a monorepo using [Turborepo](https://turbo.build/) with:
- **Next.js** frontend (latest App Router)
- **FastAPI** backend

## Structure
- `apps/web` — Next.js frontend
- `apps/api` — FastAPI backend

## Getting Started

### Install dependencies
```
npm install
```

### Run both apps in development
```
npm run dev
```

Or run individually:
```
npm run dev:web
npm run dev:api
```

---

- The Next.js app runs at http://localhost:3000
- The FastAPI app runs at http://localhost:8000
