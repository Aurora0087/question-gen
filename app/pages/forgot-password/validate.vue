<script setup>

import { forgotPasswordValidateSchema } from '~/schemas/ForgotPasswordSchema';

const params = useUrlSearchParams();

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Forgot Password Validate",
});

const formState = reactive({
    password: "",
    confirmPassword:"",
});

const isLoading = ref(false);

const router = useRouter();
const toast = useToast();

async function onSubmit(data) {
  isLoading.value = true;
  await $fetch(`/backendApi/api/v1/users/forgotPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: {
      newPassword: data.data.password,
      uId:params.uId||null,
      token:params.token||null,
    },
  })
    .then(() => {
      toast.add({
        title: "Password changed.",
        color: "primary",
        icon: "i-heroicons-check-badge",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    })
    .catch((err) => {
      toast.add({
        title: "Error",
        description: String(err.data.message||'Somthing Gone Wrong.'),
        color: "red",
        icon: "material-symbols:error-circle-rounded-outline-sharp",
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
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
            <div class="mb-2">
              <Icon name="material-symbols:password-2-rounded" class="w-8 h-8" />
            </div>
            <div class="text-2xl text-gray-900 dark:text-white font-bold">
              Change Password
            </div>
            <div class="text-gray-500 dark:text-gray-400 mt-1">
              You are going to use this new password in your next login.
            </div>
          </div>
          <!--Change password  form-->
          <UForm
            :schema="forgotPasswordValidateSchema"
            :state="formState"
            @submit="onSubmit"
            class="space-y-6"
          >
          <UFormGroup label="New Password" name="password" required>
              <UInput v-model="formState.password" type="password" />
            </UFormGroup>

            <UFormGroup label="Confirm Password" name="confirmPassword" required>
              <UInput v-model="formState.confirmPassword" type="password" />
            </UFormGroup>

            <UButton
              :disabled="isLoading"
              type="submit"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <spam v-if="!isLoading">Change Password</spam>
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