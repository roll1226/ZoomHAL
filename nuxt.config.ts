// const colors = require('vuetify/es5/util/colors')

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */

  manifest: {
    name: "ZoomHAL",
    title: "ZoomHAL",
    lang: 'ja',
    theme_color: "#121212",
    background_color: "#121212",
    display: "standalone",
    orientation: "any",
    start_url: "/"
  },

  head: {
    title: 'ZoomHAL',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'robots',
        content: 'noindex'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'ja'
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/firebase.ts'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa'
  ],

  // workbox: {
  //   dev: true
  // },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3
        // }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config: any, ctx: any) {}
  }
}
