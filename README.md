# TOEFL Ambassador

Portale ufficiale ETS per gestire il programma "TOEFL Ambassador": onboarding di centri partner, iscrizione studenti, dashboard dedicate e checkout Stripe per voucher/activation pack.

## Stack
- [Next.js 16](https://nextjs.org/) con App Router e TypeScript
- Tailwind CSS 4
- Stripe Checkout + Webhook
- Airtable come data layer

## Getting Started
```bash
npm install
npm run dev
```
L&#39;applicazione è disponibile su [http://localhost:3000](http://localhost:3000).

Per verificare la qualità del codice:
```bash
npm run lint
```

## Variabili d&#39;ambiente
Configura le seguenti chiavi (puoi usare `.env.local` in sviluppo):

| Nome | Descrizione |
| --- | --- |
| `AIRTABLE_PERSONAL_TOKEN` | Personal Access Token Airtable |
| `AIRTABLE_BASE_ID` | ID base Airtable `appH2eTP2kgKU3ols` |
| `AIRTABLE_TABLE_CENTERS` | Nome tabella centri (`Centers`) |
| `AIRTABLE_TABLE_CENTER_USERS` | Nome tabella utenti centro (`CenterUsers`) |
| `AIRTABLE_TABLE_STUDENTS` | Nome tabella studenti (`Students`) |
| `AIRTABLE_TABLE_ORDERS` | Nome tabella ordini (`Orders`) |
| `STRIPE_API_KEY` | Secret key Stripe |
| `TOEFL_iBT_Voucher_ID` | Price ID Stripe per il voucher studente |
| `TOEFL_Ambassador_Activation_Pack_ID` | Price ID Stripe per il kit centro |
| `STRIPE_WEBHOOK_SECRET` | Firma webhook Stripe |
| `JWT_SECRET` | Segreto per i token JWT |
| `EMAIL_API_KEY` / `EMAIL_FROM` | Credenziali provider email |
| `NEXT_PUBLIC_CALENDLY_STUDENT_URL` | URL Calendly studenti |
| `NEXT_PUBLIC_CALENDLY_CENTER_URL` | URL Calendly centri |
| `ADMIN_CONTACT_EMAIL` | (Opzionale) email in CC per le richieste centri |

## Struttura principali cartelle
- `src/app/(public)` – pagine pubbliche (home, centri, studenti, sedi e pagine dinamiche dei centri)
- `src/app/(auth)` – flussi di login/signup per studenti e centri
- `src/app/(dashboard)` – dashboard protette di studenti e centri
- `src/app/api` – API (auth, checkout Stripe, Airtable bridge, webhook, contact form)
- `src/lib` – helper per Airtable, Stripe, Auth, Email e repositories
- `src/components` – componenti UI riutilizzabili (CTA, mappe, form)
- `src/content` – testi statici modificabili senza toccare il codice

## Workflow suggerito
1. Configura le variabili d&#39;ambiente e i campi nelle tabelle Airtable.
2. Avvia `npm run dev` per sviluppare localmente.
3. Utilizza le API `/api/auth/*` per registrare o autenticare utenti.
4. Collega Stripe Webhook a `/api/stripe/webhook` per aggiornare automaticamente gli ordini.
