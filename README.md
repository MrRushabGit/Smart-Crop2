# 🌾 Agri-Tech SaaS (Smart-Crop)

Welcome to our Agri-Tech SaaS project! We built this platform to empower farmers and agricultural enthusiasts with data-driven insights. 

## 🌱 How We Started
We realized that farmers often lack access to timely, accurate recommendations for which crops to plant based on their specific soil and environmental conditions. Additionally, recognizing plant diseases early on can be incredibly challenging yet crucial for a successful harvest. 

We set out to create a solution that not only advises on the best crops but also predicts plant diseases, helping users mitigate risks and maximize their yields. Our goal is to bring modern machine learning and statistical insights right to the fingertips of the people working the land.

## ✨ How It Works
The platform features an intuitive, fast, and modern interface where users can input environmental factors (like soil nutrients, weather, moisture, etc.). Based on this data, the application:
1. **Recommends the best crop** suited for those specific conditions.
2. **Predicts potential diseases** that could affect the crop, giving farmers a heads-up on what to look out for.
3. Provides a **confidence score** and detailed metrics so users know exactly the reasoning behind the recommendations.

## 🛠️ How We Built It
This project is built using a modern, robust, full-stack architecture:
- **Frontend:** React with Vite, styled with TailwindCSS, and utilizing a beautiful component library (Radix/shadcn-ui).
- **Backend:** Node.js with Express, providing a fast and scalable API.
- **Database:** PostgreSQL managed through Drizzle ORM to gracefully handle our users' data, predictions, and metrics.
- **Data Visualization:** Recharts to display beautiful, interactive charts for the metrics.

## 🚀 Getting Started Locally

If you'd like to run it locally, follow these steps:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file based on `.env.example` and set up your PostgreSQL database connection.

3. **Database Push:**
   ```bash
   npm run db:push
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

We hope this tool can make a real difference in modern farming, combining the age-old wisdom of agriculture with cutting-edge technology!
