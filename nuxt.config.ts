// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'vercel'
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'th'
      },
      title: 'บันทึกนิรนาม - ที่พักปลอดภัยสำหรับความคิดของคุณ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'บันทึกนิรนาม - เขียนบันทึกปกปิดตัวตน คุยกับ AI companion และเชื่อมต่อกับชุมชน' },
        { name: 'keywords', content: 'บันทึกประจำวัน, diary, AI companion, anonymous, mental health' },
        { name: 'author', content: 'บันทึกนิรนาม' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'บันทึกนิรนาม' },
        { property: 'og:locale', content: 'th_TH' },
        { property: 'og:title', content: 'บันทึกนิรนาม - ที่พักปลอดภัยสำหรับความคิดของคุณ' },
        { property: 'og:description', content: 'เขียนบันทึกปกปิดตัวตน คุยกับ AI companion และเชื่อมต่อกับชุมชน' },
        { property: 'og:image', content: 'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=630&fit=crop' },
        { property: 'og:url', content: 'https://anonymous-diary.app' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'บันทึกนิรนาม - ที่พักปลอดภัยสำหรับความคิดของคุณ' },
        { name: 'twitter:description', content: 'เขียนบันทึกปกปิดตัวตน คุยกับ AI companion' },
        { name: 'twitter:image', content: 'https://images.unsplash.com/photo-1507238691740-e6d7c3b2b698?w=1200&h=630&fit=crop' },
        // Theme
        { name: 'theme-color', content: '#000000' },
        { name: 'msapplication-TileColor', content: '#000000' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/nira.png' },
        { rel: 'canonical', href: 'https://anonymous-diary.app' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/scss/main.scss'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/_variables.scss"; @import "~/assets/scss/_mixins.scss";'
        }
      }
    }
  },

  runtimeConfig: {
    // Private keys (server-side only) - read from environment variables
    firebaseAdminProjectId: process.env.NUXT_FIREBASE_ADMIN_PROJECT_ID || '',
    firebaseAdminClientEmail: process.env.NUXT_FIREBASE_ADMIN_CLIENT_EMAIL || '',
    firebaseAdminPrivateKey: process.env.NUXT_FIREBASE_ADMIN_PRIVATE_KEY || '',

    // SMTP Configuration
    smtpHost: process.env.NUXT_SMTP_HOST || '',
    smtpPort: process.env.NUXT_SMTP_PORT || '',
    smtpUser: process.env.NUXT_SMTP_USER || '',
    smtpPass: process.env.NUXT_SMTP_PASS || '',

    // Groq API Key (server-side only for security) - FREE
    groqApiKey: process.env.NUXT_GROQ_API_KEY || '',

    // Public keys (exposed to client) - map from NUXT_PUBLIC_* env vars

    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || ''
    }
  }
})
