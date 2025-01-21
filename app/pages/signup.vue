<script setup>
import { RegisterSchema } from "~/schemas/RegisterSchema";

const { appName } = useAppConfig();

const { loginWithOAuth, registerUser, loading } = useAuth();
const toast = useToast();
const router = useRoute();

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: `Signup - ${appName}`,
});

const isPasswordShowing = ref(false);
const isConfirmPasswordShowing = ref(false);

function showPasswordToggle() {
  isPasswordShowing.value = !isPasswordShowing.value;
}

function showConfirmPasswordToggle() {
  isConfirmPasswordShowing.value = !isConfirmPasswordShowing.value;
}

const formState = reactive({
  email: "",
  userName: "",
  password: "",
  confirmPassword: "",
});

async function onSubmit(data) {
  await registerUser({
    username: data.data.userName,
    email: data.data.email,
    password: data.data.password,
  })
    .then((res) => {
      toast.add({
        title: "Account created succesFull.",
        color: "primary",
        icon: "i-heroicons-check-badge",
      });
      toast.add({
        title: " We also send a email to verify Your Account.",
        color: "primary",
        icon: "heroicons:envelope-solid",
      });

      // Redirect to login page after delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    })
    .catch((err) => {
      toast.add({
        title: "Account creation Failed",
        description: String(err),
        color: "red",
        icon: "material-symbols:error-circle-rounded-outline-sharp",
      });
    });
}

function googleLogin() {
  loginWithOAuth();
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
              <Icon name="material-symbols:lock-outline" class="w-8 h-8" />
            </div>
            <div class="text-2xl text-gray-900 dark:text-white font-bold">
              Create an account
            </div>
            <div class="text-gray-500 dark:text-gray-400 mt-1">
              Already have an account
              <NuxtLink to="/login" class="text-primary font-medium">
                Sign In </NuxtLink
              >.
            </div>
          </div>
          <!--Auth  form-->
          <UForm
            :schema="RegisterSchema"
            :state="formState"
            @submit="onSubmit"
            class="space-y-6"
          >
            <UFormGroup label="Email" name="email" required>
              <UInput
                v-model="formState.email"
                placeholder="youremail@mail.com"
              />
            </UFormGroup>

            <UFormGroup label="User Name" name="userName" required>
              <UInput v-model="formState.userName" placeholder="User-Name" />
            </UFormGroup>

            <UFormGroup label="Password" name="password" required>
              <UInput
                v-model="formState.password"
                :type="isPasswordShowing ? '' : 'password'"
                class="relative"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <span
                    :onclick="showPasswordToggle"
                    class="text-gray-500 dark:text-gray-400 text-xs cursor-pointer"
                  >
                    <Icon
                      :name="
                        isPasswordShowing
                          ? 'material-symbols:visibility-off-outline'
                          : 'material-symbols:visibility-outline'
                      "
                      class="w-4 h-4"
                    />
                  </span>
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup
              label="Confirm Password"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="formState.confirmPassword"
                :type="isConfirmPasswordShowing ? '' : 'password'"
                class="relative"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <span
                    :onclick="showConfirmPasswordToggle"
                    class="text-gray-500 dark:text-gray-400 text-xs cursor-pointer"
                  >
                    <Icon
                      :name="
                        isConfirmPasswordShowing
                          ? 'material-symbols:visibility-off-outline'
                          : 'material-symbols:visibility-outline'
                      "
                      class="w-4 h-4"
                    />
                  </span>
                </template>
              </UInput>
            </UFormGroup>

            <UButton
              :disabled="loading"
              type="submit"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <p v-if="!loading">Register</p>
              <Icon
                v-if="loading"
                class="h-5 w-5 animate-spin"
                name="mingcute:loading-fill"
              />
              <Icon v-else class="h-5 w-5" name="ic:baseline-arrow-forward" />
            </UButton>
          </UForm>

          <UDivider label="OR" />

          <!--Googlr login-->
          <div>
            <UButton
              color="white"
              variant="solid"
              :disabled="loading"
              @click="googleLogin"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <Icon class="h-5 w-5" name="bxl:google" />
              <p v-if="!loading">Google</p>
              <Icon
                v-if="loading"
                class="h-5 w-5 animate-spin"
                name="mingcute:loading-fill"
              />
            </UButton>

            <div
              class="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center"
            >
              By signing in, you agree to our
              <NuxtLink to="/term" class="text-primary font-medium"
                >Terms of Service</NuxtLink
              >.
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
  <DotPattern
    class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
  />
</template>