<script setup>
const appConfig = useAppConfig();
const { locale } = useI18n();

useSeoMeta({
  title: `Help - ${appConfig.appName}`,
});

const { data } = await useAsyncData(
  "help",
  () => queryContent("/help").locale(locale.value).findOne(),
  {
    watch: [locale],
  }
);
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen relative px-4">
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <div class="py-8 sm:py-16 lg:py-24">
        <div class="gap-8 sm:gap-y-16 flex flex-col">
          <div
            style="--stagger: 1; --delay: 10ms"
            data-animate
            class="text-center flex flex-col items-center font-geist"
          >
            <h1
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-[--bg-card] sm:text-5xl lg:text-8xl"
            >
              Help Page
            </h1>
            <div class="mt-4 text-lg text-gray-500 dark:text-gray-400">
              <p>
                {{ data.helps.Introduction }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Divider class="my-9" />

      <div
        style="--stagger: 2"
        data-animate
        class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      >
        <HelpHowToUseApp
          :how-togenaret-question-paper="
            data.helps.HowToUseApp.HowToGenerateQuestionPaper
          "
        />
      </div>

      <Divider class="my-9" />

      <div
        style="--stagger: 3"
        data-animate
        class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-4"
      >
        <div
          class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
        >
          <Icon name="material-symbols:token" class="w-6 h-6" />
          <span>Pricing And Tokens</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
          <p>
            {{ data.helps.PricingAndTokens }}
          </p>
          <p class="mt-2">
            You can see Token Package Details
            <NuxtLink to="/pricing" class="text-[--bg-card] hover:opacity-90"
              >Here</NuxtLink
            >.
          </p>
        </div>
      </div>

      <Divider class="my-9" />

      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-4">
        <div
          class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
        >
          <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6" />
          <span>FAQ</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
          <FAQ :questions="data.helps.FAQ" class="mt-8 max-w-lg" />
        </div>
      </div>

      <Divider class="my-9" />

      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-4">
        <div
          class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
        >
          <Icon name="heroicons:cog" class="w-6 h-6" />
          <span>Common Issues and Solutions</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 leading-6 ml-8 space-x-4">
          <ul class="list-disc list-inside">
            <li
              v-bind:key="point"
              v-for="point in data.helps.CommonIssuesSolutions"
            >
              {{ point }}
            </li>
          </ul>
        </div>
      </div>

      <Divider class="my-9" />

      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-4">
        <div
          class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
        >
          <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6" />
          <span>Contact Support</span>
        </div>
        <div class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
          <p>
            {{ data.helps.ContactSupport }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>