<script setup>
const { appName } = useAppConfig();

useSeoMeta({
  title: `Checkout-${appName}`,
});

const params = useUrlSearchParams("history");
const toaster = useToast();
const router = useRouter();

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
  isNaN(Number(params.pack)) ||
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
    name: appName,
    description: "Test Transaction",
    order_id: orderId, // This is the order_id created in the backend
    callback_url: "/dashbord", // success URL
    theme: {
      color: "#47fdb4",
    },
    handler: function () {
      // after payment success
      toaster.add({
        title: "Token added succesFullly.",
        color: "primary",
        icon: "i-heroicons-check-badge",
      });

      window.location.href = "/dashbord";
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();

  rzp.on("payment.failed", function (response) {
    // after payment failed
    toaster.add({ title: "Error code", description: response.error.code });
    toaster.add({
      title: "Error description",
      description: response.error.description,
    });
    toaster.add({ description: response.error.source });
    toaster.add({ description: response.error.reason });
  });
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
          orderedPackageAmount: Number(packageAmount.value) || 1,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (createOrderRes.success) {
      completeRazorpayPayment(
        createOrderRes.data.newOrder.paymentGatwayOrderId,
        createOrderRes.data.newOrder.amount,
        createOrderRes.data.newOrder.currency
      );
    }
  } catch (error) {
    toaster.add({
      title: "Error",
      description: String(error.data.message || "Can't create Razorpay Order."),
    });
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
            ORDER_PACKAGES_LIST[Number(params.pack)]
              ? packageAmount *
                ORDER_PACKAGES_LIST[Number(params.pack)].perTokenPrice *
                ORDER_PACKAGES_LIST[Number(params.pack)].totalToken
              : 0
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
        <div
          class="text-primary border-b-2 md:border-transparent pb-5 text-center p-2 w-full flex flex-col gap-4"
        >
          <div
            class="bg-white h-fit text-black text-center text-xl rounded-xl p-2 w-full"
          >
          <Icon name="heroicons:credit-card-20-solid" class="w-6 h-6"/>
            <p>Choose Payment Gateway.</p>
          </div>
          <div
            class="bg-gradient-to-r cursor-pointer from-teal-400 to-yellow-200 text-black flex gap-4 justify-center items-center text-center rounded-xl p-2 w-full hover:opacity-90"
          >
            <Icon name="simple-icons:razorpay" class="w-6 h-6" />
            <p>Razorpay</p>
          </div>
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
        <div
          class="bg-gradient-to-r from-teal-400 to-yellow-200 text-black space-y-2 text-center rounded-xl p-10 w-full"
        >
          <Icon name="heroicons:sparkles" class="w-6 h-6" />
          <p>
            The payment gateway is currently in test mode, so no actual charges
            will be deducted from your account.
          </p>
        </div>
        <UButton
          :loading="isLoading"
          @click="razorpayOrder"
          class="w-full flex justify-center items-center rounded-xl bg-[--bg-card]"
          size="lg"
          label="Continue"
          icon="heroicons:chevron-right"
          trailing
        />
      </div>
    </div>
  </NuxtLayout>
</template>