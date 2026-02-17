<script setup lang="ts">

import { ref, reactive, watch } from "vue";
import { loadToken } from "@/ts/saveload.ts";
import { useChannelStore } from '@/ts/channelStore';
import type{ ChannelNewMetaData } from '@/types/channel';

const channelStore = useChannelStore();

const props = defineProps<{
  channelId: string
}>();

const showPopup = ref(false);
const error = ref<string | null>(null);
const token = loadToken();

const baseTheme = {
  primary_color: "#FFFFFF",
  primary_color_dark: "#1C1C1C",
  accent_color: "#FFD700",
  secondary_accent: "#87CEEB",
  text_color: "#1C1C1C",
  accent_text_color: "#FFFFFF"
};

const form: ChannelNewMetaData = reactive({
  name: null,
  img: null,
  theme: {}
});

const colorInputs = reactive({ ...form.theme });


watch(showPopup, async (isOpen) => {
  if (isOpen) {
    await loadChannelData();
  }
});

async function loadChannelData() {

    try {
        const resp = await fetch('https://edu.tardigrade.land/msg/protected/user/channels', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!resp.ok) throw new Error(`Error ${resp.status}: Failed to fetch channels`)
        const list = await resp.json()
        const ch = list.find((ch: any) => ch.id === Number(props.channelId))
        if (ch) {
          form.name = ch.name;
          form.img = ch.img;
          if (ch.theme === null) {
            form.theme = { ...baseTheme };
            Object.assign(colorInputs, { ...baseTheme });
          } else {
            form.theme = { ...ch.theme };
            Object.assign(colorInputs, { ...ch.theme });
          }

        }
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Error fetching API'
    }
}

const submitForm = async () => {

	error.value = null;

	try {
      const requestBody: ChannelNewMetaData = {
        name: form.name?.trim() || null,
        img: form.img?.trim() || null,
        theme: {
          primary_color: colorInputs.primary_color.toUpperCase(),
          primary_color_dark: colorInputs.primary_color_dark.toUpperCase(),
          accent_color: colorInputs.accent_color.toUpperCase(),
          text_color: colorInputs.text_color.toUpperCase(),
          accent_text_color: colorInputs.accent_text_color.toUpperCase()
        }
      };

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

    channelStore.updateChannel({
      id: Number(props.channelId),
      name: requestBody.name,
      img: requestBody.img,
      theme: requestBody.theme
    });

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
        <label>Change channel theme colors :</label>
        <input type="color" v-model="colorInputs.primary_color" />
        <input type="color" v-model="colorInputs.primary_color_dark" />
        <input type="color" v-model="colorInputs.accent_color"/>
        <input type="color" v-model="colorInputs.text_color" />
        <input type="color" v-model="colorInputs.accent_text_color" />
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