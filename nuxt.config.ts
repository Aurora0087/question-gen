
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      script: [],
    },

  },

  routeRules: {
    '/': { isr: true, prerender: true },
    '/dashbord/checkout':{ssr: false},
    '/backendApi/**':
    {
      proxy: { to: `${process.env.BACKEND_URL || 'http://localhost:8002'}/**` },
    },
  },

  site: {
    url: process.env.NUXT_SITE_URL,
    identity: {
      type: 'Person',
    },
    twitter: '@slayer_sensei',
  },

  css: ['~/assets/style/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_SITE_URL,
      appwrite: {
        endPoint: process.env.APPWRITE_ENDPOINT,
        projectId: process.env.APPWRITE_PROJECT_ID,
      },
    },

  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storage: 'localStorage',
  },

  devtools: {
    enabled: true,
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    'nuxt-svgo',
    '@nuxt/content',
    '@nuxthq/studio',
    '@nuxt/image',
    'nuxt-og-image',
    '@nuxt/fonts',
  ],

  image: {
    format: ['webp'],
    screens: {
      avatar: 96,
      cover: 256,
      project: 1536,
      projectLg: 3072,
    },
  },

  imports: {
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
    ],
  },

  i18n: {
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    locales: ['en'],
    defaultLocale: 'en',
    vueI18n: '~/i18n.config.ts',
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/','/help','/pricing','/login','/signup','/forgot-password'],
    },
    devProxy:{
      '/backendApi/':{
        target:process.env.BACKEND_URL,
        changeOrigin:true,
      }
    }
  },

  content: {
    watch: {
      ws: {
        showURL: false,
      },
    },
    highlight: {
      theme: 'github-dark',
    },
    navigation: {
      fields: ['image', '_id'],
    },
    markdown: {
      anchorLinks: false,
    },
    locales: ['en'],
    defaultLocale: 'en',
  },

  svgo: {
    autoImportPath: './assets/logo/',
  },

  compatibilityDate: '2022-01-30',
})
