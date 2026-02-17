<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
import ChannelBox from '@/components/ChannelBox.vue';
import MessageRainbow from '@/components/MessageRainbow.vue';

</script>

<template>

  <ChannelList />
  <ChannelBox />
  <router-view />
  <MessageRainbow />

</template>

<style scoped>


</style>