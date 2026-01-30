<script setup lang="ts">
const props = defineProps({
    channel : Object,
    id : Number,
});

</script>

<template>
    <div class="item">
        <label>
            {{ channel.img }}
            <RouterLink :to="`/channel/${channel.id}`" tag="button">{{ channel.name }}</RouterLink>
        </label>
    </div>
</template>

<style scoped></style>