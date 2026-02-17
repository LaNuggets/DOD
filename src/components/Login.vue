<script setup lang="ts">
import { saveToken } from '@/ts/saveload.ts';
import router from "@/ts/router";
import { ref, reactive } from 'vue';
import type { Form, Response } from '@/types/login';

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

<style scoped>
.login-form {
  font-family: 'Cinzel', serif;
  color: var(--black);
  background: linear-gradient(to bottom, var(--white-marble), var(--sky-blue));
  border: 3px solid var(--gold);
  border-radius: 15px;
  max-width: 400px;
  margin: 120px auto;
  padding: 30px 40px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  text-align: center;
}

.login-form div {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--gold);
  letter-spacing: 1px;
}

.login-form input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid var(--gold);
  border-radius: 25px;
  background: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-form input:focus {
  outline: none;
  border-color: var(--gold-light);
  box-shadow: 0 0 10px rgba(212,175,55,0.6);
}

.login-form .error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.login-form button {
  background: linear-gradient(to bottom, var(--gold-light), var(--gold));
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  padding: 10px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.login-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(212,175,55,0.6);
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>