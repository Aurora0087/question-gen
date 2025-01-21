<script setup>
definePageMeta({
  layout: "chat",
});

const route = useRoute();

const response = await useFetch("/backendApi/api/v1/chats/answersByMcqId", {
  method: "POST",
  body: { mcqId: String(route.params.id[0]) },
  credentials: "include",
});

if (response.error.value) {
  throw createError({
    status: response.error.value.data.statusCode || response.error.value.status,
    message: response.error.value.data.message || response.error.value.message,
  });
}

console.log(response.data.value);
</script>

<template>
  <NuxtLayout>
    <div
      v-if="response.data.value.data.docs.length < 1"
      class="text-5xl font-bold text-primary text-center w-full min-h-screen grid place-content-center"
    >
      No Answer submited for this paper.
      <NuxtLink :to='"/dashbord/mcq/"+route.params.id[0]' class=" text-base mt-4 h-fit bg-[--bg-card] rounded-full p-2 px-8 text-black flex justify-center items-center gap-2 hover:opacity-90 focus:opacity-90">
        <Icon name="heroicons:chevron-left" class=" w-6 h-6"/>
        <span>Question Paper</span>
      </NuxtLink>
    </div>
    <div v-else class="w-full min-h-screen grid gap-8 md:grid-cols-2 p-16 relative">

      <LayoutScrollToTop />
      
      <NuxtLink :to='"/dashbord/mcq/"+route.params.id[0]' class=" absolute top-0 w-fit h-fit bg-[--bg-card] rounded-full p-2 px-8 text-black flex justify-center items-center gap-2 hover:opacity-90 focus:opacity-90">
        <Icon name="heroicons:chevron-left" class=" w-6 h-6"/>
        <span>Question Paper</span>
      </NuxtLink>
      <!-- answer card-->
      <div
        v-for="ans in response.data.value.data.docs"
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
            <span class=" text-nowrap text-sm"> Q {{ index + 1 }} : </span>
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
    </div>
  </NuxtLayout>
</template>