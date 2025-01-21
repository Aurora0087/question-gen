<script setup>

useSeoMeta({
  title: "Billings",
});

const res = await useFetch("/backendApi/api/v1/payment/current/billings", {
  credentials: "include",
})

const router = useRouter();

if (res.error.value) {
  router.push("/login");
}

const viewBillIndex = ref(0);


</script>

<template>
  <NuxtLayout>
    <div v-if="res.data.value" class="p-16 space-y-8">
      <DotPattern
        class="absolute inset-0 -z-10 size-full fill-[--bg-dot] [mask-image:radial-gradient(white,transparent_85%)]"
      />
      <UButton @click="router.back()" class="p-2 rounded-full">
        <Icon name="heroicons:chevron-left" class="w-6 h-6" />
      </UButton>
      <div v-if="res.data.value.data.length > 0" class=" grid md:grid-cols-[1fr_1.61fr]">
        <div class="p-4 space-y-4 border-b md:border-b-0 md:border-r">
            <p>Invoice History</p>
            <div v-for="(bill,index) in res.data.value.data"
            :aria-selected="index===viewBillIndex"
            @click="viewBillIndex=index"
            v-bind:key="bill"
             class=" bill border-2 border-white/50 p-2 rounded-xl space-y-2 cursor-pointer hover:bg-white/20">
                <p>{{ formatDateTime(bill.createdAt) }}</p>
                <div class=" flex gap-2 items-center">
                    <Icon name="material-symbols:shopping-cart-sharp"/>
                    <p>₹{{ Number(bill.amount)/100 }}</p>
                </div>
            </div>
        </div>
        <div class="p-4">
            <div class="flex gap-2 items-center mb-4 border-b pb-4 text-nowrap">OrderId : <p class=" text-primary">{{ res.data.value.data[viewBillIndex]._id }}</p></div>
            <div class=" flex gap-2 justify-between items-center mb-8 text-xs">
                <div>Order Placed At : <p class=" text-primary">{{ formatDateTime(res.data.value.data[viewBillIndex].createdAt) }}</p></div>
                <div>Payment Completed At : <p class=" text-primary">{{ formatDateTime(res.data.value.data[viewBillIndex].razorpayPaymentSuccess.createdAt) }}</p></div>
            </div>
            <div class="flex gap-2 items-center justify-between">Ordered Token : <p class=" text-primary">{{ res.data.value.data[viewBillIndex].tokensBuying }}</p></div>
            <div class="flex gap-2 items-center justify-between mb-4">Price per Token : <p class=" text-primary">₹{{ (Number(res.data.value.data[viewBillIndex].amount)/100)/Number(res.data.value.data[viewBillIndex].tokensBuying) }}</p></div>
            <div class="flex gap-2 items-center justify-between border-y-2 border-[--bg-card] py-4">Ordered Total Amount : <p class=" text-primary">₹{{ Number(res.data.value.data[viewBillIndex].amount)/100 }}</p></div>
            <div class="flex gap-2 items-center justify-between mt-8">Payment Getway : <p class=" text-primary uppercase">{{ res.data.value.data[viewBillIndex].paymentGatway }}</p></div>
            <div class="flex gap-2 items-center justify-between">Payment Method : <p class=" text-primary uppercase">{{ res.data.value.data[viewBillIndex].razorpayPaymentSuccess.method }}</p></div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.bill[aria-selected='true']{
    background-color: rgb(255 255 255 / 0.2);
}
</style>