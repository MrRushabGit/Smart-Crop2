## Packages
framer-motion | Page transitions, animated cards, and smooth micro-animations for the premium SaaS feel
recharts | Animated charts and data visualization for the User and Admin dashboards

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

The backend API contract is defined in `@shared/routes`.
All interactions with the API use `credentials: 'include'` for session-based authentication.
