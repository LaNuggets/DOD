<script setup lang="ts">

import { ref } from "vue";
import { loadToken } from "@/ts/saveload.ts";

const props = defineProps<{
  channelId: string
}>();


const showPopup = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const form : ChannelNewMetaData = {
  name : null,
  img : null,
  theme : {
    "primary_color": null,
    "primary_color_dark": null,
    "accent_color": null,
    "text_color": null,
    "accent_text_color": null
  },
};

const submitForm = async ():void => {

	error.value = null;

	try {
	    const requestBody: ChannelNewMetaData = form;

		// Check if the fields are empty
		requestBody.name = requestBody.name?.trim() || null;
		requestBody.img = requestBody.img?.trim() || null;

		Object.entries(requestBody.theme).forEach(([key, value]) => {
		  requestBody.theme[key] = value?.trim() || null;
		});


		const token = loadToken();
		const response = await fetch(`https://edu.tardigrade.land/msg/protected/channel/${props.channelId}/update_metadata`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

    	if (!response.ok) {
		      const errorData = await response.json()
			  throw new Error(errorData.message || `Erreur ${response.status}`)
		}
		closePopup();

	} catch (e: unknown) {
	    error.value = e instanceof Error ? e.message : 'Error during modification request.';
	}
}

function closePopup() {
  showPopup.value = false;
}

</script>

<template>

  <div class="app">
    <button @click="showPopup = true">Open Popup</button>


    <div v-if="showPopup" class="overlay" @click.self="showPopup = false">
	<div class="popup">
	
	    <p v-if="error" class="error">Error : impossible to modify this channel !</p>
        <h2>Change Groupe datas</h2>

        <div class="field">
          <label>Change channel name :</label>
          <input type="text" v-model="form.name" />
        </div>

        <div class="field">
          <label>Change channel image :</label>
          <input type="img" v-model="form.img" />
        </div>

        <div class="field">
          <label>Change channel themes colors :</label>
          <input type="text" v-model="form.theme.primary_color" />
          <input type="text" v-model="form.theme.primary_color_dark" />
          <input type="text" v-model="form.theme.accent_color" />
          <input type="text" v-model="form.theme.text_color" />
          <input type="text" v-model="form.theme.accent_text_color" />
        </div>

        <div class="buttons">
          <button @click="submitForm">Submit</button>
          <button @click="closePopup">Cancel</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  min-width: 250px;
  text-align: center;
}

.error {
 color: red;
 font-weight: bold;
}

</style>