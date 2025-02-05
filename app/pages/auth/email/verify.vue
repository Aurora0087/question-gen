<script setup>
import { loadRiveScript } from '~/utils/loadRiveScript';

useSeoMeta({
  title: "Email verify",
});

definePageMeta({
  ssr: false,
});

const isLoading = ref(true);
const isVerifyed = ref(false);
const errorMessage = ref("");

const params = useUrlSearchParams();

async function verifyEmail() {
  await $fetch(
    `/backendApi/api/v1/users/verify?token=${params.token}&uId=${params.uId}`,
    {
      method: "POST",
      credentials: "include",
    }
  )
    .then((res) => {
      console.log(res);
      isVerifyed.value = true;
    })
    .catch((err) => {
      errorMessage.value =
        err.message || "Somthing gose wrong while verifying email.";
    })
    .finally(() => {
      isLoading.value = false;
    });
}

onMounted(async () => {
  await loadRiveScript();

  const r = new rive.Rive({
    src: "/rive/success.riv",
    canvas: document.getElementById("riveCanvasEmailVerify"),
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
      r.resizeDrawingSurfaceToCanvas();
    },
    onStateChange: (state) => {
      console.log("State changed:", state);

      if (isVerifyed) {
        setTimeout(() => {
          const inputs = r.stateMachineInputs("State Machine 1");
          const trigger = inputs.find((i) => i.name === "Success");

          trigger.fire();
        }, 1500);
      }
    },
  });

  await verifyEmail();
});
</script>

<template>
  <NuxtLayout>
    <div class="p-8 flex flex-col justify-center items-center w-full h-full">
      <div v-if="errorMessage.length > 0" class="w-full">
        <UAlert
          icon="material-symbols:warning-outline-rounded"
          color="red"
          variant="solid"
          title="Error!"
          :description="errorMessage"
        />
      </div>

      <div v-else class="h-full w-full grid place-content-center">
        <canvas
          id="riveCanvasEmailVerify"
          width="500"
          height="500"
          class="grid place-content-center"
        ></canvas>
        <p
          style="--stagger: 2"
          data-animate
          v-if="isVerifyed"
          class="text-center"
        >
          Your Email verifyed successfully.
          <NuxtLink to="/login" class="text-[--bg-card] hover:opacity-70">
            Login now.
          </NuxtLink>
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>