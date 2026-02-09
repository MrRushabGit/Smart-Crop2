# 🚀 Quick Deployment Guide

## Fastest Way: Vercel (2 minutes)

### Option A: Using Vercel Dashboard (No CLI needed)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**
6. Done! Your site is live 🎉

### Option B: Using Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts, done!
```

---

## Second Fastest: Netlify (3 minutes)

### Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub and select your repo
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Click **"Deploy site"**
6. Done! Your site is live 🎉

### Using Netlify CLI

```bash
cd frontend
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

---

## Build First (Required for all platforms)

```bash
cd frontend
npm install
npm run build
```

This creates the `dist` folder with production files.

---

## Which Platform Should I Choose?

| Platform | Best For | Setup Time | Free Tier |
|----------|----------|------------|-----------|
| **Vercel** | Quick demos, best performance | 2 min | ✅ Yes |
| **Netlify** | Easy deployment, forms | 3 min | ✅ Yes |
| **GitHub Pages** | Free, integrated with GitHub | 5 min | ✅ Yes |
| **Firebase** | Google services integration | 5 min | ✅ Yes |

**Recommendation:** Start with **Vercel** - it's the fastest and easiest!

---

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on all platforms.

