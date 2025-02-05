<script setup>
useSeoMeta({
  title: "Token History",
});

const hasMore = ref(true);
const pageNumber = ref(2);
const historys = ref([]);
const loadMoreHistoryObserver = ref(null);

const router = useRouter();
const toaster = useToast();

const creditHistory = await useFetch(
  "/backendApi/api/v1/users/currentuser/credit/history",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: {
      page: 1,
      limit: 10,
    },
  }
);

if (creditHistory.error.value) {
  throw createError({
    status: Number(creditHistory.error.value.statusCode),
    message: String(creditHistory.error.value.message),
  });
}

hasMore.value = creditHistory.data.value.data.hasNextPage;
historys.value = creditHistory.data.value.data.docs;

async function getMoreHistory() {
  try {
    const res = await $fetch(
      "/backendApi/api/v1/users/currentuser/credit/history",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: {
          page: pageNumber.value,
          limit: 10,
        },
      }
    );

    console.log(res.data);
    

    historys.value.push(...res.data.docs);
    pageNumber.value+=1;
    hasMore.value = res.data.hasNextPage;
  } catch (err) {
    console.log(err.data);
    toaster.add({
      title: err.data.message,
      color: "red",
      icon: "material-symbols:error-circle-rounded-outline-sharp",
    });
  }
}

onMounted(() => {
  useIntersectionObserver(
    loadMoreHistoryObserver,
    ([enter], observerElement) => {
      if (enter.isIntersecting) {
        getMoreHistory();
      }
    }
  );
});
</script>


<template>
  <NuxtLayout>
    <div class="p-16 space-y-8">
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <BackButton/>
      <div v-if="historys.length > 0" class="space-y-12">
        <div class="text-3xl md:text-5xl font-bold text-center">
          <p>Token History</p>
        </div>
        <div class=" space-y-8">
          <div
            v-for="history in historys"
            v-bind:key="history"
            class="p-4 rounded-xl bg-[--bg-card] text-slate-900 flex flex-wrap gap-y-4 gap-x-2"
          >
            <UBadge
              :color="history.historyType === 'DECREASE' ? 'red' : 'gray'"
              variant="solid"
            >
              {{ history.historyType }}
            </UBadge>
            <UBadge
              :color="history.historyType === 'DECREASE' ? 'red' : 'gray'"
              variant="solid"
              class=" font-bold"
            >
              {{ history.pointValue }}
            </UBadge>
            <UBadge
              class=" font-bold"
            >Date &Time : 
            {{ formatDateTime(history.createdAt) }}
            </UBadge>
            <p class="">{{ history.note }}</p>
          </div>
          <div ref="loadMoreHistoryObserver" v-if="hasMore">
            <Icon name="mingcute:loading-fill" class="w-6 h-6 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>