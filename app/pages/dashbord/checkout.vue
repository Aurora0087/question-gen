<script setup>
definePageMeta({
  ssr: false,
});

useSeoMeta({
  title: "Checkout",
});

const params = useUrlSearchParams("history");
const router = useRouter();
const toaster = useToast();

const ORDER_PACKAGES_LIST = [
  {
    type: "Basic",
    totalToken: 1,
    perTokenPrice: 15,
  },
  {
    type: "Standard",
    totalToken: 10,
    perTokenPrice: 12,
  },
  {
    type: "Premium",
    totalToken: 20,
    perTokenPrice: 10,
  },
];

const packageAmount = ref(1);
const isLoading = ref(false);

if (
  Number(params.pack) < 0 ||
  Number(params.pack) > ORDER_PACKAGES_LIST.length - 1
) {
  throw createError({
    status: 400,
    message: "Package Not chosen properly not chekout.",
  });
}

function changePackageAmount(value) {
  if (packageAmount.value + value < 1 || packageAmount.value + value > 20) {
    return;
  }
  packageAmount.value += value;
}

// loading razorpay checkOutscript
async function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true); // Script is already loaded
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));

    document.head.appendChild(script);
  });
}

// opening razerpay checkout
function completeRazorpayPayment(orderId, amount, currency) {
  const options = {
    key: process.env.RAZORPAY_API_KEY_ID,
    amount,
    currency,
    name: "NONE COP",
    description: "Test Transaction",
    order_id: orderId, // This is the order_id created in the backend
    callback_url: "http://localhost:3000/dashbord", // Your success URL
    theme: {
      color: "#47fdb4",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// creating order from backend
async function razorpayOrder() {
  isLoading.value = true;

  try {
    if (
      Number(params.pack) === NaN ||
      Number(params.pack) < 0 ||
      Number(params.pack) > 2
    ) {
      toaster.add({ title: "Package not selected Properly." });
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error("Razorpay script could not be loaded.");

    const createOrderRes = await $fetch(
      `/backendApi/api/v1/payment/razorpay/makeorder`,
      {
        method: "POST",
        body: {
          orderedPackage: Number(params.pack),
          orderedPackageAmount: packageAmount.value || 1,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log(createOrderRes);

    if (createOrderRes.success) {
      completeRazorpayPayment(
        createOrderRes.data.newOrder.paymentGatwayOrderId,
        createOrderRes.data.newOrder.amount,
        createOrderRes.data.newOrder.currency
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-8 md:p-20 grid md:grid-cols-2 gap-x-10 gap-y-5">
      <div
        class="bg-white text-black space-y-5 text-center rounded-xl p-10 w-full order-1 md:order-2"
      >
        <p>Total price</p>
        <h3 class="text-5xl font-bold">
          ₹{{
            packageAmount *
            ORDER_PACKAGES_LIST[Number(params.pack)].perTokenPrice *
            ORDER_PACKAGES_LIST[Number(params.pack)].totalToken
          }}
        </h3>
        <div
          class="bg-black rounded-xl text-white text-left flex gap-2 justify-between p-2"
        >
          <p>
            {{ ORDER_PACKAGES_LIST[Number(params.pack)].type }} Package :
            {{ ORDER_PACKAGES_LIST[Number(params.pack)].totalToken }} token, ₹{{
              ORDER_PACKAGES_LIST[Number(params.pack)].perTokenPrice
            }}
            /token
          </p>
          <p>x {{ packageAmount }}</p>
        </div>
      </div>
      <div class="grid gap-5 h-fit order-2 md:order-1">
        <div
          class="bg-white h-fit text-black text-center rounded-xl p-2 w-full"
        >
          <p>Choose how many Package You want to buy.</p>
        </div>
        <div
          class="text-primary border-b-2 md:border-transparent pb-5 text-center text-2xl p-2 w-full flex justify-center items-center gap-5"
        >
          <UButton
            @click="() => changePackageAmount(-1)"
            class="rounded-full p-0"
          >
            <Icon name="heroicons:minus-small" class="w-6 h-6" />
          </UButton>
          <p>{{ packageAmount }}</p>
          <UButton
            @click="() => changePackageAmount(1)"
            class="rounded-full p-0"
          >
            <Icon name="heroicons:plus-small" class="w-6 h-6" />
          </UButton>
        </div>
      </div>
      <div class="order-3"></div>
      <div class="grid gap-5 order-4">
        <div
          class="bg-white text-black space-y-2 text-center rounded-xl p-10 w-full"
        >
          <Icon name="heroicons:lock-closed-solid" class="w-6 h-6" />
          <p>
            Your payment is 100% safe and secure use encryption to protect your
            data and obly work with verified payment getways. Your trust is our
            priority for us.
          </p>
        </div>
        <UButton
          :loading="isLoading"
          @click="razorpayOrder"
          class="w-full flex justify-center items-center rounded-xl"
          size="lg"
          label="Continue"
          icon="heroicons:chevron-right"
          trailing
        />
      </div>
    </div>
  </NuxtLayout>
</template>