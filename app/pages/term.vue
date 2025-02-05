<script setup>
const appConfig = useAppConfig();
const { locale } = useI18n();

useSeoMeta({
  title: `Term And Condition - ${appConfig.appName}`,
});

const { data } = await useAsyncData(
  "term",
  () => queryContent("/term").locale(locale.value).findOne(),
  {
    watch: [locale],
  }
);
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen">
      <LayoutScrollToTop />
      <div
      style="--stagger: 1"
          data-animate
      class="py-8 sm:py-16 lg:py-24">
        <div class="gap-8 sm:gap-y-16 flex flex-col">
          <div
            style="--stagger: 1"
            data-animate
            class="text-center flex flex-col items-center"
          >
            <h1
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-[--bg-card] sm:text-4xl lg:text-5xl"
            >
              {{ data.termsAndConditions.title }}
            </h1>
          </div>
        </div>
      </div>

      <!--  t&c section section-->

      <div
      style="--stagger: 2"
          data-animate
      class="px-4 sm:px-6 lg:px-8 space-y-8">
        <div
          v-for="(section, i) in data.termsAndConditions.sections"
          v-bind:key="i"
        >
          <p
            class="text-2xl text-gray-900 dark:text-white sm:text-3xl font-semibold truncate"
          >
            {{ section.title }}
          </p>
          <div class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
            {{ section.content }}
          </div>
          <Divider class="my-9" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>