<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  data: {
    username: string
    display_name: string
    img: string
    status: string
  }
}>()

const emit = defineEmits<{
  confirm: [payload: { display_name?: string; img?: string; status?: string }]
  close: []
}>()

const displayName = ref(props.data.display_name)
const img         = ref(props.data.img)
const status      = ref(props.data.status)

const confirm = () => {
  const payload: { display_name?: string; img?: string; status?: string } = {}

  const dn = displayName.value.trim()
  const im = img.value.trim()
  const st = status.value.trim()

  if (dn !== props.data.display_name) payload.display_name = dn
  if (im !== props.data.img)          payload.img          = im
  if (st !== props.data.status)       payload.status       = st

  emit('confirm', payload)
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">

      <div class="modal-header">
        <h3>✦ Modifier le profil</h3>
        <button class="close-x" @click="$emit('close')" aria-label="Fermer">✕</button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label>Nom d'affichage</label>
          <input v-model="displayName" placeholder="Ex: Adrien the GOAT" autocomplete="off" />
        </div>

        <div class="field">
          <label>Avatar <span class="hint">(URL)</span></label>
          <input v-model="img" type="url" placeholder="https://..." autocomplete="off" />
        </div>

        <div class="field">
          <label>Statut</label>
          <input v-model="status" placeholder="Coding stuff! It's fun!" autocomplete="off" />
        </div>

        <p class="hint-text">Laisse un champ vide pour le conserver tel quel.</p>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Annuler</button>
        <button class="btn-confirm" @click="confirm">Enregistrer</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  padding: 16px;
  z-index: 1000;
  animation: fadeIn 0.18s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-card {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(160deg, #fff 55%, #fdf8e8 100%);
  border: 2px solid #d4af37;
  border-radius: 16px;
  font-family: 'Cinzel', serif;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.1);
  overflow: hidden;
  animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
}
.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #111;
}
.close-x {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
}
.close-x:hover { color: #111; background: rgba(212, 175, 55, 0.12); }

.modal-body {
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #444;
  letter-spacing: 0.4px;
}
.hint { font-weight: 400; color: #999; font-size: 0.72rem; }

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: #111;
  background: #fffef8;
  border: 2px solid #e0c96a;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
}
.field input::placeholder { color: #bbb; font-style: italic; }

.hint-text {
  margin: 0;
  font-size: 0.72rem;
  color: #aaa;
  font-style: italic;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px 18px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.btn-cancel {
  padding: 9px 20px;
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #666;
  background: transparent;
  border: 2px solid #ccc;
  border-radius: 22px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-cancel:hover { border-color: #999; color: #333; }

.btn-confirm {
  display: inline-flex;
  align-items: center;
  padding: 9px 22px;
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #111;
  background: linear-gradient(to bottom, #f5d76e, #d4af37);
  border: none;
  border-radius: 22px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(212, 175, 55, 0.35);
  transition: all 0.2s;
}
.btn-confirm:hover {
  background: linear-gradient(to bottom, #fce47c, #e0ba3e);
  box-shadow: 0 5px 16px rgba(212, 175, 55, 0.5);
  transform: translateY(-1px);
}
.btn-confirm:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
}
</style>