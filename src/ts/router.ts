import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { loadToken } from "@/ts/saveload.ts";
import { createRouter, createWebHistory} from "vue-router";
import CreateChannelView from "@/views/CreateChannelView.vue";

// Set up the routes
const routes = [
		{
            path : "/:",
            name : "Home",
            component : HomeView,
        },
        {
            path : "/login",
            name : "Login",
            component : LoginView,
            
        },
        {
            path: '/channel/create',
            name : "Channel",
            component : CreateChannelView
        },
	    {
			path: '/channel/:id',
			name : "Channel Details",
			component : HomeView
		},
        {
            path: '/:pathMatch(.*)*',
            name : "Not Found !",
            component : NotFoundView
        }
]

// Create router with routes and history
const router = createRouter({
	history : createWebHistory(),
	routes
})


export default router

// Safe guard, cant access other pages if your not connected
router.beforeEach((to, from) => {

	// If there is a token, the user is connected
	let token = loadToken()
	if(!token && to.name !== 'Login') {
		return { name : 'Login' }
	}

	// If the user is already login redirect to home page
	if(token && to.name === 'Login') {
		return { name: 'Home'}
	}
})
