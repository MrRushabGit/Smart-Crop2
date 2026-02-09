# Smart Crop Advisory - Frontend

A production-ready, premium crop advisory web application frontend built with React, Vite, and Tailwind CSS.

## Features

- 🎨 **Premium UI/UX**: Clean, minimal, and professional design with earthy agricultural colors
- 🔐 **Authentication**: Sign up and login with smooth animations
- 📊 **Crop Analysis**: AI-powered crop health analysis with disease detection
- 📈 **Data Insights**: Comprehensive dataset and feature insights with interactive charts
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ✨ **Smooth Animations**: Subtle, realistic animations using Framer Motion

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Deploy to Production

**Quick Deploy (Recommended):**

1. **Vercel** (Easiest - 2 minutes):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify** (Also Easy):
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

3. **Or use the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

**📖 For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

**Available hosting options:**
- ✅ Vercel (Recommended - Free, Fast)
- ✅ Netlify (Free, Easy)
- ✅ GitHub Pages (Free)
- ✅ Firebase Hosting (Free)
- ✅ Render (Free tier)
- ✅ Traditional Web Hosting

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Navbar.jsx
│   ├── pages/          # Page components
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResultsPage.jsx
│   │   └── InsightsPage.jsx
│   ├── data/           # Mock data
│   │   └── mockData.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Pages

1. **Landing Page** (`/`): Hero section with feature cards
2. **Authentication** (`/auth`): Sign up and login with toggle animation
3. **Dashboard** (`/dashboard`): Input form for location, crop type, and image upload
4. **Results** (`/results`): Crop analysis results with health score and recommendations
5. **Insights** (`/insights`): Dataset information and feature insights with charts

## Mock Data

The application uses mock data for demonstration purposes. All data is generated client-side and stored in localStorage. The structure is designed to easily integrate with a real backend API.

## Design Philosophy

- **Clean & Minimal**: No unnecessary elements, focus on content
- **Earthy Colors**: Agricultural theme with greens, browns, and soft grays
- **Subtle Animations**: Smooth, realistic micro-interactions
- **Professional**: Production-ready UI suitable for investor demos

## Future Backend Integration

The codebase is structured to easily integrate with a backend API:

- Replace mock data functions in `mockData.js` with API calls
- Update authentication logic in `App.jsx` to use real auth endpoints
- Connect image upload in `Dashboard.jsx` to file upload API
- Replace localStorage with API calls for results storage

## License

This project is part of the Smart Crop Advisory system.

