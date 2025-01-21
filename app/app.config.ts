export default defineAppConfig({
  appName: 'GQus',
  appDescription: 'Genaret Quesanse related to a topic',
  profilePicture: '/assets/hugo-richard-light.webp',
  footerName: 'GQus',
  email: 'contact@hexample.com',
  twitterUsername: '@slayer_sensei',
  phone: '(+91) 0 00 00 00 00',
  openGraphImage: 'https://canvas.hrcd.fr/social-preview.jpg',
  socials: {
    github: 'https://github.com/Aurora0087',
    twitter: 'https://twitter.com/slayer_sensei',
  },
  ui: {
    primary: 'emerald',
    gray: 'zinc',
    notifications: {
      position: 'top-0 bottom-[unset]',
    },
    input: {
      variant: {
        none: 'bg-gray-100 dark:bg-gray-900/40 border-1 border-gray-700 hover:border-gray-400 focus:border-gray-400 transition-colors duration-300 ease-in-out',
      },
    },
    textarea: {
      variant: {
        none: 'bg-gray-100 dark:bg-gray-900/40 border-1 border-gray-700 hover:border-gray-400 focus:border-gray-400 transition-colors duration-300 ease-in-out',
      },
    },
  },
})
