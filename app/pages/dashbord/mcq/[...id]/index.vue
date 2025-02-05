<script setup>
import { EditMcqPaperSchema } from "~/schemas/EditMcqPaperSchema";

definePageMeta({
  layout: "chat",
});

const route = useRoute();
const toast = useToast();
const router = useRouter();

const { listOfMcqPaper } = useMcqList();

const response = await useFetch("/backendApi/api/v1/chats/mcq", {
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

const userAns = reactive({});
const isSubmited = ref(false);
const totalScore = ref(0);
const isLoading = ref(false);
const alart = ref("");
const error = ref("");

const isScoreModelOpen = ref(false);
const isDeleteing = ref(false);
const isEditing = ref(false);
const reportResponse = ref(null);

function addAndToggleAns(index, ans) {
  if (userAns[index] === ans) {
    userAns[index] = "";
  } else {
    userAns[index] = ans;
  }
}

async function submitAns() {
  const ANS = Object.entries(userAns);

  isLoading.value = true;
  alart.value = "";
  totalScore.value = 0;

  // see if answare are given

  response.data.value.data.mcq.questions.map((q, i) => {
    if (userAns[i] === undefined || String(userAns[i]).length < 1)
      alart.value = alart.value + `${i + 1} ,`;
  });

  if (alart.value.length > 0) {
    alart.value = alart.value.slice(0, -1);
    alart.value = alart.value + " question's answer not given.";

    isSubmited.value = false;
    isLoading.value = false;

    toast.add({ title: "All Answers Not given", description: alart.value });

    return;
  }

  const ansBody = [];

  // check answares in frontEnd
  for (const [key, value] of ANS) {
    ansBody[Number(key)] = value;
    if (
      response.data.value.data.mcq.questions[Number(key)].correct_answer ===
      userAns[key]
    ) {
      totalScore.value += 1;
    }
  }

  // send answer to backend

  try {
    const backendAnswerResponse = await $fetch(
      "/backendApi/api/v1/chats/answer",
      {
        method: "POST",
        body: {
          mcqId: response.data.value.data.mcq._id,
          ans: ansBody,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log(backendAnswerResponse);

    totalScore.value = backendAnswerResponse.data.score;
    reportResponse.value = backendAnswerResponse.data.answers;
  } catch (err) {
  } finally {
    isSubmited.value = true;
    isLoading.value = false;
  }
}

function toggleShowCorrectAns() {
  isScoreModelOpen.value = !isScoreModelOpen.value;
}

function resetAns() {
  isSubmited.value = false;
  totalScore.value = 0;
  alart.value = "";
  error.value = "";
  reportResponse.value = null;
  for (const [key] of Object.entries(userAns)) {
    userAns[key] = "";
  }
}

async function deleteMcq() {
  try {
    const res = await $fetch("/backendApi/api/v1/chats/mcq/delete", {
      method: "POST",
      body: { mcqId: String(response.data.value.data.mcq._id) },
      credentials: "include",
    });

    if (res.success) {
      listOfMcqPaper.value = listOfMcqPaper.value.filter(
        (mcq) => mcq.to !== `/dashbord/mcq/${response.data.value.data.mcq._id}`
      );

      toast.add({ title: "Deleted succesfully." });

      setTimeout(() => {
        router.push("/dashbord");
      }, 1500);
    } else {
      toast.add({ title: res?.message || "Failed to Delete mcq." });
    }
  } catch (err) {
    toast.add({ title: "Failed to Delete mcq." });
  }
}

const editMcwFormState = reactive({
  newTitle: "",
});

async function editPaperSubmit(data) {
  isLoading.value = true;
  await $fetch("/backendApi/api/v1/chats/mcq/edit", {
    method: "POST",
    body: {
      mcqId: String(response.data.value.data.mcq._id),
      newTitle: String(data.data.newTitle),
    },
    credentials: "include",
  })
    .then((res) => {
      toast.add({
        title: "Edit succesFull",
        color: "primary",
        icon: "i-heroicons-check-badge",
      });
      response.data.value.data.mcq.topic = data.data.newTitle;
      listOfMcqPaper.value = listOfMcqPaper.value.map((item)=>
        item.to === `/dashbord/mcq/${response.data.value.data.mcq._id}` ? {...item,label:data.data.newTitle}:item
      )
    })
    .catch((err) => {
      toast.add({
        title: "Error",
        description: String(err.data.message),
        color: "red",
        icon: "material-symbols:error-circle-rounded-outline-sharp",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

useSeoMeta({
  title: response.data.value.data.mcq.topic || "Finding topic title...",
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <div>
      <LayoutScrollToTop />
      <UModal v-model="isScoreModelOpen">
        <div class="p-6 rounded-xl border border-[--bg-card]">
          <div class="h-fit relative grid gap-4 md:grid-cols-2">
            <UButton
              @click="toggleShowCorrectAns"
              class="absolute top-0 right-0 rounded-full p-2"
            >
              <Icon name="heroicons:x-circle-16-solid" class="w-6 h-6" />
            </UButton>
            <!-- correct answer card -->
            <div
              v-for="(qData, index) in response.data.value.data.mcq.questions"
              v-bind:key="qData"
              class="flex gap-4 justify-center items-center flex-wrap p-2 border border-white/20 rounded-xl overflow-hidden w-full"
            >
              <div class="text-nowrap text-sm">Q : {{ index + 1 }}</div>
              <div class="rounded-xl bg-[--bg-card] text-black px-8 py-1">
                {{ qData.correct_answer }}
              </div>
            </div>
          </div>
        </div>
      </UModal>
      <div
        style="--stagger: 1"
        data-animate
        class="text-2xl mb-8 flex justify-between"
      >
        <h3 class="font-bold text-pretty">
          Topic :
          <span class="text-primary">{{
            response.data.value.data.mcq.topic
          }}</span>
        </h3>
        <span class="text-xs"
          >Created At :
          {{ formatDateTime(response.data.value.data.mcq.createdAt) }}</span
        >
      </div>
      <div
        style="--stagger: 2"
        data-animate
        class="w-full flex gap-4 p-4 text-center justify-end"
      >
        <NuxtLink
          :to="route.fullPath + '/ans'"
          class="flex items-center rounded-xl bg-[--bg-card] text-black font-bold hover:opacity-90 focus:opacity-90 p-1 px-4"
        >
          <Icon name="heroicons:document-text" class="w-6 h-6" />
          <span class="ml-2">Given Answer Papers</span>
        </NuxtLink>

        <!-- edit mcq -->

        <UButton
          v-if="response.data.value.data.isOwner"
          @click="() => (isEditing = true)"
          class="flex items-center rounded-xl bg-[--bg-card] text-black font-bold hover:opacity-90 focus:opacity-90 p-1 px-4"
        >
          <Icon name="heroicons:pencil" class="w-6 h-6" />
          <span class="ml-2">Edit Paper</span>
        </UButton>

        <!-- paper edit form-->
        <UModal v-model="isEditing" class="rounded-xl">
          <div class="p-8 space-y-4">
            <p class="text-xl font-bold">Are you absolutely sure?</p>
            <p class="text-white/70">
              This action cannot be undone. This will permanently edit your
              Question Paper.
            </p>

            <UForm
              :schema="EditMcqPaperSchema"
              :state="editMcwFormState"
              @submit="editPaperSubmit"
              class="space-y-6"
            >
              <UFormGroup label="New Title" name="newTitle" required>
                <UInput
                  v-model="editMcwFormState.newTitle"
                  placeholder="new title"
                />
              </UFormGroup>

              <UButton
                :disabled="isLoading"
                type="submit"
                class="w-full flex justify-center items-center py-2 px-3"
              >
                <p>Edit</p>
                <Icon
                  v-if="isLoading"
                  class="h-5 w-5 animate-spin"
                  name="mingcute:loading-fill"
                />
                <Icon v-else class="h-5 w-5" name="ic:baseline-arrow-forward" />
              </UButton>
              <UButton
                @click="() => (isEditing = false)"
                color="gray"
                label="Cancel"
                class="w-full flex justify-center items-center py-2 px-3"
              />
            </UForm>
          </div>
        </UModal>

        <!-- delete mcq -->
        <UButton
          v-if="response.data.value.data.isOwner"
          @click="() => (isDeleteing = true)"
          color="red"
          class="flex items-center rounded-xl text-black font-bold hover:opacity-90 focus:opacity-90 p-1 px-4"
        >
          <Icon name="heroicons:trash-16-solid" class="w-6 h-6" />
          <span class="ml-2">Delete Paper</span>
        </UButton>

        <!-- paper delete alert-->
        <UModal v-model="isDeleteing" class="rounded-xl">
          <div class="p-8 space-y-4">
            <p class="text-xl font-bold">Are you absolutely sure?</p>
            <p class="text-white/70">
              This action cannot be undone. This will permanently delete your
              Question Paper and remove your data from our servers.
            </p>

            <UButton
              color="red"
              @click="deleteMcq"
              label="Continue"
              class="mr-4"
            />
            <UButton
              @click="() => (isDeleteing = false)"
              color="gray"
              label="Cancel"
            />
          </div>
        </UModal>
      </div>
      <div
        style="--stagger: 1"
        data-animate
        class="relative h-full w-full pb-6 grid gap-8 overflow-hidden"
      >
        <!-- questan card-->
        <div
          v-for="(question, index) in response.data.value.data.mcq.questions"
          v-bind:key="question"
          class="rounded-xl bg-gray-900/80 p-4 shadow shadow-[--bg-card]"
        >
          <h4 class="">
            Q {{ index + 1 }}:
            <span class="text-primary">{{ question.question }}</span>
          </h4>
          <div class="grid gap-4 md:grid-cols-2 mt-8">
            <div
              v-for="option in question.options"
              v-bind:key="option"
              :aria-checked="option === userAns[index]"
              class="option-checked flex justify-between items-center border-2 p-2 font-semibold rounded-xl transition-all border-primary hover:border-[--bg-card] cursor-pointer"
              @click="() => addAndToggleAns(index, option)"
            >
              <span>{{ option }}</span>
              <Icon
                :aria-checked="option === userAns[index]"
                name="heroicons:check-circle-16-solid"
                class="option-checked-icon transition-opacity w-6 h-6"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          v-if="isSubmited"
          class="mb-8 text-2xl flex justify-center items-center gap-4"
        >
          Total Score :
          <span class="text-primary font-bold">{{ totalScore }}</span>
        </div>

        <!-- // Showing which ans is wrong and wright-->
        <div
          v-if="reportResponse !== null"
          class="grid relative gap-4 grid-cols-2 md:grid-cols-5 lg:grid-cols-5 p-8 mb-8 border-y-2 rounded-xl border-[--bg-card]"
        >
          <UButton
            @click="toggleShowCorrectAns"
            label="Correct Answers"
            class="absolute top-1 right-1 rounded-full px-8 py-1"
          />
          <div
            v-for="(d, index) in reportResponse"
            v-bind:key="d"
            class="flex justify-center items-center gap-2"
          >
            <span> Q {{ index + 1 }} : </span>
            <Icon
              v-if="d.isCorrect"
              name="heroicons:check-circle-16-solid"
              class="text-primary"
            />
            <Icon
              v-else
              name="heroicons:x-circle-16-solid"
              class="text-red-500"
            />
          </div>
        </div>
      </div>
      <UAlert
        v-if="alart.length > 0"
        icon="material-symbols:warning-outline-rounded"
        color="red"
        variant="subtle"
        title="Alert"
        :description="alart"
        class="mb-8"
      />
      <div class="flex gap-4 capitalize flex-col md:flex-row pb-16">
        <UButton
          :disabled="isSubmited"
          :loading="isLoading"
          class="rounded-full flex-grow text-center flex justify-center items-center"
          @click="submitAns"
        >
          Submit
        </UButton>

        <UButton
          color="gray"
          variant="solid"
          class="rounded-full px-8 flex w-full md:w-fit justify-center items-center"
          @click="resetAns"
        >
          Reset
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<style>
.option-checked[aria-checked="true"] {
  color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
  background-color: var(--bg-card);
}

.option-checked--icon[aria-checked="true"] {
  opacity: 100%;
}
.option-checked-icon[aria-checked="false"] {
  opacity: 0%;
}
</style>