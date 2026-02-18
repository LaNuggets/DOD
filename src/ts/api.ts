/**
 * api.ts — Couche d'accès API centralisée.
 * Aucun appel fetch ne doit se trouver dans les composants ou vues.
 * Chaque fonction retourne la donnée typée ou lève une Error.
 */

import { useStore } from '@/ts/store'

const BASE = 'https://edu.tardigrade.land/msg'

// ── Helpers privés ──────────────────────────────────────────────────────────

function getToken(): string {
  const store = useStore()
  const token = store.getToken()
  if (!token) throw new Error('No auth token')
  return token
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Erreur ${response.status}`
    try {
      const data = await response.json()
      message = data.message || message
    } catch { /* ignore */ }
    throw new Error(message)
  }

  // Certains endpoints retournent un body vide (200 sans JSON)
  const text = await response.text()
  return text ? JSON.parse(text) : (undefined as unknown as T)
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function apiLogin(
  username: string,
  password: string
): Promise<{ token: string; admin: boolean }> {
  const response = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || `Mauvais identifiants`)
  }

  return response.json()
}

export async function apiExtendSession(): Promise<{ token: string; admin: boolean }> {
  return request('/protected/extend_session', { method: 'POST' })
}

// ── Channels ────────────────────────────────────────────────────────────────

import type { Channel, ChannelMetaData, ChannelNewMetaData } from '@/types/channel'

export async function apiGetChannels(): Promise<Channel[]> {
  return request('/protected/user/channels')
}

export async function apiCreateChannel(data: ChannelMetaData): Promise<number> {
  return request('/protected/channel', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiDeleteChannel(channelId: number): Promise<void> {
  return request(`/protected/channel/${channelId}`, { method: 'DELETE' })
}

export async function apiUpdateChannelMetadata(
  channelId: string | number,
  data: ChannelNewMetaData
): Promise<void> {
  return request(`/protected/channel/${channelId}/update_metadata`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function apiAddUserToChannel(
  channelId: string | number,
  username: string
): Promise<void> {
  return request(
    `/protected/channel/${channelId}/user/${encodeURIComponent(username)}`,
    { method: 'PUT' }
  )
}

export async function apiRemoveUserFromChannel(
  channelId: string | number,
  username: string
): Promise<void> {
  return request(
    `/protected/channel/${channelId}/user/${encodeURIComponent(username)}`,
    { method: 'DELETE' }
  )
}

// ── Messages ────────────────────────────────────────────────────────────────

import type { Message, Content } from '@/types/messageType'

export async function apiGetMessages(
  channelId: string,
  offset = 0
): Promise<Message[]> {
  return request(`/protected/channel/${channelId}/messages/${offset}`)
}

export async function apiPostMessage(
  channelId: string,
  content: Content
): Promise<void> {
  return request(`/protected/channel/${channelId}/message`, {
    method: 'POST',
    body: JSON.stringify(content),
  })
}

export async function apiModerateMessage(
  channelId: string,
  message: Message
): Promise<void> {
  return request(`/protected/channel/${channelId}/message/moderate`, {
    method: 'POST',
    body: JSON.stringify(message),
  })
}

// ── Users ───────────────────────────────────────────────────────────────────

import type { UserMeta } from '@/types/userType'

export async function apiGetUsersMeta(usernames: string[]): Promise<UserMeta[]> {
  const list = usernames.map(encodeURIComponent).join(',')
  return request(`/protected/user/meta?users=${list}`)
}

export async function apiSaveUserMeta(data: UserMeta): Promise<void> {
  return request('/protected/user/meta', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
