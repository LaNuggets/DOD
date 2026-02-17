<script setup lang="ts">

import { useRoute } from 'vue-router'

const route = useRoute()
const channelId = route.params.id

console.log("Channel ID:", channelId)

</script>

<template>

<h1>Hi</h1>

</template>

<style scoped></style>