module.exports = {
  /*
  ** Headers of the page
  */
  modules: [
    // Simple usage
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
 ],
 apollo : {
   clientConfigs: {
     default: '~/apollo/client-configs/default.js'
   }
 },
  head: {
    title: 'meduim',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: ' A Simple Meduim' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ],
  },
  css: [
    './assets/style/main.stylus'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  // Plugins 
  plugins: [
    // Vee Valdiate
    { src: '~/plugins/VeeValidate.js'},
    // Moment 
    { src: '~/plugins/moment.js' },
    { src: '~/plugins/fetchPostTextLimit.js' }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['axios']
  }
}
