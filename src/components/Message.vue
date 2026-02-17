<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import ModifyChannel from '@/components/ModifyChannel.vue';
import { useRoute } from 'vue-router';
import { ref, watch, onMounted} from 'vue';

const route = useRoute();
const channelId = ref(route.params.id as string);


function loadMessage(id : string) {
	console.log("Channel ID:", id);
	// for you my kyky
}

onMounted(() => {
	loadMessage(channelId.value);
});


// Load new id on url change.
watch(
	() => route.params.id as string,
	(newId) => {
		channelId.value = newId as string;
		loadMessage(newId)
	}
)

</script>

<template>

<h1>Hi</h1>
<ModifyChannel :channel-id="channelId" />
<MessageRainbow />

</template>

<style scoped></style>