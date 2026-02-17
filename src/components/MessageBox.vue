<script setup lang="ts">

defineProps<{
  data: Message
}>()

interface Content {
    type: string, // Image or Text
    value: string,
}

interface Message {
    channel_id: number,
    timestamp: Date,
    author: string,
    content: Content
};

</script>

<template>
    <div>
        <p>{{ data.author }}</p>
        <p v-if="new Date(data.timestamp).getDate() != new Date(Date.now()).getDate()">{{ new Date(data.timestamp).toLocaleString() }}</p>
        <p v-else>{{ new Date(data.timestamp).getHours() + ":" + new Date(data.timestamp).getMinutes()}}</p>
        <p v-if="data.content.type == 'Text'">{{ data.content.value }}</p>
        <img v-else :src="data.content.value" />
    </div>
</template>

<style scoped>
</style>