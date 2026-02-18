import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Message from '@/components/Message.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { loadToken, saveToken } from '@/ts/saveload'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    children: [
      {
        path: 'channel/:id/:id2?',
        name: 'channel-details',
        components: {
          default: Message,   // panneau gauche (ou unique)
          secondary: Message, // panneau droit (split view)
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Vérifie si le token JWT est encore valide auprès de l'API.
 * Note : on évite d'importer api.ts ici pour éviter la dépendance circulaire
 * (router → api → store → router).
 */
const isTokenValid = async (token: string | null): Promise<boolean> => {
  if (!token) return false
  try {
    const response = await fetch('https://edu.tardigrade.land/msg/protected/extend_session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      // Profite de l'appel pour rafraîchir le token si l'API en renvoie un nouveau
      const data = await response.json().catch(() => null)
      if (data?.token) saveToken(data.token)
    }
    return response.ok
  } catch {
    return false
  }
}

router.beforeEach(async (to) => {
  const token = loadToken()
  const valid = await isTokenValid(token)

  if (!valid && to.name !== 'Login') return { name: 'Login' }
  if (valid && to.name === 'Login') return { name: 'Home' }
})

export default router
