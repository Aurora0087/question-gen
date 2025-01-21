<script setup lang="ts">
const appConfig = useAppConfig();

useHead({
  title: () => appConfig.appName,
  titleTemplate: () => appConfig.appName,
});

defineOgImage({
  url: appConfig.openGraphImage,
  width: 1200,
  height: 630,
  alt: "Home image",
});
</script>

<template>
  <section class="relative pt-12">
    <!-- grid -->
    <div
      class="pointer-events-none absolute inset-0 bg-center bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"
    />

    <div
      class="relative mx-auto flex max-w-7xl flex-col justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
    >
      <!-- spotlight -->
      <div
        class="absolute -top-8 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/25 blur-[120px] lg:-top-8 lg:size-[32rem] lg:blur-[200px]"
      />

      <div class="z-20 flex flex-col items-center justify-center">
        <!-- title -->
        <div
          class="font-geist"
          style="--stagger: 1; --delay: 10ms"
          data-animate
        >
          <h1
            class="mx-auto text-pretty bg-gradient-to-b from-[--bg-card] to-white/70 bg-clip-text text-center text-5xl sm:text-7xl font-bold tracking-tighter leading-tight text-transparent lg:max-w-5xl"
          >
            <ContentSlot :use="$slots.hero_title" />
          </h1>

          <!-- subtitle -->
          <h2
            class="mx-auto mt-4 mb-8 lg:max-w-3xl text-center text-lg antialiased text-white/60"
          >
            <ContentSlot :use="$slots.hero_subtitle" />
          </h2>

          <div class="w-full mb-16 flex items-center justify-center gap-4">
            <NuxtLink
              to="/dashbord"
              class="rounded-full px-8 py-2 bg-[--bg-card] text-slate-900 flex items-center justify-center gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90"
            >
              Get started
              <Icon name="ic:baseline-arrow-forward" class="w-6 h-6" />
            </NuxtLink>
          </div>
        </div>

        <div
          style="--stagger: 1; --delay: 50ms"
          data-animate
          class=" rounded-xl lg:-m-4 p-4 w-full"
        >
          <div class="py-24 sm:py-32 !pt-0">
            <!--[--><!--]-->
            <div
              class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col"
            >
              <!--[--><!----><!--[-->
              <div
                class="bg-gray-900/5 dark:bg-white/5 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 rounded-xl lg:-m-4 p-4"
                
              >
                <div
                  class="aspect-w-16 aspect-h-9 rounded-lg relative overflow-hidden border border-dashed border-gray-900/10 dark:border-white/10"
                >
                  <svg
                    class="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-white/10"
                    fill="none"
                  >
                    <defs>
                      <pattern
                        id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect
                      stroke="none"
                      fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
                      width="100%"
                      height="100%"
                    ></rect>
                  </svg>
                </div>
              </div>
              <!--]--><!----><!----><!--]-->
            </div>
            <!--[--><!--]-->
          </div>
        </div>

        <div
          style="--stagger: 5"
          data-animate
          class="mt-12 flex w-full max-w-3xl flex-col gap-4 lg:mt-16"
        >
        </div>

        <Divider class="my-9" />

        <HomeService />

        <Divider class="my-9" />

        <HomeFaq style="--stagger: 6" data-animate />

        <!-- social -->
        <HomeSocial style="--stagger: 3" data-animate />
      </div>
    </div>
  </section>
</template>
