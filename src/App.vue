<script setup lang="ts">

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: "Hitokun's",
  meta: [
    { name: 'description', content: "Hitokun's Homepage" },
    { property: `og:locale`, content: `en_EN` },
    {name: 'author', content: 'Hitoshi Wada'},
    { key: `og:type`, property: `og:type`, content: `website` },
  ]
})
</script>

<template>
  <router-view />
</template>
