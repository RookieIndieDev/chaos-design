module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
    	fill:['hover','focus'],
      stroke:['hover', 'focus'],
      boxShadow: ['active'],
    }
  },
  plugins: [],
}
