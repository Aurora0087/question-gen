<script setup>

import { profileLinks } from '~~/content/en/layouts/chat/bottomLinks';
import { newPapersLinks } from '~~/content/en/layouts/chat/uperLinks';

const { appName } = useAppConfig();


const router = useRouter();
const toaster = useToast();

const expand = ref(false);
const mobileExpand = ref(false);

const isSreaching = ref(false);

const { user, logout } = useAuth();
const { listOfMcqPaper, hasMoreMcqs, getMcqs } = useMcqList();

const loadMoreMcqObserverMobile = ref(null);
const loadMoreMcqObserverPc = ref(null);

useIntersectionObserver(
  loadMoreMcqObserverMobile,
  ([enter], observerElement) => {
    if (enter.isIntersecting) {
      getMcqs();
    }
  }
);

useIntersectionObserver(loadMoreMcqObserverPc, ([enter], observerElement) => {
  if (enter.isIntersecting) {
    getMcqs();
  }
});

onMounted(async () => {

    await getMcqs().catch((err) => {
      toaster.add({
        title: err.data.message,
        color: "red",
        icon: "material-symbols:error-circle-rounded-outline-sharp",
      });
    });

  const savedSideBarExpand = String(
    window.localStorage.getItem("ExpandSideBar")
  );

  expand.value = savedSideBarExpand === "true" ? true : false;
});

function toggleExpand() {
  mobileExpand.value = !mobileExpand.value;
  expand.value = !expand.value;
  window.localStorage.setItem("ExpandSideBar", String(expand.value));
}

function expandOnPc() {
  expand.value = true;
}

async function logOutUser() {
  try {
    await logout();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <NuxtLoadingIndicator />
  <div class="min-h-screen flex">
    <div
      :aria-expanded="expand"
      class="expand-outer relative w-fit transition-all hidden md:grid"
    >
      <div
        :aria-expanded="expand"
        class="fixed h-screen transition-all expand-inside overflow-y-auto overflow-hidden space-y-4 text-center px-2"
      >
        <div
          class="h-screen relative w-full flex flex-col justify-center py-4 gap-2 z-50"
        >
        
          <!-- top new papers-->
          <UPopover
          >
            <div
              class="rounded-xl p-2 w-full bg-white/10 flex justify-between items-center"
              @click="expandOnPc"
            >
              <Icon name="heroicons:plus-circle-solid" class="w-8 h-8" />
              <div
                style="--stagger: 1"
                data-animate
                v-if="expand"
                class="flex flex-col ml-2 text-left text-sm"
              >
                <span class="text-primary">New Paper</span>
              </div>
              <Icon
                style="--stagger: 1"
                data-animate
                v-if="expand"
                name="ri:expand-up-down-line"
                class="ml-2"
              />
            </div>

            <template #panel>
              <div class="h-fit w-[250px] p-2 relative">
                <UVerticalNavigation
                  :links="newPapersLinks"
                />
                </div>
            </template>
          </UPopover>

          <!-- search and home button-->
          <div
            class="rounded-xl p-2 w-full bg-white/10 flex flex-col gap-2 justify-between items-center"
          >
            <!-- home-->
            <NuxtLink
              to="/"
              class="hover:opacity-80 flex justify-between items-center w-full"
            >
              <Icon name="heroicons-outline:home" class="w-8 h-8" />
              <div
                style="--stagger: 1"
                data-animate
                v-if="expand"
                class="flex flex-col ml-2 text-left text-sm"
              >
                <span class="text-primary">{{ appName }}</span>
              </div>
              <Icon
                style="--stagger: 1"
                data-animate
                v-if="expand"
                name="heroicons:arrow-up-right-16-solid"
                class="ml-2"
              />
            </NuxtLink>

            <!-- search button-->
            <div
              @click="isSreaching = true"
              color="gray"
              class="px-0 cursor-pointer hover:opacity-80 flex justify-between items-center w-full"
            >
              <Icon
                name="heroicons:magnifying-glass-16-solid"
                class="w-8 h-8"
              />
              <div
                style="--stagger: 1"
                data-animate
                v-if="expand"
                class="flex flex-col ml-2 text-left text-sm"
              >
                <span class="text-primary">Search</span>
              </div>
              <div></div>
            </div>
          </div>

          <!-- content-->
          <div class="flex-grow overflow-y-auto overflow-x-hidden rounded-xl">
            <div class="h-full bg-white/10">
              <UVerticalNavigation :links="listOfMcqPaper" />
              <div
                v-if="listOfMcqPaper.length < 1 && !hasMoreMcqs"
                class="text-center p-2 line-clamp-1"
              >
                No Paper Created.
              </div>
              <Icon
                ref="loadMoreMcqObserverPc"
                v-if="hasMoreMcqs"
                name="mingcute:loading-fill"
                class="w-6 h-6 animate-spin"
              />
            </div>
          </div>

          <!-- botton profile-->
          <UPopover>
            <div
              class="rounded-xl p-2 w-full bg-white/10 flex justify-between items-center"
              @click="expandOnPc"
            >
              <ClientOnly>
                <UAvatar :alt="user?.username || 'user'" />
              </ClientOnly>
              <div
                style="--stagger: 1"
                data-animate
                v-if="expand"
                class="flex flex-col ml-2 text-left text-sm"
              >
                <span class="text-primary">{{ user?.username }}</span>
              </div>
              <Icon
                style="--stagger: 1"
                data-animate
                v-if="expand"
                name="ri:expand-up-down-line"
                class="ml-2"
              />
            </div>

            <template #panel>
              <div class="h-fit w-[250px] p-2">
                <UVerticalNavigation :links="profileLinks" />
                <Divider />
                <UButton
                  color="gray"
                  variant="solid"
                  class="w-full"
                  label="Logout"
                  icon="ri:logout-circle-line"
                  @click="logOutUser"
                />
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>

    <!-- search popup-->
    <UModal v-model="isSreaching">
      <LayoutSearchPaper />
    </UModal>

    <USlideover class="grid md:hidden" v-model="mobileExpand">
      <div
        class="h-screen relative w-full flex flex-col justify-center p-4 gap-2"
      >
        <div class="h-8 w-full flex justify-end">
          <UButton
            icon="heroicons:x-mark"
            size="sm"
            color="primary"
            square
            variant="solid"
            @click="toggleExpand"
          />
        </div>
        <!-- top new papers-->
        <UPopover>
          <div
            class="rounded-xl p-2 w-full bg-white/10 flex justify-between items-center"
          >
            <Icon name="heroicons:plus-circle-solid" class="w-8 h-8" />
            <div class="flex flex-col ml-2 text-left text-sm">
              <span class="text-primary">New Paper</span>
            </div>
            <Icon name="ri:expand-up-down-line" class="ml-2" />
          </div>

          <template #panel>
            <div class="h-fit w-[350px] p-2">
              <UVerticalNavigation :links="newPapersLinks" />
            </div>
          </template>
        </UPopover>

        <!-- search and home button-->
        <div
          class="rounded-xl p-2 w-full bg-white/10 flex flex-col gap-2 justify-between items-center"
        >
          <!-- home-->
          <NuxtLink
            to="/"
            class="hover:opacity-80 flex justify-between items-center w-full"
          >
            <Icon name="heroicons-outline:home" class="w-8 h-8" />
            <div
              style="--stagger: 1"
              data-animate
              class="flex flex-col ml-2 text-left text-sm"
            >
              <span class="text-primary">{{ appName }}</span>
            </div>
            <Icon
              style="--stagger: 1"
              data-animate
              name="heroicons:arrow-up-right-16-solid"
              class="ml-2"
            />
          </NuxtLink>

          <!-- search button-->
          <UButton
            @click="isSreaching = true"
            color="gray"
            class="px-0 hover:opacity-80 flex justify-between items-center w-full"
          >
            <Icon name="heroicons:magnifying-glass-16-solid" class="w-8 h-8" />
            <div
              style="--stagger: 1"
              data-animate
              class="flex flex-col ml-2 text-left text-sm"
            >
              <span class="text-primary">Search</span>
            </div>
            <div></div>
          </UButton>
        </div>

        <!-- content-->
        <div class="flex-grow overflow-y-auto overflow-x-hidden rounded-xl">
          <div class="h-full bg-white/10">
            <UVerticalNavigation :links="listOfMcqPaper" />
            <div
              v-if="listOfMcqPaper.length < 1 && !hasMoreMcqs"
              class="text-center p-2"
            >
              No Paper Created.
            </div>
            <div
              v-if="hasMoreMcqs"
              ref="loadMoreMcqObserverMobile"
              class="w-full h-fit grid place-content-center"
            >
              <Icon name="mingcute:loading-fill" class="w-6 h-6 animate-spin" />
            </div>
          </div>
        </div>

        <!-- botton profile-->
        <UPopover>
          <div
            class="rounded-xl p-2 w-full bg-white/10 flex justify-between items-center"
          >
            <ClientOnly>
              <UAvatar :alt="user?.username || 'user'" />
            </ClientOnly>
            <div class="flex flex-col ml-2 text-left text-sm">
              <span class="text-primary">{{ user?.username || "user" }}</span>
            </div>
            <Icon name="ri:expand-up-down-line" class="ml-2" />
          </div>

          <template #panel>
            <div class="h-fit w-[350px] p-2">
              <UVerticalNavigation :links="profileLinks" />
              <Divider />
              <UButton
                color="gray"
                variant="solid"
                class="w-full"
                label="Logout"
                icon="ri:logout-circle-line"
                @click="logOutUser"
              />
            </div>
          </template>
        </UPopover>
      </div>
    </USlideover>
    <div
      class="min-h-screen w-screen md:w-fit md:flex-grow flex-grow-0 p-4 relative md:ml"
    >
      <!-- credit point viewer-->
      <div class="w-full flex justify-end items-center h-16 px-8">
        <div
          class="rounded-full px-4 py-1 border flex justify-center items-center gap-4"
        >
          <Icon name="material-symbols:token" class="w-6 h-6" />
          <ClientOnly>
            <span
              style="--stagger: 1"
              data-animate
              class="text-primary font-bold"
              >{{ user?.userCredit || 0 }}</span
            >
          </ClientOnly>
          <NuxtLink
            to="/pricing"
            class="rounded-full p-0 bg-[--bg-card] text-black w-6 h-6"
          >
            <Icon name="heroicons:plus-small" class="w-6 h-6" />
          </NuxtLink>
        </div>
      </div>
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <slot />

      <!-- sidebar toggler-->
      <div class="fixed top-4 right-4 md:right-auto h-8 mb-8">
        <UButton
          icon="uim:web-section-alt"
          size="sm"
          color="primary"
          square
          variant="solid"
          @click="toggleExpand"
        />
      </div>
    </div>
  </div>
</template>

<style>
.expand-outer[aria-expanded="true"] {
  width: 250px;
}

.expand-outer[aria-expanded="false"] {
  width: 4rem;
}

.expand-inside[aria-expanded="true"] {
  width: 250px;
}

.expand-inside[aria-expanded="false"] {
  width: 4rem;
}
</style>