<script setup>
import { LoginSchema } from "~/schemas/LoginSchema";

const { appName } = useAppConfig();

const { loginWithOAuth, login, loading } = useAuth();
const toast = useToast();
const router = useRouter();

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: `Login - ${appName}`,
});

const isLoading = ref(false);
const isPasswordShowing = ref(false);

function showPasswordToggle() {
  isPasswordShowing.value = !isPasswordShowing.value;
}

const formState = reactive({
  email: "",
  password: "",
});

async function onSubmit(data) {
  await login({
    email: data.data.email,
    password: data.data.password,
  })
    .then((res) => {
      toast.add({
        title: "Login succesFull",
        color: "primary",
        icon: "i-heroicons-check-badge",
      });

      setTimeout(() => {
        router.push("/dashbord");
      }, 1000);
    })
    .catch((err) => {
      toast.add({
        title: "Login Failed",
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
              Welcome back
            </div>
            <div class="text-gray-500 dark:text-gray-400 mt-1">
              Don't have an account?
              <NuxtLink to="/signup" class="text-primary font-medium">
                Sign up </NuxtLink
              >.
            </div>
          </div>
          <!--Auth  form-->
          <UForm
            :schema="LoginSchema"
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

            <UFormGroup label="Password" name="password" required>
              <template #hint>
                <NuxtLink
                  to="/forgot-password"
                  class="text-primary hover:text-opacity-80"
                >
                  Forgot Password?
                </NuxtLink>
              </template>
              <UInput
                v-model="formState.password"
                :type="isPasswordShowing ? 'text' : 'password'"
                class="relative"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <span
                    @click="showPasswordToggle"
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

            <UButton
              :disabled="loading"
              type="submit"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <p>Login</p>
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
              :disabled="isLoading"
              @click="googleLogin"
              class="w-full rounded-full flex justify-center items-center py-2 px-3"
            >
              <Icon class="h-5 w-5" name="bxl:google" />
              <p>Google</p>
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