import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Import the v4 plugin

// https://astro.build/config
export default defineConfig({
  integrations: [react()], // React lives here
  vite: {
    plugins: [tailwindcss()], // Tailwind v4 lives here
  },
});