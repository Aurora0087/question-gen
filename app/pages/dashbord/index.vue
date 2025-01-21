<script setup>

const toast = useToast();
const router = useRouter();

const { appName } = useAppConfig();

const { user } = useAuth();
const { listOfMcqPaper } = useMcqList();

definePageMeta({
  layout: "chat",
});

useSeoMeta({
  title: `Dashbord - ${appName}`,
});


const questionsQuantity = ref(10);

const useingPdf = ref(false);
const isLoading = ref(false);

// form

const topicState = reactive({
  topic: undefined,
});

const validateTopic = (topicState) => {
  const errors = [];
  if (!topicState.topic) {
    errors.push({ path: "topic", message: "Topic Required" });
  }
  if (String(topicState.topic).length < 3) {
    errors.push({ path: "topic", message: "Topic Minimum 3 charecter long" });
  }
  if (questionsQuantity.value < 1) {
    errors.push({
      path: "questionsQuantity",
      message: "Minimum Questions Quantity 1",
    });
  }
  if (questionsQuantity.value > 40) {
    errors.push({
      path: "questionsQuantity",
      message: "Maximum Questions Quantity 40",
    });
  }
  return errors;
};

async function onTopicSubmit(event) {
  isLoading.value = true;

  try {
    const response = await $fetch(`/backendApi/api/v1/chats/mcq/post`, {
      method: "POST",
      body: {
        topic: event.data.topic || "",
        questionsQuantity: questionsQuantity.value || 10,
      },
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.success) {
      user.value = {
        userCredit: Number(response.data.credit),
        userId: user.value.userId,
        username: user.value.username,
      };

      listOfMcqPaper.value.push({
        label: String(response.data._doc.topic),
        to: `/dashbord/mcq/${response.data._doc._id}`,
      });

      router.push(`/dashbord/mcq/${response.data._doc._id}`);
    }
  } catch (err) {
    console.log(err);
    toast.add({
      title: "Paper Creation Failed",
      description: String(err.data.message),
      color: "red",
      icon: "material-symbols:error-circle-rounded-outline-sharp",
    });
  }

  isLoading.value = false;
}

// PDF

const topicPDFState = reactive({
  topic: undefined,
});

const validatePDFTopic = (topicPDFState) => {
  const errors = [];
  if (!topicPDFState.topic)
    errors.push({ path: "topic", message: "Topic PDF file Required" });
  else if (topicPDFState.topic.size > 3 * 1024 * 1024) {
    errors.push({ path: "topic", message: "File size must not exceed 3MB" });
  }
  return errors;
};

async function onPDFSubmit(event) {
  isLoading.value = true;

  try {

    const formData = new FormData();

    formData.append("topicPdf",event.data.topic);
    formData.append("questionsQuantity",questionsQuantity.value || 10);

    const response = await $fetch(`/backendApi/api/v1/chats/mcq/post`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (response.success) {
      user.value = {
        userCredit: Number(response.data.credit),
        userId: user.value.userId,
        username: user.value.username,
      };

      listOfMcqPaper.value=[{
        label: String(response.data._doc.topic),
        to: `/dashbord/mcq/${response.data._doc._id}`,
      },...listOfMcqPaper.value];

      router.push(`/dashbord/mcq/${response.data._doc._id}`);
    }
  } catch (err) {
    console.log(err);
    toast.add({
      title: "Paper Creation Failed",
      description: String(err.data.message),
      color: "red",
      icon: "material-symbols:error-circle-rounded-outline-sharp",
    });
  }

  isLoading.value = false;
}
</script>

<template>
  <NuxtLayout>
    <UNotifications />
    <div 
    style="--stagger: 1"
    data-animate
    class="relative grid place-content-center h-full">
      <div class="text-primary text-5xl font-bold text-center mb-8">
        <h3>Create Your</h3>
        <h3>MCQ Paper</h3>
      </div>
      <div
        class="rounded-xl transition-all bg-gray-900/80 p-4 w-full max-w-sm h-fit"
      >
        <div class="mb-8">
          <span class="mr-2 text-primary">Use PDF</span>
          <UToggle v-model="useingPdf" />
          <UBadge
            icon="material-symbols:experiment-outline"
            size="xs"
            color="primary"
            variant="solid"
            label="Beta"
            class="rounded-full ml-2"
          />
        </div>
        
          <transition name="slide-right" mode="out-in">
              <!-- only topic-->
              <div v-if="!useingPdf" class="w-full">
                <UForm
                  :validate="validateTopic"
                  :state="topicState"
                  class="space-y-4"
                  @submit="onTopicSubmit"
                >
                  <UFormGroup label="MCQ Topic" name="topic" required>
                    <UTextarea
                      autoresize
                      size="xl"
                      v-model="topicState.topic"
                    />
                  </UFormGroup>

                  <UFormGroup
                    label="Number of Questions"
                    name="questionsQuantity"
                    required
                  >
                    {{ questionsQuantity }}
                    <URange
                      :min="5"
                      :max="40"
                      :model-value="questionsQuantity"
                      @change="(e) => (questionsQuantity = Number(e || 0))"
                    />
                  </UFormGroup>

                  <UButton
                    :loading="isLoading"
                    type="submit"
                    class="w-full rounded-full text-center flex justify-center items-center"
                  >
                    <span>Make MCQ Paper</span>
                    <Icon
                      v-if="!isLoading"
                      class="h-5 w-5"
                      name="ic:baseline-arrow-forward"
                    />
                  </UButton>
                </UForm>
              </div>
              <!-- only PDF-->
              <div v-else class="w-full">
                <UForm
                  :validate="validatePDFTopic"
                  :state="topicPDFState"
                  class="space-y-4"
                  @submit="onPDFSubmit"
                >
                  <UFormGroup label="PDF file" name="topic" required>
                    <UInput
                      type="file"
                      v-model="topicPDFState.topic"
                      icon="i-heroicons-folder"
                      size="xl"
                      accept=".pdf"
                      @change="(e) => (topicPDFState.topic = e[0])"
                    />
                  </UFormGroup>

                  <UButton
                    :loading="isLoading"
                    type="submit"
                    class="w-full rounded-full text-center flex justify-center items-center"
                  >
                    <samp>Make MCQ Paper</samp>
                    <Icon
                      v-if="!isLoading"
                      class="h-5 w-5"
                      name="ic:baseline-arrow-forward"
                    />
                  </UButton>
                </UForm>
              </div>
          </transition>
        
      </div>
    </div>
  </NuxtLayout>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>