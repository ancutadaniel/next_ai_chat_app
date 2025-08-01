// In: ai-chat-app/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // We leave this empty to use the new v4 CSS variable approach.
  },
  plugins: [
    require('@tailwindcss/typography'), // Add the typography plugin here
  ],
};
export default config;