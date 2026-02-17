<script setup lang="ts">

import { useRoute } from 'vue-router';
import { watch, onMounted} from 'vue';

const route = useRoute();


function loadMessage(id) {
	console.log("Channel ID:", id);
	// for you my kyky
}

onMounted(() => {
	loadMessage(route.params.id);
});


// Load new id on url change.
watch(
	() => route.params.id,
	(newId) => {
		loadMessage(newId)
	}
)


</script>

<template>

<h1>Hi</h1>

</template>

<style scoped></style>