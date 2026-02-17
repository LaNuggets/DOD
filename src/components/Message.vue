<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const channelId = route.params.id

console.log("Channel ID:", channelId)

</script>

<template>

<h1>Hi</h1>
<MessageRainbow />

</template>

<style scoped></style>