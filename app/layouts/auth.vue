<script setup lang="ts">
</script>

<template>
  <NuxtLoadingIndicator/>
  <div class="w-screen min-h-screen grid place-content-center">
    <div class="w-full absolute top-4 flex justify-center">
      <NuxtLink
        to="/"
        class="rounded-full font-medium transition-all border-2 border-transparent hover:bg-opacity-10 hover:text-[--bg-card] hover:border-[--bg-card] focus:bg-opacity-10 focus:text-[--bg-card] focus:border-[--bg-card] px-3 py-2 flex justify-center items-center gap-2 bg-white text-slate-950 text-center"
      >
        <Icon name="heroicons-outline:home" class="w-6 h-6" />
        <span>Home</span>
      </NuxtLink>
    </div>

    <div class=" pt-8">
      <slot />
    </div>
  </div>
</template>