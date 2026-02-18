<script setup lang="ts"></script>

<template>
  <div class="page">

    <div class="container">
      <h1>404</h1>
      <h2>Même les Dieus peuvent ce perdre...</h2>
      <p>
        Il semblerait que vous vous soyez égaré dans les cieux.
      </p>

      <RouterLink to="/" class="btn">
        Retour vers l'Olympe
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;500&display=swap');

.page {
  --gold: #d4af37;
  --white: white;

  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #0b1c2d, var(--white), #000000);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: var(--white);
  font-family: 'Montserrat', sans-serif;
}

.container {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  padding: 50px;
  background: rgba(0, 0, 0, 0.65);
  border: 2px solid var(--gold);
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
  backdrop-filter: blur(6px);
}

h1 {
  font-family: 'Cinzel', serif;
  font-size: 120px;
  color: var(--gold);
  margin-bottom: 10px;
  text-shadow: 0 0 25px var(--gold);
}

h2 {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--white);
}

p {
  margin-bottom: 35px;
  color: var(--white);
  line-height: 1.6;
}

.btn {
  text-decoration: none;
  padding: 14px 35px;
  background: var(--gold);
  color: black;
  font-weight: bold;
  border-radius: 40px;
  transition: 0.3s ease;
  box-shadow: 0 0 20px var(--gold);
}

.btn:hover {
  background:var(--white);
  color: #0b1c2d;
  box-shadow: 0 0 30px var(--white);
}

/* Responsive */
@media (max-width: 768px) {
  h1 {
    font-size: 80px;
  }

  h2 {
    font-size: 22px;
  }

  .container {
    padding: 30px;
  }
}

</style>
