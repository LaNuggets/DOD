<script setup lang="ts">
import MessageRainbow from '@/components/MessageRainbow.vue';
import { useRoute } from 'vue-router';
import { watch, onMounted} from 'vue';

const route = useRoute();


function loadMessage(id : string) {
	console.log("Channel ID:", id);
	// for you my kyky
}

onMounted(() => {
	loadMessage(route.params.id as string);
});


// Load new id on url change.
watch(
	() => route.params.id as string,
	(newId) => {
		loadMessage(newId)
	}
)


</script>

<template>

<h1>Hi</h1>
<MessageRainbow />

</template>

<style scoped></style>