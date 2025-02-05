<script setup>
import BackButton from "~/components/BackButton.vue";
import { ChangePasswordSchema } from "~/schemas/ChangePasswordSchema";

useSeoMeta({
  title: "Profile",
});

const currentUserRes = await useFetch("/backendApi/api/v1/users/currentuser", {
  credentials: "include",
});

const router = useRouter();
const toaster = useToast();

if (currentUserRes.error.value) {
  router.push("/login");
}

const loading = ref(false);

const changePasswordFormState = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

async function changePasswordOnSubmit(data) {
  loading.value = true;
  const res = await $fetch(`/backendApi/api/v1/users/changePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      oldPassword: data.data.oldPassword,
      newPassword: data.data.newPassword,
      confirmPassword: data.data.confirmPassword,
    }),
  });
  loading.value = false;

  if (res.statusCode === 200) {
    toaster.add({ title: "Password changed sueessfully." });
    return;
  }
  toaster.add({ title: "Password changing failed." });
}

const changeUsernameFormState = reactive({
  newUsername: "",
});

const validateChangeUserName = (state) => {
  const errors = [];
  if (!state.newUsername)
    errors.push({ path: "newUsername", message: "Required" });
  if (String(state.newUsername).length < 3)
    errors.push({
      path: "newUsername",
      message: "Minimum 3 charecter required",
    });
  if (String(state.newUsername).length > 25)
    errors.push({ path: "newUsername", message: "Maximum 25 charecter" });
  if (
    String(state.newUsername) === currentUserRes.data.value.data.user.username
  )
    errors.push({
      path: "newUsername",
      message: "New Username same as old username",
    });
  return errors;
};

async function changeUsernameOnsubmit(data) {
  loading.value = true;
  const res = await $fetch(`/backendApi/api/v1/users/changeUsername`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      newUsername: data.data.newUsername,
    }),
  });

  loading.value = false;

  if (res.statusCode === 200) {
    toaster.add({ title: "Username changed sueessfully." });
    return;
  }
  toaster.add({ title: "Username changing failed." });
}
</script>

<template>
  <NuxtLayout>
    <div class="grid place-content-center">
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <div v-if="currentUserRes.data.value" class="p-8 w-full space-y-4">
        <div class="flex gap-4">
          <BackButton/>
          <h3 class="text-xl font-bold">
            Change Username{{
              currentUserRes.data.value.data.user.loginType !== "GOOGLE"
                ? " and password"
                : ""
            }}
          </h3>
        </div>

        <div class="grid gap-8 w-full">
          <div
            v-if="currentUserRes.data.value.data.user.loginType !== 'GOOGLE'"
            class="w-full border-t-2 border-l-2 border-white/50 rounded-xl p-2 py-8 flex flex-col justify-between items-center gap-8 bg-black/50"
          >
            <h3 class="font-bold text-primary">Change Password</h3>
            <UForm
              :schema="ChangePasswordSchema"
              :state="changePasswordFormState"
              @submit="changePasswordOnSubmit"
              class="space-y-4"
            >
              <UFormGroup label="Old Password" name="oldPassword" required>
                <UInput
                  v-model="changePasswordFormState.oldPassword"
                  type="password"
                />
              </UFormGroup>
              <UFormGroup label="New Password" name="newPassword" required>
                <UInput
                  v-model="changePasswordFormState.newPassword"
                  type="password"
                />
              </UFormGroup>

              <UFormGroup
                label="Confirm New Password"
                name="confirmPassword"
                required
              >
                <UInput
                  v-model="changePasswordFormState.confirmPassword"
                  type="password"
                />
              </UFormGroup>

              <UButton
                :disabled="loading"
                type="submit"
                class="w-full rounded-full flex justify-center items-center py-2 px-3"
              >
                <p v-if="!loading">Change Password</p>
                <Icon
                  v-if="loading"
                  class="h-5 w-5 animate-spin"
                  name="mingcute:loading-fill"
                />
                <Icon v-else class="h-5 w-5" name="ic:baseline-arrow-forward" />
              </UButton>
            </UForm>
          </div>

          <div
            class="w-full border-t-2 border-l-2 border-white/50 rounded-xl p-2 py-8 flex flex-col justify-between items-center gap-8 bg-black/50"
          >
            <h3 class="font-bold text-primary">Change Username</h3>
            <UForm
              :validate="validateChangeUserName"
              :state="changeUsernameFormState"
              @submit="changeUsernameOnsubmit"
              class="space-y-4"
            >
              <UFormGroup label="New Username" name="newUsername" required>
                <UInput v-model="changeUsernameFormState.newUsername" />
              </UFormGroup>

              <UButton
                :disabled="loading"
                type="submit"
                class="w-full rounded-full flex justify-center items-center py-2 px-3"
              >
                <p v-if="!loading">Change Username</p>
                <Icon
                  v-if="loading"
                  class="h-5 w-5 animate-spin"
                  name="mingcute:loading-fill"
                />
                <Icon v-else class="h-5 w-5" name="ic:baseline-arrow-forward" />
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>