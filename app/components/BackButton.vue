<script setup>
const router = useRouter();
</script>

<template>
  <UButton
    @click="router.back()"
    icon="heroicons:chevron-left"
    class="p-2 rounded-full aspect-square h-fit"
  />
</template>