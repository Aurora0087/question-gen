<script setup >
const { locale } = useI18n();

const { data: service } = await useAsyncData(
  "service",
  () => queryContent("/service").locale(locale.value).findOne(),
  {
    watch: [locale],
  }
);

const points = computed(()=>{
  return service.value?.points.map((point) => {
    return {
      label: point.title,
      icon: point.icon,
      des: point.description,
    }
  })
})
</script>

<template>
  <div
    class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 grid lg:grid-cols-2 lg:items-center"
  >
    <!--[-->
    <div class="">
      <!---->
      <h2
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-[--bg-card] sm:text-4xl lg:text-5xl"
      >
        {{ service.title }}
      </h2>
      <div class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
       {{ service.subtitle }}
      </div>
      <dl class="mt-6 leading-7 space-y-4">
        <!--[-->
        <div v-for="(point) in points" v-bind:key="point" class="relative pl-8">
          <dt class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center">
            <Icon :name="point.icon" class=" w-6 h-6"/>
            <span>{{ point.label}}</span>
          </dt>
          <dd class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
            {{ point.des }}
          </dd>
        </div>
        <!--]-->
      </dl>
      <!---->
    </div>
    <!--[-->
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
</template>
