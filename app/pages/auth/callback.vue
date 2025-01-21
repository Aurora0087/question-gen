<script setup>

useSeoMeta({
  title: "Proceing Login...",
});

const router = useRouter();
const { handelOAuthCallback, loading, error } = useAuth();

onMounted(async () => {
  try {
    await handelOAuthCallback();

    router.push("/dashbord");
  } catch (err) {
    console.error("OAuth callback error:", err);
    // Redirect to login page after delay
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }
});
</script>

<template>
  <div class=" w-screen h-screen grid place-content-center text-center text-primary">
    <p v-if="loading">Processing login...</p>
    <p v-if="error">{{ error.message||'Error' }}</p>
  </div>
</template> 