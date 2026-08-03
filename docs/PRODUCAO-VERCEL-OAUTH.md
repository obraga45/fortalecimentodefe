# Produção (Vercel + Supabase + OAuth)

## 1. Variáveis na Vercel

No projeto Vercel: **Settings → Environment Variables**.

Adiciona para **Production** (e **Preview**, se quiseres login nos previews):

| Nome | Valor |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto em Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave **anon** `public` (mesma página) |

Copia os mesmos valores do teu `.env.local` local.

Depois de gravar: **Deployments → Redeploy** o último deployment.

---

## 2. URLs no Supabase (obrigatório para login em produção)

Supabase Dashboard → teu projeto → **Authentication → URL Configuration**

- **Site URL:** `https://fortalecimentodefe.pt` (ou o domínio final)
- **Redirect URLs:**
  - `https://fortalecimentodefe.pt/**`
  - `https://www.fortalecimentodefe.pt/**` (se usares `www`)
  - `https://*.vercel.app/**` (opcional, previews)

---

## 3. Google OAuth

**Supabase:** Authentication → Providers → Google → Client ID + Secret

**Google Cloud:** OAuth client (Web)

- **Redirect URI:** `https://SEU_PROJECT_REF.supabase.co/auth/v1/callback`
- **JavaScript origins:** `https://fortalecimentodefe.pt`, `https://SEU_PROJECT_REF.supabase.co`

---

## 4. Facebook OAuth

**Supabase:** Authentication → Providers → Facebook → App ID + Secret

**Meta:** Facebook Login → Valid OAuth Redirect URIs:

- `https://SEU_PROJECT_REF.supabase.co/auth/v1/callback`

App em modo **Live** para utilizadores reais.

---

## 5. Testar

Janela anónima → Entrar → Google/Facebook → voltar autenticado.

Credenciais Google/Facebook ficam no **Supabase**, não na Vercel.
