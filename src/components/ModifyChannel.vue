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
  theme: baseTheme
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
    <button class="action-btn" @click="showPopup = true">Modify channel</button>


    <div v-if="showPopup" class="overlay" @click.self="showPopup = false">
	<div class="popup">
	
	    <p v-if="error" class="error">Error : impossible to modify this channel !</p>
        <h2>Change Groupe datas</h2>

        <div class="field">
          <label>Channel name :</label>
          <input type="text" v-model="form.name" />
        </div>

        <div class="field">
          <label>Channel image :</label>
          <input type="img" v-model="form.img" />
        </div>

      <div class="field">
        <label>Channel theme colors :</label>
        <input type="color" v-model="colorInputs.primary_color">Background color</input>
        <input type="color" v-model="colorInputs.primary_color_dark">Message fade color</input>
        <input type="color" v-model="colorInputs.accent_color">Message line color</input>
        <input type="color" v-model="colorInputs.text_color">Text color</input>
        <input type="color" v-model="colorInputs.accent_text_color">Message author color</input>
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
  background: rgba(10, 8, 5, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}

.error {
 color: red;
 font-weight: bold;
}

/* =========================================
   BOUTONS
   ========================================= */
.action-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 2px solid var(--gold);
  border-radius: 6px;
  background: linear-gradient(to bottom, #fff, #ebebeb);
  color: var(--black);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Le premier bouton est poussé à droite */
.action-btn:first-of-type {
  margin-left: auto;
}

.action-btn:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fff, #f8f8f8);
  border-color: var(--gold-light);
  box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #ccc;
}


/* =========================================
   POPUP - THÈME OLYMPE / PANTHÉON
   ========================================= */

/* Variables locales si non globales */
/* --gold: #D4AF37; --gold-light: #e8c84a; --black: #1a1a1a; */

.popup {
  background: linear-gradient(160deg, #fdfaf4 0%, #f0e9d6 100%);
  padding: 32px 36px;
  border-radius: 10px;
  min-width: 340px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  border: 2px solid var(--gold);
  box-shadow:
    0 0 0 1px rgba(212, 175, 55, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

/* Ligne décorative dorée en haut */
.popup::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  opacity: 0.6;
}

/* Ligne décorative dorée en bas */
.popup::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  opacity: 0.6;
}

.popup h2 {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--black);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0 0 24px 0;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.35);
}

/* ---- Champs ---- */
.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 18px;
  text-align: left;
}

.field label {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #7a6535;
}

.field input[type="text"],
.field input[type="img"] {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid rgba(212, 175, 55, 0.45);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.75);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--black);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.field input[type="text"]:focus,
.field input[type="img"]:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}

/* ---- Color pickers ---- */
.field input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  width: 32px;
  height: 32px;
  border: 1.5px solid rgba(212, 175, 55, 0.5);
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: white;
  vertical-align: middle;
  margin-right: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input[type="color"]:hover {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}

/* Wrapper pour aligner chaque ligne couleur */
.field > label + * {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

/* ---- Erreur ---- */
.error {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  color: #b34040;
  background: rgba(179, 64, 64, 0.08);
  border: 1px solid rgba(179, 64, 64, 0.25);
  border-radius: 6px;
  padding: 8px 14px;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

/* ---- Boutons de la popup ---- */
.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.25);
}

.buttons button {
  padding: 8px 22px;
  font-size: 0.82rem;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 0.6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* Submit — doré/principal */
.buttons button:first-child {
  background: linear-gradient(to bottom, #e8c84a, #c9a227);
  color: #1a1a1a;
  border: 2px solid var(--gold);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.buttons button:first-child:hover {
  background: linear-gradient(to bottom, #f0d060, #d4af37);
  box-shadow: 0 4px 14px rgba(212, 175, 55, 0.45);
  transform: translateY(-2px);
}

/* Cancel — secondaire discret */
.buttons button:last-child {
  background: linear-gradient(to bottom, #fff, #ebebeb);
  color: var(--black);
  border: 2px solid rgba(212, 175, 55, 0.5);
}

.buttons button:last-child:hover {
  border-color: var(--gold);
  box-shadow: 0 3px 10px rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.buttons button:active {
  transform: translateY(0);
  box-shadow: none;
}

</style>