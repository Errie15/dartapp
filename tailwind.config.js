/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'black-rich': 'var(--black-rich)',
        'black-charcoal': 'var(--black-charcoal)',
        'black-smoke': 'var(--black-smoke)',
        'red-crimson': 'var(--red-crimson)',
        'red-burgundy': 'var(--red-burgundy)',
        'red-wine': 'var(--red-wine)',
        'gold-accent': 'var(--gold-accent)',
        'gold-light': 'var(--gold-light)',
        'cream': 'var(--cream)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        'luxury': '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        'luxury-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'button': '0 4px 6px rgba(0, 0, 0, 0.2)',
        'button-hover': '0 8px 15px rgba(0, 0, 0, 0.25)',
        'inner-glow': 'inset 0 0 10px rgba(220, 20, 60, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(220, 20, 60, 0.6)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.6)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(145deg, var(--black-charcoal), var(--black-smoke))',
        'gradient-gold': 'linear-gradient(45deg, var(--gold-accent), #f5dd95)',
        'gradient-red': 'linear-gradient(45deg, var(--red-crimson), var(--red-burgundy))',
        'gradient-dark': 'linear-gradient(to bottom, var(--black-rich), var(--black-charcoal))',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
        'gradient-button': 'linear-gradient(to right, var(--red-crimson), var(--red-burgundy))',
        'gradient-gold-button': 'linear-gradient(to right, var(--gold-accent), var(--gold-light))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'glow': 'glow 2s infinite',
      },
      transitionDuration: {
        '400': '400ms',
      },
      borderRadius: {
        'xl': 'var(--border-radius-xl)',
        'lg': 'var(--border-radius-lg)',
        'md': 'var(--border-radius-md)',
        'sm': 'var(--border-radius-sm)',
      },
      spacing: {
        'container': 'var(--container-padding)',
        'section': 'var(--section-spacing)',
        'card': 'var(--card-spacing)',
        'element': 'var(--element-spacing)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      maxWidth: {
        'content': '65ch',
        'container': '1200px',
      },
      zIndex: {
        'negative': '-1',
        'deep': '-10',
      },
      gridTemplateColumns: {
        'auto-fill-card': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
};
