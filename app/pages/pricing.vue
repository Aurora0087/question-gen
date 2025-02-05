<script setup>

const {user} = useAuth();
const router = useRouter();

useSeoMeta({
  title: "Pricing",
});

function packageClickAction(p=0) {
  
  if (!user) {
    router.push("/login");
  }

  router.push(`/dashbord/checkout?pack=${p}`);
}


const prices = [
  {
    title:'Basic',
    smallDetails:"A basic package for 1 papers.",
    price:"₹15",
    uiClass:"rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full",
    actionButton:{
      color:'gray',
      variant:"solid",
      uiClass:"rounded-full flex justify-center items-center py-2.5",
      clickAction:()=>packageClickAction(0)
    },
    points:[
      "1 Token"
    ]
  },
  {
    title:'Standard',
    smallDetails:"A standard package for small teams.",
    price:"₹12",
    uiClass:"rounded-xl divide-y divide-gray-200 dark:divide-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full ring-2 ring-primary dark:ring-primary",
    actionButton:{
      uiClass:"rounded-full flex justify-center items-center py-2.5",
      clickAction:()=>packageClickAction(1)
    },
    points:[
      "10 Token"
    ]
  },
  {
    title:'Premium',
    smallDetails:"A premium package for large teams.",
    price:"₹10",
    uiClass:"rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 relative flex flex-col self-stretch w-full",
    actionButton:{
      color:'gray',
      variant:"solid",
      uiClass:"rounded-full flex justify-center items-center py-2.5",
      clickAction:()=>packageClickAction(1)
    },
    points:[
      "20 Token"
    ]
  },
]
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen">
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <div class="py-8 sm:py-16 lg:py-24">
        <div class="gap-8 sm:gap-y-16 flex flex-col">
          <div
          style="--stagger: 1"
          data-animate
          class="text-center flex flex-col items-center">
            <h1
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
            >
              A package for every need
            </h1>
            <div class="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Our plans are designed to meet the requirements of both beginners
              and players. Get the right plan that suits you.
            </div>
          </div>
        </div>
      </div>

      <!--  price section-->
      <div 
      style="--stagger: 2"
          data-animate
      class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div
          class="flex flex-col lg:grid lg:grid-cols-3 w-full justify-center items-center gap-8"
        >
          <div
          v-for="(priceCard) in prices"
          v-bind:key="priceCard"
            :class=priceCard.uiClass
          >
            <!---->
            <div
              class="flex-1 gap-6 lg:gap-x-8 xl:gap-x-10 flex flex-col sm:p-6 p-6 lg:p-8 xl:p-10"
            >
              <div class="">
                <div class="flex items-center gap-3">
                  <p
                    class="text-2xl text-gray-900 dark:text-white sm:text-3xl font-semibold truncate"
                  >
                  {{ priceCard.title }}
                  </p>
                  <!---->
                </div>
                <div
                  class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2"
                >
                {{ priceCard.smallDetails }}
                </div>
                <!---->
              </div>
              <div class="flex flex-row items-baseline gap-x-1">
                <!---->
                <p
                  class="text-gray-900 dark:text-white text-2xl sm:text-4xl font-semibold"
                >
                {{ priceCard.price }}
                </p>
                <p
                  class="text-gray-500 dark:text-gray-400 text-sm/6 font-medium truncate"
                >
                  /token
                </p>
              </div>
              <div class="order-last flex-1">
                <ul class="space-y-3 text-sm">
                  <li v-for="(list) in priceCard.points" v-bind:key="list" class="flex items-center gap-x-3 min-w-0">
                    <Icon class=" w-4 h-4 text-[--bg-card]" name="heroicons:check-circle-16-solid"/>
                    <span class="text-gray-600 dark:text-gray-400 truncate">
                      {{ list }}
                    </span>
                  </li>
                </ul>
              </div>
              <UButton @click="priceCard.actionButton.clickAction" :color=priceCard.actionButton.color :variant=priceCard.actionButton.variant :class=priceCard.actionButton.uiClass>
                Get Started
              </UButton>
            </div>
            <!---->
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>