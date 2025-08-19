// In: tailwind.config.ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography'; // Import the plugin

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // ...
  },
  plugins: [
    typography, // Use the imported plugin
  ],
};
export default config;