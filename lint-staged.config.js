module.exports = {
  "{components,hooks,lib,pages}/**/*.{js,jsx,ts,tsx}": "eslint --fix",
  "{components,hooks,lib,pages}/**/*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit"],
};
