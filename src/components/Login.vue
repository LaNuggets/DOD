<script setup lang="ts">
import { saveToken } from '@/ts/saveload.ts';
import router from "@/ts/router";
import { ref, reactive } from 'vue';

interface Form {
  username: string,
  password: string,
}

interface Response {
  token: string
  admin: boolean
}

const form : Form = {
  username : '',
  password : '',
}

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const connection = async () => {
  if (!form.username || !form.password) {
    error.value = 'Email and username require'
    return
  }

  loading.value = true
  error.value = null

  try {
    const requestBody: Form = form
    
    const response = await fetch("https://edu.tardigrade.land/msg/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    const data: Response = await response.json()
	
    console.log(data.token)
    console.log(data.admin)

    success.value = true
	
	// Put the token in the local storage
	saveToken(data.token)
	
	// Redirect to home page
	router.push({ path: '/' })

  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error during conection'
  } finally {
    loading.value = false
  }
};
</script>

<template>
  <form @submit.prevent="connection" class="login-form">
    <div>
      <label>Username : </label>
      <input 
        v-model="form.username" 
        type="text" 
        required 
        placeholder="username"
      />
    </div>

    <div>
      <label>Password : </label>
      <input 
        v-model="form.password" 
        type="password" 
        required 
        minlength="6"
      />
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    
    <button type="submit" :disabled="loading">
		      {{ loading ? 'loging...' : 'Login' }}
    </button>

  </form>
</template>

<style scoped></style>