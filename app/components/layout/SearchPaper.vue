<script setup>

const router = useRouter();
const toster = useToast();

const groups = [
  {
    key: "users",
    label: (q) => q && `Users matching “${q}”...`,
    search: async (q) => {
      if (!q) {
        return [];
      }

      try {
        const res = await $fetch("/backendApi/api/v1/chats//mcq/current/search", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', 
          body: {
            q
          }
        });
        

      return res.data.map((paper) => ({
        id: paper._id,
        label: paper.topic,
        to:`/dashbord/mcq/${paper._id}`,
      }));
      } catch (err) {
        toster.add({title:"Error",description:String(err.message)})
        return []
      }
      
    },
  },
];

function onSelect(option) {
    router.push(option.to)
}
</script>

<template>
    <UCommandPalette :groups="groups" :autoselect="false" @update:model-value="onSelect"/>
</template>