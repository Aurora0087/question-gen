<script setup>
definePageMeta({
  layout: "chat",
});

const route = useRoute();

const answers = ref([]);
const pageNumber = ref(1);
const hasNextPage = ref(true);
const loadMoreAnsObserver = ref(null);

console.log(route.params.id[0]);

const qID = route.params.id[0];


const response = await useFetch("/backendApi/api/v1/chats/answersByMcqId", {
  method: "POST",
  body: {
    mcqId: String(qID),
    page: pageNumber,
  },
  credentials: "include",
});

if (response.error.value) {
  throw createError({
    status: response.error.value.data.statusCode || response.error.value.status,
    message: response.error.value.data.message || response.error.value.message,
  });
}

answers.value = response.data.value.data.docs;
pageNumber.value += 1;
hasNextPage.value = response.data.value.data.hasNextPage;

async function getAnswers() {
  const res = await $fetch("/backendApi/api/v1/chats/answersByMcqId", {
    method: "POST",
    body: {
      mcqId: String(qID),
      page: pageNumber,
    },
    credentials: "include",
  });

  answers.value.push(...res.data.docs);
  pageNumber.value += 1;
  hasNextPage.value = res.data.hasNextPage;
}

onMounted(() => {
  useIntersectionObserver(
    loadMoreAnsObserver,
    ([enter], observerElement) => {
      if (enter.isIntersecting) {
        getAnswers();
      }
    }
  );
});
</script>

<template>
  <NuxtLayout>
    <div
      v-if="answers.length === 0"
      class="text-5xl font-bold text-primary text-center w-full min-h-screen grid place-content-center"
    >
      No Answer submited for this paper.
      <NuxtLink
        :to="'/dashbord/mcq/' + route.params.id[0]"
        class="text-base mt-4 h-fit bg-[--bg-card] rounded-full p-2 px-8 text-black flex justify-center items-center gap-2 hover:opacity-90 focus:opacity-90"
      >
        <Icon name="heroicons:chevron-left" class="w-6 h-6" />
        <span>Question Paper</span>
      </NuxtLink>
    </div>
    <div
      v-else
      class="w-full min-h-screen grid gap-8 md:grid-cols-2 p-16 relative"
    >
      <LayoutScrollToTop />

      <NuxtLink
        :to="'/dashbord/mcq/' + route.params.id[0]"
        class="absolute top-0 w-fit h-fit bg-[--bg-card] rounded-full p-2 px-8 text-black flex justify-center items-center gap-2 hover:opacity-90 focus:opacity-90"
      >
        <Icon name="heroicons:chevron-left" class="w-6 h-6" />
        <span>Question Paper</span>
      </NuxtLink>
      <!-- answer card-->
      <div
        v-for="ans in answers"
        v-bind:key="ans"
        class="rounded-xl h-fit bg-gray-900/70 p-4 shadow shadow-[--bg-card]"
      >
        <div
          class="w-full mb-4 flex gap-4 flex-col md:flex-row justify-between items-center"
        >
          <samp class="text-xs"> Answer Id : {{ ans._id }} </samp>
          <UAvatar :alt="ans.answer_giver.username" />
        </div>
        <div
          class="w-full mb-8 flex gap-4 flex-col md:flex-row justify-between items-center"
        >
          <div class="text-2xl font-bold text-nowrap">
            Score : <span class="text-primary">{{ ans.score }}</span>
          </div>
          <samp class="text-xs text-pretty">
            Given At : {{ formatDateTime(ans.createdAt) }}
          </samp>
        </div>

        <!-- // Showing which ans is wrong and wright-->
        <div
          class="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 p-8 mb-8 border-y-2 rounded-xl border-[--bg-card]"
        >
          <div
            v-for="(d, index) in ans.answers"
            v-bind:key="d"
            class="flex justify-center items-center gap-2 w-fit"
          >
            <span class="text-nowrap text-sm"> Q {{ index + 1 }} : </span>
            <Icon
              v-if="d.isCorrect"
              name="heroicons:check-circle-16-solid"
              class="text-primary w-4 h-4"
            />
            <Icon
              v-else
              name="heroicons:x-circle-16-solid"
              class="text-red-500 w-4 h-4"
            />
          </div>
        </div>
      </div>
      <div ref="loadMoreAnsObserver" v-if="hasNextPage">
            <Icon name="mingcute:loading-fill" class="w-6 h-6 animate-spin" />
          </div>
    </div>
  </NuxtLayout>
</template>