<script setup>
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


async function verifyEmail() {

  await $fetch(`/backendApi/api/v1/users/sendVerifyEmail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        }
      ).then((res)=>{
        toaster.add({title:'Mail send',description:'We send a mail to your registered Email id.'});
      }).catch((err)=>{
        toaster.add({title:err.data.message,color:'red',icon:'material-symbols:error-circle-rounded-outline-sharp'})
      });
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
          <UButton
            @click="router.back()"
            icon="heroicons:chevron-left"
            class="p-2 rounded-full aspect-square h-fit"
          />
          <h3 class="text-xl font-bold">Manage profile and preferences</h3>
        </div>

        <div class="grid gap-8 w-full">
          <NuxtLink
            to="/profile/edit"
            class="w-full border-2 border-white/50 rounded-xl p-2 flex justify-between items-center gap-2 bg-white text-black hover:opacity-90 focus:opacity-90"
          >
            <div class="flex justify-start items-center gap-2">
              <UAvatar
                :alt="currentUserRes.data.value.data.user.username || '...'"
              />
              <div>
                <p>
                  {{ currentUserRes.data.value.data.user.username || "..." }}
                </p>
                <p class="text-xs text-opacity-90">Edit Your profile</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="" />
          </NuxtLink>

          <div
            class="w-full border-2 border-white/50 rounded-xl p-2 flex justify-between items-center gap-2"
          >
            <div class="flex justify-start items-center gap-2">
              <Icon
                :name="
                  currentUserRes.data.value.data.user.isEmailVerified
                    ? 'heroicons:check-badge-16-solid'
                    : 'material-symbols-light:warning-rounded'
                "
                class="w-6 h-6"
              />
              <p>
                {{
                  currentUserRes.data.value.data.user.isEmailVerified
                    ? "Email Verifyed"
                    : "Email Not Verifyed"
                }}
              </p>
            </div>
            <UButton
              v-if="!currentUserRes.data.value.data.user.isEmailVerified"
              label="Verify Email"
              class="rounded-xl"
              @click="verifyEmail"
            />
          </div>

          <div
          v-if="currentUserRes.data.value.data.user.loginType==='GOOGLE'"
            class="w-full border-2 border-white/50 rounded-xl p-2 flex justify-between items-center gap-2"
          >
            <div class="flex justify-start items-center gap-2">
              <Icon
                name="bxl:google"
                class="w-6 h-6"
              />
              <p>
                Account Linked with Google
              </p>
            </div>
          </div>

          <NuxtLink
            to="/profile/billings"
            class="w-full border-2 border-white/50 rounded-xl p-2 flex justify-between items-center gap-2 bg-white text-black hover:opacity-90 focus:opacity-90"
          >
            <div class="flex justify-start items-center gap-2">
              <Icon name="heroicons:credit-card-20-solid" class="w-8 h-8" />
              <div>
                <p>All Orderes and Billing</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="" />
          </NuxtLink>

          <NuxtLink
            to="/profile/token-history"
            class="w-full border-2 border-white/50 rounded-xl p-2 flex justify-between items-center gap-2 bg-white text-black hover:opacity-90 focus:opacity-90"
          >
            <div class="flex justify-start items-center gap-2">
              <Icon name="ic:baseline-history" class="w-8 h-8" />
              <div>
                <p>History of Tokens</p>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>