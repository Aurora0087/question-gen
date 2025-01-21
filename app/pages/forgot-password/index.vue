<script setup>

import { forgotPasswordSchema } from '~/schemas/ForgotPasswordSchema';

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Forgot Password",
});

const formState = reactive({
  email: "",
});

const isLoading = ref(false);

function onSubmit(data) {
  isLoading.value = true;
  console.log("Submitted", data);
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}
</script>

<template>
    <NuxtLayout>
    <div
      class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow max-w-sm w-full bg-white/70 dark:bg-white/5 backdrop-blur"
    >
      <div class="px-4 py5 sm:p-6">
        <div class="w-full max-w-sm space-y-6">
          <div class="text-center">
            <div class="text-2xl text-gray-900 dark:text-white font-bold">
              Forgot Password
            </div>
            <div class="text-gray-500 dark:text-gray-400 mt-1">
              Don't have an account?
              <NuxtLink to="/signup" class="text-primary font-medium">
                Sign up </NuxtLink
              >.
            </div>
          </div>
          <!--forgot password  form-->
          <UForm
            :schema="forgotPasswordSchema"
            :state="formState"
            @submit="onSubmit"
            class="space-y-6"
          >
            <UFormGroup 
            label="Your Register Email" 
            name="email"
            description="We will send you a email with link to change your password."
            required>
              <UInput
                v-model="formState.email"
                placeholder="youremail@mail.com"
              />
            </UFormGroup>

            <UButton
              :disabled="isLoading"
              type="submit"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <spam v-if="!isLoading">Send Mail</spam>
              <Icon
                v-if="isLoading"
                class="h-5 w-5 animate-spin"
                name="mingcute:loading-fill"
              />
              <Icon v-else class="h-5 w-5" name="ic:baseline-arrow-forward" />
            </UButton>
          </UForm>
        </div>
      </div>
    </div>
  </NuxtLayout>
  <DotPattern
    class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
  />
</template>