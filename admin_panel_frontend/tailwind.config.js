/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        sidebar: "var(--sidebar-bg)",
        sidebarBorder: "var(--sidebar-border)",
        text: "var(--text)",
        heading: "var(--heading)",
        hoverText: "var(--hover-text)",
        hoverBg: "var(--hover-bg)",
        border: "var(--border)",
        cardBg: "var(--card-bg)",
        cardText: "var(--card-text)",
        primary: "var(--primary)",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
