export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      title: 'Клуб героев — Премиум-доступ',
      meta: [
        {
          name: 'description',
          content: 'Откройте целую вселенную игр и приключений для ребёнка.',
        },
        { name: 'theme-color', content: '#f5f6ff' },
      ],
    },
  },
})
