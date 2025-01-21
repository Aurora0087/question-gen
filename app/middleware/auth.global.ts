export default defineNuxtRouteMiddleware(async (to, from) => {

  if (import.meta.server) return

  const { refeshToken, user } = useAuth();

  const protectedRoutes = ['/dashbord', '/profile'];


  if ((protectedRoutes.some((path) => to.path.startsWith(path))) && user.value === null) {

    try {
      const res = await refeshToken();

      if (res?.statusCode === 200) {
        return;
      }
      return navigateTo('/login');
    } catch (error) {
      return navigateTo('/login');
    }
  }
})
