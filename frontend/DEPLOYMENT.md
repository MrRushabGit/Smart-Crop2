# Deployment Guide - Smart Crop Advisory Frontend

This guide covers multiple ways to host your React + Vite application.

## Prerequisites

1. **Build the production version:**
```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with optimized production files.

---

## 🚀 Hosting Options

### Option 1: Vercel (Recommended - Easiest)

**Best for:** Quick deployment, automatic HTTPS, free tier

#### Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Follow the prompts:**
   - Login to Vercel (or create account)
   - Confirm project settings
   - Deploy!

4. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder
   - Deploy!

**Your site will be live at:** `https://your-project.vercel.app`

---

### Option 2: Netlify

**Best for:** Easy deployment, form handling, free tier

#### Steps:

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build and deploy:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

3. **Or use Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repo
   - Build settings:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/dist`
   - Deploy!

**Your site will be live at:** `https://your-project.netlify.app`

---

### Option 3: GitHub Pages

**Best for:** Free hosting, integrated with GitHub

#### Steps:

1. **Install gh-pages package:**
```bash
cd frontend
npm install --save-dev gh-pages
```

2. **Update package.json:**
Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

3. **Update vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repo name
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to your GitHub repo → Settings → Pages
   - Source: `gh-pages` branch
   - Save

**Your site will be live at:** `https://yourusername.github.io/your-repo-name`

---

### Option 4: Firebase Hosting

**Best for:** Google services integration, free tier

#### Steps:

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Initialize:**
```bash
cd frontend
firebase init hosting
```
   - Select existing project or create new
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build and deploy:**
```bash
npm run build
firebase deploy
```

**Your site will be live at:** `https://your-project.web.app`

---

### Option 5: Render

**Best for:** Simple deployment, free tier

#### Steps:

1. Go to [render.com](https://render.com)
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Settings:
   - **Name:** Your project name
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
5. Deploy!

**Your site will be live at:** `https://your-project.onrender.com`

---

### Option 6: Traditional Web Hosting (cPanel, etc.)

**Best for:** Existing hosting account

#### Steps:

1. **Build the project:**
```bash
cd frontend
npm run build
```

2. **Upload files:**
   - Upload ALL contents of the `dist` folder
   - Upload to your `public_html` or `www` directory

3. **Configure:**
   - Ensure your hosting supports SPA (Single Page Apps)
   - May need `.htaccess` file for Apache (see below)

4. **Create `.htaccess` file in dist folder:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 📝 Quick Deployment Checklist

- [ ] Run `npm install` in frontend directory
- [ ] Test locally with `npm run dev`
- [ ] Build production version: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Choose hosting platform
- [ ] Deploy following platform-specific steps
- [ ] Test deployed site
- [ ] Update any API endpoints if needed (for future backend integration)

---

## 🔧 Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (should be 16+)

### Routing Issues (404 on refresh)
- Ensure your hosting supports SPA routing
- Add redirect rules (see GitHub Pages or traditional hosting sections)

### Environment Variables
If you need environment variables later:
1. Create `.env` file in frontend directory
2. Access with `import.meta.env.VITE_YOUR_VAR`
3. Add `.env` to `.gitignore`
4. Configure in hosting platform's environment settings

---

## 🌐 Recommended for This Project

**For quick demo:** Vercel or Netlify (easiest, 5 minutes)

**For production:** Vercel (best performance) or Netlify (great features)

**For free long-term:** GitHub Pages or Firebase Hosting

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

