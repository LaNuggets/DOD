<script setup lang="ts">

const connection = () => {
    let userName = document.getElementsByName("userName").values
    let passWord = document.getElementsByName("passWord").values
    // place API request here

};
</script>

<template>

  <div>
    <h3>Login :</h3>
    <h4>User Name :</h4>
    <input name="userName" type="text">
    <h4>Password :</h4>
    <input name="passWord" type="passWord">
    <button name="btnConnection" @click="">Connection</button>
  </div>

</template>

<style scoped></style>