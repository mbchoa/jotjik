module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        hamburger: '48px auto 96px',
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
    },
  },
  plugins: [],
};
