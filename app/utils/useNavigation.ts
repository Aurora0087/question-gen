type Where = 'home' | 'app'

export type Navigation = {
  name: string
  to: string
  icon: string
}

export function getNavigation(where: Where): Record<string, Navigation> | [] {
  switch (where) {
    case 'home':
      return {
        home: {
          name: 'Home',
          to: '/',
          icon: 'lucide:home',
        },
        pricing:{
          name: 'Pricing',
          to: '/pricing',
          icon:'ic:outline-local-offer',
        }
      }
    default:
      return []
  }
}
