<script setup>

defineProps({
  howTogenaretQuestionPaper: {
    type: Array ,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <div class="space-y-12">

    <!-- register User -->
    <div class=" space-y-4">
      <div
        class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
      >
      <Icon name="ic:baseline-person-add-alt" class=" w-6 h-6"/>
        <span>Register Account</span>
      </div>
      <p class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
        To register, click on the
        <NuxtLink to="/signup" class="text-[--bg-card] hover:opacity-90"
          >Sign up</NuxtLink
        >, fill in your details, verify your email, and start using the app. After Registering you also gonna get 10 free Token.
      </p>
    </div>

    <!-- How To Generate QuestionPaper -->
    <div class=" space-y-4">
      <div
        class="font-semibold text-gray-900 dark:text-[--bg-card] flex gap-2 items-center text-lg"
      >
      <Icon name="heroicons:plus-circle-solid" class=" w-6 h-6"/>
        <span>How To Generate QuestionPaper</span>
      </div>
      <div class="text-gray-500 dark:text-gray-400 leading-6 ml-8">
        
    <ul class="list-disc list-inside">
        <li v-bind:key="point" v-for="point in howTogenaretQuestionPaper">
            {{ point }}
        </li>
    </ul>
    </div>
    </div>
  </div>
</template>