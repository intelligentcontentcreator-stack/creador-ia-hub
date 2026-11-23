# Creador IA Hub

Frontend React + Vite for a content-creation platform.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add the Supabase project URL and publishable (anon) key to `.env`.
4. Run `npm run dev`.

`VITE_SUPABASE_PUBLISHABLE_KEY` is designed for browser use. Never add a Supabase `service_role` key, passwords, or personal access tokens to `.env` files that will be committed or to client-side source code.
