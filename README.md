# Creador IA Hub

Frontend React + Vite for a content-creation platform, deployed automatically to GitHub Pages.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add the Supabase project URL and publishable (anon) key to `.env`.
4. Run `npm run dev`.

`VITE_SUPABASE_PUBLISHABLE_KEY` is designed for browser use. Never add a Supabase `service_role` key, passwords, or personal access tokens to `.env` files that will be committed or to client-side source code.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the site after each push to `main`.

In the repository, go to **Settings → Pages** and set the publishing source to **GitHub Actions**. The deployed site will use the repository path `/creador-ia-hub/`.

For a deployed build that connects to Supabase, add these repository secrets under **Settings → Secrets and variables → Actions**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
