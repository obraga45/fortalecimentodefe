# Produção (Vercel + Supabase + OAuth)

Domínio de produção: **https://www.fortalecimentodefe.pt**  
Project ref Supabase: **aapqfhwnkdiupqolnbma**

---

## 1. Variáveis na Vercel

**Settings → Environment Variables** (Production + Preview, se quiseres):

| Nome | Valor |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aapqfhwnkdiupqolnbma.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | igual ao `.env.local` (anon public) |

Guardar → **Deployments → Redeploy**.

(O Google/Facebook **não** entram na Vercel — ficam no Supabase + consolas Google/Meta.)

---

## 2. Supabase — URL Configuration

**Authentication → URL Configuration**

- **Site URL:** `https://www.fortalecimentodefe.pt`
- **Redirect URLs** (mantém localhost se ainda desenvolves localmente):

```
https://www.fortalecimentodefe.pt/**
https://fortalecimentodefe.pt/**
http://localhost:3000/**
https://*.vercel.app/**
```

Inclui **com e sem `www`** para quem entrar pelo domínio raiz.

---

## 3. Google Cloud (mesmo client que já usavas no localhost)

**APIs & Services → Credentials → OAuth 2.0 Client (Web)**

**Authorized JavaScript origins** — adiciona (não removas `http://localhost:3000`):

```
https://www.fortalecimentodefe.pt
https://fortalecimentodefe.pt
https://aapqfhwnkdiupqolnbma.supabase.co
```

**Authorized redirect URIs** — deve existir **só** (igual em local e produção):

```
https://aapqfhwnkdiupqolnbma.supabase.co/auth/v1/callback
```

No **Supabase → Authentication → Providers → Google**, Client ID/Secret continuam os mesmos.

---

## 4. Facebook / Meta (mesma app)

**Facebook Login → Settings → Valid OAuth Redirect URIs:**

```
https://aapqfhwnkdiupqolnbma.supabase.co/auth/v1/callback
```

**Settings → Basic → App Domains:**

```
fortalecimentodefe.pt
www.fortalecimentodefe.pt
```

**Site URL** (Basic): `https://www.fortalecimentodefe.pt`

Para utilizadores reais: app em modo **Live** (não só Development).

Supabase → Providers → Facebook: mesmos App ID / Secret.

---

## 5. Vercel + my.dominios

- Domínio principal na Vercel: `www.fortalecimentodefe.pt` (como indicaste).
- Recomendado: redireccionar `fortalecimentodefe.pt` → `www` (Vercel → Domains → redirect).

---

## 6. Testar

1. Janela anónima → `https://www.fortalecimentodefe.pt`
2. **Entrar** → Google ou Facebook
3. Deves voltar a `https://www.fortalecimentodefe.pt` com sessão (nome no botão)

| Erro | O que corrigir |
|------|----------------|
| `redirect_uri_mismatch` | Redirect URI Google/Facebook = callback Supabase acima |
| Login abre e fecha sem sessão | Redirect URLs no Supabase (secção 2) |
| Site sem posts / auth estranho | Env vars Vercel + redeploy |

---

## Localhost vs produção

Como Google/Facebook já funcionavam em `localhost`, em geral **só faltam** as URLs de produção (secções 2 e 3) e as env vars na Vercel. Não precisas de criar novos clients OAuth.
