// stores/channelStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Channel }  from '@/types/channel';

export const useChannelStore = defineStore('channelStore', () => {
    const channels = ref<Channel[]>([]);

    const setChannels = (newChannels: Channel[]) => {
      channels.value = newChannels;
    }

    // Can update one or more value, but need at least an id
    const updateChannel = (updated: Partial<Channel> & { id: number }) => {
      const ch = channels.value.find(c => c.id === updated.id);
      if (ch) {
        Object.assign(ch, updated);
      } else {
        channels.value.push(updated as Channel);
      }
    }

    const removeChannel = (channelId: number) => {
      channels.value = channels.value.filter(c => c.id !== channelId);
    }

    return {
      channels,
      setChannels,
      updateChannel,
      removeChannel
    }
})
