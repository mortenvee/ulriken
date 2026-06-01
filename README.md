# RSVP App - Navnefest for Ulrik Brurok Vee

En enkel RSVP-app for navnefesten, med offentlig skjema og PIN-beskyttet admin-panel.

## Oppsett

### 1. Supabase-databaseoppsett

1. Gå til [supabase.com](https://supabase.com) og opprett en gratis konto
2. Lag et nytt prosjekt (velg "Free" tier)
3. Vent til prosjektet er opprettet, går til "SQL Editor"
4. Kjør denne SQL-kommandoen for å lage tabellen:

```sql
CREATE TABLE rsvp_responses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert" ON rsvp_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read" ON rsvp_responses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can delete" ON rsvp_responses
  FOR DELETE USING (true);
```

5. Gå til "Project Settings" → "API" og kopier:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon` nøkkel under "Project API keys" (VITE_SUPABASE_ANON_KEY)

### 2. Lokalt oppsett

```bash
npm install
```

Lag `.env.local` fil (kopier fra `.env.example`):
```
VITE_SUPABASE_URL=<din supabase URL>
VITE_SUPABASE_ANON_KEY=<din anon key>
```

Kjør lokalt:
```bash
npm run dev
```

### 3. Netlify-deployment

1. Push koden til GitHub
2. Gå til [netlify.com](https://netlify.com)
3. Klikk "Add new site" → "Import an existing project" → velg GitHub
4. I build-innstillinger, sett disse environment variabler:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## Bruk

**For gjester:** Del lenken til siden
**For admin:** Legg `/` til URL-en og klikk "Admin"-knappen, skriv inn PIN: `523152`

## Admin-funksjoner

- Oversikt over statistikk (totalt svar, kommer/kommer ikke, antall voksne/barn)
- Liste over alle svar med allergier
- Slett svar hvis nødvendig
- Realtids-oppdateringer når nye svar kommer
